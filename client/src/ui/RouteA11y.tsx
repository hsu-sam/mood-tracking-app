import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const TITLES: Record<string, string> = {
  "/home": "Home",
  "/login": "Log in",
  "/signup": "Sign up",
  "/onboarding": "Personalize your experience",
  "/forgot-password": "Forgot password",
  "/reset-password": "Reset password",
};

/**
 * SPA route changes don't reload the page, so screen readers hear nothing.
 * On navigation: update document.title, announce it in a live region, and
 * move focus to the new page's <main> so keyboard users start at the top.
 */
export default function RouteA11y() {
  const { pathname } = useLocation();
  const [announcement, setAnnouncement] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    const page = TITLES[pathname] ?? "Page not found";
    document.title = `${page} | Mood Tracker`;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setAnnouncement(`Navigated to ${page}`);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>
  );
}
