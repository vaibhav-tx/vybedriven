import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ search }: { search: Record<string, unknown> }) => {
    const next = typeof search["next"] === "string" ? search["next"] : "/";
    throw redirect({ to: "/auth", search: { mode: "signin", next } });
  },
  component: () => null,
});
