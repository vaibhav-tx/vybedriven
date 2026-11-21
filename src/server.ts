import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/d1" && request.method === "POST") {
        try {
          const body = (await request.json()) as { sql?: string; params?: any[] };
          const { sql, params = [] } = body || {};
          const CF_ACCOUNT_ID =
            process.env["CLOUDFLARE_ACCOUNT_ID"] || "dfd353579afb6efbf5f3eeb63cec3f1f";
          const CF_DB_ID =
            process.env["CLOUDFLARE_D1_DATABASE_ID"] || "68d5ad88-bd27-46c5-963f-edc5286847c9";
          const CF_TOKEN = process.env["CLOUDFLARE_D1_API_TOKEN"] || "";

          const cfRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DB_ID}/query`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${CF_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sql, params }),
            },
          );

          const data = (await cfRes.json()) as any;
          return new Response(
            JSON.stringify({
              success: true,
              results: data.result?.[0]?.results || [],
              meta: data.result?.[0]?.meta || {},
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (e: any) {
          return new Response(
            JSON.stringify({ success: false, error: e?.message || "D1 proxy error", results: [] }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
