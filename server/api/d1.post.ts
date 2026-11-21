import { defineEventHandler, readBody } from "h3";

const CF_ACCOUNT_ID =
  process.env["CLOUDFLARE_ACCOUNT_ID"] ||
  "dfd353579afb6efbf5f3eeb63cec3f1f";

const CF_DB_ID =
  process.env["CLOUDFLARE_D1_DATABASE_ID"] ||
  "68d5ad88-bd27-46c5-963f-edc5286847c9";

const CF_TOKEN = process.env["CLOUDFLARE_D1_API_TOKEN"] || "";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { sql, params = [] } = body || {};

    if (!sql || typeof sql !== "string") {
      return { success: false, error: "SQL query string required", results: [] };
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DB_ID}/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText, results: [] };
    }

    const data = await res.json();
    return {
      success: true,
      results: data.result?.[0]?.results || [],
      meta: data.result?.[0]?.meta || {},
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return { success: false, error: message, results: [] };
  }
});
