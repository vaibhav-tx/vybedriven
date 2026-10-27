import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ search }: { search: Record<string, unknown> }) => {
    const next = typeof search["next"] === "string" ? search["next"] : "/";
    throw redirect({ to: "/auth", search: { mode: "signup", next } });
  },
  component: () => null,
});
