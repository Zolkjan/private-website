"use client";

import { Component, useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Application } from "@splinetool/runtime";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a]" aria-hidden="true" />
  ),
});

const SplineFallback = () => (
  <div
    className="w-full h-full"
    style={{
      background:
        "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(4,178,217,0.08) 0%, rgba(10,10,10,0) 70%), #0a0a0a",
    }}
    aria-hidden="true"
  />
);

// Last-resort boundary for unexpected runtime errors after the pre-check
class SplineErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SplineFallback /> : this.props.children;
  }
}

// Check API availability before mounting; runtime errors use the boundary.
const SplineScene = () => {
  const [status, setStatus] = useState<"pending" | "ok" | "unavailable">(
    "pending",
  );
  const [hasLayoutSize, setHasLayoutSize] = useState(false);
  const appRef = useRef<Application | null>(null);
  const isVisibleRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check API presence only — no context created, no side effects.
    // SplineErrorBoundary handles runtime failures if a context later fails.
    const ok =
      typeof WebGLRenderingContext !== "undefined" ||
      typeof WebGL2RenderingContext !== "undefined";
    setStatus(ok ? "ok" : "unavailable");
  }, []);

  // Wait for the responsive viewport to have a real size before mounting the
  // WebGPU canvas. Some browsers report a temporary 0×0 size during layout.
  useEffect(() => {
    const container = containerRef.current;
    if (status !== "ok" || !container) return;

    const updateSizeState = () => {
      const { width, height } = container.getBoundingClientRect();
      const ready = width > 0 && height > 0;
      setHasLayoutSize((current) => current || ready);
    };

    updateSizeState();
    const observer = new ResizeObserver(updateSizeState);
    observer.observe(container);
    return () => observer.disconnect();
  }, [status]);

  // Pause Spline render loop when scrolled out of view → frees GPU for scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const app = appRef.current;
        if (!app) return;
        if (entry.isIntersecting && !document.hidden) {
          if (app.isStopped) app.play();
        } else {
          if (!app.isStopped) app.stop();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    const onVisibility = () => {
      const app = appRef.current;
      if (!app) return;
      if (isVisibleRef.current && !document.hidden) {
        if (app.isStopped) app.play();
      } else if (!app.isStopped) app.stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [status]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const installWheelBridge = () => {
      const frame = container.querySelector("iframe");
      const html = frame?.srcdoc;
      if (!frame || !html || html.includes("__portfolioSplineWheel")) return;

      const document = new DOMParser().parseFromString(html, "text/html");
      const script = document.createElement("script");
      script.textContent = `window.addEventListener("wheel", (event) => {
        event.preventDefault();
        window.parent.postMessage({ type: "__portfolioSplineWheel", deltaX: event.deltaX, deltaY: event.deltaY, deltaMode: event.deltaMode }, "*");
      }, { passive: false });`;
      document.body.appendChild(script);
      frame.srcdoc = `<!doctype html>\n${document.documentElement.outerHTML}`;
    };

    const onMessage = (event: MessageEvent) => {
      const frame = container.querySelector("iframe");
      if (
        event.source !== frame?.contentWindow ||
        event.data?.type !== "__portfolioSplineWheel"
      )
        return;

      const { deltaX, deltaY, deltaMode } = event.data;
      if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) return;
      const unit =
        deltaMode === 1 ? 16 : deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy({ left: deltaX * unit, top: deltaY * unit, behavior: "instant" });
    };

    const observer = new MutationObserver(installWheelBridge);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["srcdoc"],
    });
    window.addEventListener("message", onMessage);
    installWheelBridge();
    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, [status]);

  if (status === "unavailable") return <SplineFallback />;
  if (status === "pending")
    return <div className="h-full min-h-px w-full min-w-px bg-[#0a0a0a]" aria-hidden="true" />;

  return (
    <div
      ref={containerRef}
      className="h-full min-h-px w-full min-w-px"
      onWheelCapture={(event) => event.stopPropagation()}
    >
      <SplineErrorBoundary>
        {hasLayoutSize && (
          <Spline
            renderOnDemand
            scene="https://prod.spline.design/ugrRUma4IHA2tD4s/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
            onLoad={(app) => {
              appRef.current = app;
              if (!isVisibleRef.current || document.hidden) app.stop();
            }}
          />
        )}
      </SplineErrorBoundary>
    </div>
  );
};


export default SplineScene;
