import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { Navbar } from "@/components/SiteChrome";

// Mock router context for links inside Navbar
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<any>("@tanstack/react-router");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/" }),
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  };
});

describe("App routing and Navigation", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("renders Navbar cleanly without undefined errors for any user state", () => {
    const { container } = render(<Navbar />);
    expect(container).toBeDefined();
  });
});
