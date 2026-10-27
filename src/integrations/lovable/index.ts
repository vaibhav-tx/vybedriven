import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import type { OAuthProvider } from "@lovable.dev/cloud-auth-js";
import { supabase } from "../supabase/client";

const previewHost =
  (typeof process !== "undefined" && process.env["LOVABLE_PREVIEW_HOST"]) ||
  "5f5288a1-f6cb-46b2-ac33-85d0a2cc472a.lovableproject.com";

const getOauthBrokerUrl = () => {
  if (typeof window === "undefined") return "/~oauth/initiate";
  const host = window.location.hostname;
  if (host.endsWith("lovableproject.com") || host.endsWith("lovable.app")) {
    return "/~oauth/initiate";
  }
  return `https://${previewHost}/~oauth/initiate`;
};

const lovableAuth = createLovableAuth({
  oauthBrokerUrl: getOauthBrokerUrl(),
});

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: OAuthProvider, opts?: SignInOptions) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        ...opts,
        extraParams: {
          ...opts?.extraParams,
        },
      });

      if (result.redirected) {
        return result;
      }

      if (result.error) {
        return result;
      }

      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    },
  },
};
