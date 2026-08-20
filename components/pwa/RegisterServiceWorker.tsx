"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    import("@serwist/window").then(({ Serwist }) => {
      const serwist = new Serwist("/sw.js", { scope: "/" });
      serwist.register();
    });
  }, []);

  return null;
}
