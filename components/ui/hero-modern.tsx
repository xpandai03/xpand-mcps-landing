"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const STYLE_ID = "hero3-animations";

const getRootTheme = () => {
  if (typeof document === "undefined") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }

  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.getAttribute("data-theme") === "dark" || root.dataset?.theme === "dark") return "dark";
  if (root.classList.contains("light")) return "light";

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
};

const useThemeSync = () => {
  const [theme, setTheme] = useState(() => getRootTheme());

  useEffect(() => {
    if (typeof document === "undefined") return;

    const sync = () => {
      const next = getRootTheme();
      setTheme((prev) => (prev === next ? prev : next));
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const media =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const onMedia = () => sync();
    media?.addEventListener("change", onMedia);

    const onStorage = (event: StorageEvent) => {
      if (event.key === "hero-theme" || event.key === "bento-theme") sync();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
    }

    return () => {
      observer.disconnect();
      media?.removeEventListener("change", onMedia);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", onStorage);
      }
    };
  }, []);

  return [theme, setTheme] as const;
};

const DeckGlyph = ({ theme = "dark" }: { theme?: string }) => {
  const stroke = theme === "dark" ? "#f5f5f5" : "#111111";
  const fill = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(17,17,17,0.08)";

  return (
    <svg viewBox="0 0 120 120" className="h-16 w-16" aria-hidden>
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        className="motion-safe:animate-[hero3-orbit_8.5s_linear_infinite] motion-reduce:animate-none"
        style={{ strokeDasharray: "18 14" }}
      />
      <rect
        x="34"
        y="34"
        width="52"
        height="52"
        rx="14"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.2"
        className="motion-safe:animate-[hero3-grid_5.4s_ease-in-out_infinite] motion-reduce:animate-none"
      />
      <circle cx="60" cy="60" r="7" fill={stroke} />
      <path
        d="M60 30v10M60 80v10M30 60h10M80 60h10"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        className="motion-safe:animate-[hero3-pulse_6s_ease-in-out_infinite] motion-reduce:animate-none"
      />
    </svg>
  );
};

function HeroOrbitDeck() {
  const [theme, setTheme] = useThemeSync();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("strategy");
  const [videoReady, setVideoReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes hero3-intro {
        0% { opacity: 0; transform: translate3d(0, 64px, 0) scale(0.98); filter: blur(12px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      @keyframes hero3-card {
        0% { opacity: 0; transform: translate3d(0, 32px, 0) scale(0.95); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }
      @keyframes hero3-orbit {
        0% { stroke-dashoffset: 0; transform: rotate(0deg); }
        100% { stroke-dashoffset: -64; transform: rotate(360deg); }
      }
      @keyframes hero3-grid {
        0%, 100% { transform: rotate(-2deg); opacity: 0.7; }
        50% { transform: rotate(2deg); opacity: 1; }
      }
      @keyframes hero3-pulse {
        0%, 100% { stroke-dasharray: 0 200; opacity: 0.2; }
        45%, 60% { stroke-dasharray: 200 0; opacity: 1; }
      }
      @keyframes hero3-glow {
        0%, 100% { opacity: 0.45; transform: translate3d(0,0,0); }
        50% { opacity: 0.9; transform: translate3d(0,-8px,0); }
      }
      @keyframes hero3-drift {
        0%, 100% { transform: translate3d(0,0,0) rotate(-3deg); }
        50% { transform: translate3d(0,-12px,0) rotate(3deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    // Immediately show content on mobile or if no ref
    if (!sectionRef.current || typeof window === "undefined") {
      setVisible(true);
      return;
    }

    const node = sectionRef.current;

    // Fallback timeout to ensure content shows (especially on mobile)
    const fallbackTimeout = setTimeout(() => {
      setVisible(true);
    }, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            clearTimeout(fallbackTimeout);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px" } // Lower threshold and add margin for better mobile detection
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const current = getRootTheme();
    const next = current === "dark" ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.classList.toggle("light", next === "light");
    root.setAttribute("data-theme", next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage?.setItem("hero-theme", next);
      } catch (_err) {
        /* ignore */
      }
    }
    setTheme(next);
  };

  const palette = useMemo(
    () =>
      theme === "dark"
        ? {
            surface: "bg-black text-white",
            subtle: "text-white/60",
            border: "border-white/12",
            card: "bg-white/6",
            accent: "bg-white/12",
            glow: "rgba(255,255,255,0.14)",
            background: {
              color: "#040404",
              layers: [
                "radial-gradient(ellipse 80% 60% at 10% -10%, rgba(255,255,255,0.15), transparent 60%)",
                "radial-gradient(ellipse 90% 70% at 90% -20%, rgba(120,120,120,0.12), transparent 70%)",
              ],
              dots:
                "radial-gradient(circle at 25% 25%, rgba(250,250,250,0.08) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(250,250,250,0.08) 0.7px, transparent 1px)",
            },
          }
        : {
            surface: "bg-white text-neutral-950",
            subtle: "text-neutral-600",
            border: "border-neutral-200/80",
            card: "bg-neutral-100/80",
            accent: "bg-neutral-100",
            glow: "rgba(17,17,17,0.08)",
            background: {
              color: "#f5f5f4",
              layers: [
                "radial-gradient(ellipse 80% 60% at 10% -10%, rgba(15,15,15,0.12), transparent 60%)",
                "radial-gradient(ellipse 90% 70% at 90% -20%, rgba(15,15,15,0.08), transparent 70%)",
              ],
              dots:
                "radial-gradient(circle at 25% 25%, rgba(17,17,17,0.12) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(17,17,17,0.08) 0.7px, transparent 1px)",
            },
          },
    [theme]
  );

  const metrics = [
    { label: "Average ramp", value: "14d" },
    { label: "Cycles synced", value: "30+" },
    { label: "Satisfaction", value: "97%" },
  ];

  const modes = useMemo(
    () => ({
      strategy: {
        title: "Build Protocol",
        description:
          "Frame every build with clarity. Define one goal, one workflow, and measurable ROI. We use the MCP SDK to connect your tools and deploy a working ChatGPT App in days.",
        items: [
          "Scoped → Designed → Deployed in 3 stages",
          "Secure MCP layer = predictable results",
          "Metrics: time saved, hours automated, ROI tracked",
        ],
      },
      execution: {
        title: "Execution loop",
        description:
          "Deploy orchestration cues, sync distributed crews, and keep response telemetry visible without disrupting minimal aesthetics.",
        items: [
          "Runtime monitors threaded into hero",
          "Edge deployment slots enumerated",
          "Escalation ladder surfaced in-line",
        ],
      },
    }),
    []
  );

  const activeMode = modes[mode as keyof typeof modes];

  const protocols = [
    {
      name: "Signal intake",
      detail: "Audit your workflow, ingest context in 24 h.",
      status: "Ready",
    },
    {
      name: "Agent Sync",
      detail: "Define tools, map prompts, connect integrations.",
      status: "Armed",
    },
    {
      name: "Telemetry Window",
      detail: "Monitor tokens, latency, and results in real time.",
      status: "Live",
    },
  ];

  const setSpotlight = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--hero3-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--hero3-y", `${event.clientY - rect.top}px`);
  };

  const clearSpotlight = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty("--hero3-x");
    target.style.removeProperty("--hero3-y");
  };

  const showcaseImage = {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=1400&fit=crop&q=80",
    alt: "Monochrome interface collage with layered futurist typography",
  };

  return (
    <div className={`relative isolate min-h-screen w-full transition-colors duration-700 ${palette.surface}`}>
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          backgroundColor: palette.background.color,
          backgroundImage: palette.background.layers.join(", "),
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-80"
        style={{
          backgroundImage: palette.background.dots,
          backgroundSize: "12px 12px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(60% 50% at 50% 10%, rgba(255,255,255,0.18), transparent 70%)"
              : "radial-gradient(60% 50% at 50% 10%, rgba(17,17,17,0.12), transparent 70%)",
          filter: "blur(22px)",
        }}
      />

      <section
        ref={sectionRef}
        className={`relative flex min-h-screen w-full flex-col gap-16 px-6 py-24 transition-opacity duration-700 md:gap-20 md:px-10 lg:px-16 xl:px-24 ${
          visible ? "motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]" : "opacity-0"
        }`}
      >
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-end">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] ${palette.border} ${palette.accent}`}>
                MCP LAUNCH DECK - LIGHT MODE
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] transition duration-500 ${palette.border}`}
              >
                {theme === "dark" ? "Light" : "Dark"} mode
              </button>
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                AI Command deck for businesses that demand precision automation.
              </h1>
              <p className={`max-w-2xl text-base md:text-lg ${palette.subtle}`}>
                A build framework for ChatGPT Apps and MCP integrations that turn workflows into AI-powered systems. We connect your stack, automate key actions, and ship real apps--- not demos.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className={`inline-flex flex-wrap gap-3 rounded-full border px-5 py-3 text-xs uppercase tracking-[0.3em] transition ${palette.border} ${palette.accent}`}>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Launch ready
                </span>
                <span className="opacity-60">∙</span>
                <span>MCP Enforced</span>
              </div>
              <div className={`flex divide-x divide-white/10 overflow-hidden rounded-full border text-xs uppercase tracking-[0.35em] ${palette.border}`}>
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col px-5 py-3">
                    <span className={`text-[11px] ${palette.subtle}`}>{metric.label}</span>
                    <span className="text-lg font-semibold tracking-tight">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`relative flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em]">Mode</p>
                <h2 className="text-xl font-semibold tracking-tight">{activeMode.title}</h2>
              </div>
              <DeckGlyph theme={theme} />
            </div>
            <p className={`text-sm leading-relaxed ${palette.subtle}`}>{activeMode.description}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("strategy")}
                className={`flex-1 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                  mode === "strategy" ? "bg-white text-black dark:bg-white/90 dark:text-black" : `${palette.border} ${palette.accent}`
                }`}
              >
                Strategy
              </button>
              <button
                type="button"
                onClick={() => setMode("execution")}
                className={`flex-1 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                  mode === "execution" ? "bg-white text-black dark:bg-white/90 dark:text-black" : `${palette.border} ${palette.accent}`
                }`}
              >
                Execution
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {activeMode.items.map((item) => (
                <li key={item} className={`flex items-start gap-3 ${palette.subtle}`}>
                  <span className="mt-1 h-2 w-2 rounded-full bg-current" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] xl:items-stretch">
          <div className={`order-2 flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card} xl:order-1`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.35em]">Control stack</h3>
              <span className="text-xs uppercase tracking-[0.35em] opacity-60">v3.0</span>
            </div>
            <p className={`text-sm leading-relaxed ${palette.subtle}`}>
              Built for clarity, control, and compliance. Every project runs through our standardized MCP stack --- telemetry, versioning, secure auth, and adaptive UI.
            </p>
            <div className="grid gap-3">
              {["Interface Parity Guaranteed", "Encrypted Secrets + Role Boundaries", "Motion tuned for calm focus"].map((item) => (
                <div key={item} className="relative overflow-hidden rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.3em] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
                  <span>{item}</span>
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 hover:opacity-100" style={{ background: `radial-gradient(180px circle at 50% 20%, ${palette.glow}, transparent 70%)` }} />
                </div>
              ))}
            </div>
          </div>

          <figure className="order-1 overflow-hidden rounded-[32px] border transition xl:order-2" style={{ position: "relative" }}>
            <div className="relative w-full pb-[120%] sm:pb-[90%] lg:pb-[72%]">
              {/* Loom Video Embed */}
              <div className="absolute inset-0 h-full w-full grayscale hover:grayscale-0 transition duration-700">
                <iframe
                  src="https://www.loom.com/embed/c5704feffc6d48498d1f121e5831b530?sid=3d195fc2-a590-4842-a6e1-49c166d2f69f&hideEmbedTopBar=true"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  style={{ pointerEvents: videoReady ? 'auto' : 'none' }}
                />
              </div>

              {/* Click-to-Play Overlay */}
              {!videoReady && (
                <button
                  onClick={() => setVideoReady(true)}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px] transition-opacity duration-500 hover:bg-black/30 group cursor-pointer"
                  aria-label="Click to enable video playback"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-white/90 p-6 transition-transform duration-300 group-hover:scale-110 dark:bg-white/80">
                      <svg
                        className="h-12 w-12 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white drop-shadow-lg">
                      Click to Play
                    </span>
                  </div>
                </button>
              )}

              {/* Visual Overlays - Only show when video not ready */}
              {!videoReady && (
                <>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 mix-blend-soft-light dark:from-white/10" />
                  <div className="pointer-events-none absolute inset-0 border border-white/10 mix-blend-overlay dark:border-white/20" />
                </>
              )}

              {/* Animated Orbital Elements - Always visible */}
              <span className="pointer-events-none absolute -left-16 top-16 h-40 w-40 rounded-full border border-white/15 opacity-70 motion-safe:animate-[hero3-glow_9s_ease-in-out_infinite]" />
              <span className="pointer-events-none absolute -right-12 bottom-16 h-48 w-48 rounded-full border border-white/10 opacity-40 motion-safe:animate-[hero3-drift_12s_ease-in-out_infinite]" />
            </div>
            <figcaption className={`flex items-center justify-between px-6 py-5 text-xs uppercase tracking-[0.35em] ${palette.subtle}`}>
              <span>Demo Archive</span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-8 bg-current" />
                ChatGPT Apps in Motion
              </span>
            </figcaption>
          </figure>

          <aside className={`order-3 flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card} xl:order-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.35em]">Launch protocols</h3>
              <span className="text-xs uppercase tracking-[0.35em] opacity-60">Indexed</span>
            </div>
            <ul className="space-y-4">
              {protocols.map((protocol, index) => (
                <li
                  key={protocol.name}
                  onMouseMove={setSpotlight}
                  onMouseLeave={clearSpotlight}
                  className="group relative overflow-hidden rounded-2xl border px-5 py-4 transition duration-500 hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        theme === "dark"
                          ? "radial-gradient(190px circle at var(--hero3-x, 50%) var(--hero3-y, 50%), rgba(255,255,255,0.18), transparent 72%)"
                          : "radial-gradient(190px circle at var(--hero3-x, 50%) var(--hero3-y, 50%), rgba(17,17,17,0.12), transparent 72%)",
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.25em]">{protocol.name}</h4>
                    <span className="text-[10px] uppercase tracking-[0.35em] opacity-70">{protocol.status}</span>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${palette.subtle}`}>{protocol.detail}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Phase 6: Pricing Deck */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Choose Your Launch Deck
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* MCP Lite */}
            <div className={`flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card}`}>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">MCP Lite</h3>
                <p className="text-2xl font-semibold">from $5,000</p>
              </div>
              <ul className={`space-y-3 text-sm ${palette.subtle}`}>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>1 integration, simple flows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>1-week delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>Loom handoff</span>
                </li>
              </ul>
            </div>

            {/* MCP Plus */}
            <div className={`flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card}`}>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">MCP Plus</h3>
                <p className="text-2xl font-semibold">$10,000 – $18,000</p>
              </div>
              <ul className={`space-y-3 text-sm ${palette.subtle}`}>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>2–3 integrations, branching logic</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>training Looms</span>
                </li>
              </ul>
            </div>

            {/* MCP Pro */}
            <div className={`flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card}`}>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">MCP Pro</h3>
                <p className="text-2xl font-semibold">$25,000+</p>
              </div>
              <ul className={`space-y-3 text-sm ${palette.subtle}`}>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>4+ integrations, HIPAA/SOC 2</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>multi-agent systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-current flex-shrink-0" />
                  <span>enterprise deploys</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Phase 7: Demo Showcase Grid */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Demo Launches
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className={`flex flex-col gap-4 rounded-3xl border p-8 transition hover:-translate-y-1 ${palette.border} ${palette.card}`}>
              <h3 className="text-lg font-semibold tracking-tight">GHL Controller</h3>
              <p className={`text-sm ${palette.subtle}`}>AI Workflow Automation</p>
            </div>

            <div className={`flex flex-col gap-4 rounded-3xl border p-8 transition hover:-translate-y-1 ${palette.border} ${palette.card}`}>
              <h3 className="text-lg font-semibold tracking-tight">SAP Data Agent</h3>
              <p className={`text-sm ${palette.subtle}`}>Enterprise Ops</p>
            </div>

            <div className={`flex flex-col gap-4 rounded-3xl border p-8 transition hover:-translate-y-1 ${palette.border} ${palette.card}`}>
              <h3 className="text-lg font-semibold tracking-tight">AI Video Clipper</h3>
              <p className={`text-sm ${palette.subtle}`}>Consumer Media</p>
            </div>
          </div>
        </div>

        {/* Phase 8: Footer CTA Strip */}
        <div className="mt-32 mb-16">
          <div className={`flex flex-col items-center gap-8 rounded-3xl border p-16 text-center transition ${palette.border} ${palette.card}`}>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl max-w-2xl">
              Ready to deploy your AI Command Deck?
            </h2>
            <button
              type="button"
              className="rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-black transition duration-500 hover:scale-105 dark:bg-white/90"
            >
              Book Your Build Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroOrbitDeck;
export { HeroOrbitDeck };
