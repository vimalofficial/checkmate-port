"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

type ArchitectureTab = "dev" | "infra";

/** useLayoutEffect on the client, useEffect on the server (no SSR warning) */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================
   PAGE READY GATE
   Starts animations only after: window load + fonts + 2 clean
   frames (max wait 1.5s). Prevents animating while the main
   thread is busy hydrating / decoding the hero image.
========================================= */

let pageReady = false;

function whenPageReady(cb: () => void): () => void {
  if (pageReady) {
    cb();
    return () => {};
  }

  let cancelled = false;

  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true }),
        );

  const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  const timeout = new Promise<void>((resolve) =>
    window.setTimeout(resolve, 1500),
  );

  Promise.race([Promise.all([loaded, fonts]), timeout]).then(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        pageReady = true;
        if (!cancelled) cb();
      }),
    );
  });

  return () => {
    cancelled = true;
  };
}

const TECH_STACK = [
  "Node.js",
  "Next.js",
  "React",
  "REST APIs",
  "JWT",
  "Google IDP",
  "MySQL",
  "Redis",
  "Prisma ORM",
  "Docker",
  "Kubernetes",
  "Webhooks",
  "Razorpay",
  "Git",
  "PM2",
  "Nginx",
  "SSL",
];

/** Seconds for one full marquee loop (higher = slower) */
const MARQUEE_DURATION = 30;

/* =========================================
   DIAGRAM CONSTANTS
   Nodes + lines share ONE 600 x 446
   coordinate space, scaled to fit.
   (Height reduced from 540 -> 446 so the
   column no longer takes too much height.)
========================================= */

const STAGE_W = 600;
const STAGE_H = 446;
const NODE_W = 175;
const NODE_H = 52;

/** Dot speed in stage px / second (same for every line) */
const DOT_SPEED = 70;
/** Approx. seconds between consecutive dots on the same line */
const DOT_SPACING_SECONDS = 1.8;

/* ---------- LINE + DOT SIZE ---------- */

const LINE_WIDTH = 2.6;
const LINE_DASH = "8 9";
const DOT_RADIUS = 5.5;
const DOT_GLOW_RADIUS = 11;

/** Samples per path in the dot lookup table */
const LUT_STEPS = 96;

type Side = "top" | "bottom" | "left" | "right";

/* =========================================
   CARD COLOUR TONES
========================================= */

type Tone = "cyan" | "violet" | "orange" | "blue" | "emerald";

const TONES: Record<Tone, [number, number, number]> = {
  cyan: [6, 182, 212],
  violet: [139, 92, 246],
  orange: [249, 115, 22],
  blue: [59, 130, 246],
  emerald: [16, 185, 129],
};

type DiagramNode = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  tone: Tone;
  highlighted?: boolean;
};

type DiagramEdge = {
  from: string;
  to: string;
  fromSide: Side;
  toSide: Side;
  fromOff?: number;
  toOff?: number;
};

/* =========================================
   DEV DIAGRAM DATA
========================================= */

const DEV_NODES: DiagramNode[] = [
  // Left column
  {
    id: "mysql",
    title: "MySQL/MongoDB",
    subtitle: "Database",
    x: 90,
    y: 40,
    tone: "violet",
  },
  {
    id: "redis",
    title: "Redis",
    subtitle: "Cache",
    x: 90,
    y: 175,
    tone: "violet",
  },
  {
    id: "google",
    title: "Google IDP",
    subtitle: "Identity Provider",
    x: 90,
    y: 310,
    tone: "cyan",
    highlighted: true,
  },

  // Center column
  {
    id: "prisma",
    title: "Prisma ORM",
    subtitle: "Data Layer",
    x: 300,
    y: 105,
    tone: "cyan",
    highlighted: true,
  },
  {
    id: "api",
    title: "REST APIs",
    subtitle: "Node.js / Express",
    x: 300,
    y: 240,
    tone: "cyan",
    highlighted: true,
  },
  {
    id: "react",
    title: "React / Next.js",
    subtitle: "Frontend",
    x: 300,
    y: 375,
    tone: "cyan",
    highlighted: true,
  },

  // Right column
  {
    id: "hfproxy",
    title: "HF Proxy",
    subtitle: "Model Gateway",
    x: 510,
    y: 40,
    tone: "violet",
  },
  {
    id: "jwt",
    title: "JWT",
    subtitle: "Authentication",
    x: 510,
    y: 170,
    tone: "violet",
  },
  {
    id: "webhooks",
    title: "Webhooks",
    subtitle: "3rd Party",
    x: 510,
    y: 240,
    tone: "violet",
  },
  {
    id: "payment",
    title: "Payment Gateway",
    subtitle: "External Service",
    x: 510,
    y: 310,
    tone: "violet",
  },
];

const DEV_EDGES: DiagramEdge[] = [
  {
    from: "mysql",
    to: "prisma",
    fromSide: "right",
    toSide: "left",
    toOff: -10,
  },
  { from: "redis", to: "prisma", fromSide: "right", toSide: "left", toOff: 10 },
  { from: "hfproxy", to: "prisma", fromSide: "left", toSide: "right" },
  { from: "prisma", to: "api", fromSide: "bottom", toSide: "top" },
  { from: "jwt", to: "api", fromSide: "left", toSide: "top", toOff: 45 },
  { from: "webhooks", to: "api", fromSide: "left", toSide: "right" },
  { from: "payment", to: "api", fromSide: "left", toSide: "bottom", toOff: 45 },
  { from: "google", to: "api", fromSide: "right", toSide: "left", toOff: 12 },
  {
    from: "api",
    to: "redis",
    fromSide: "left",
    toSide: "bottom",
    fromOff: -12,
  },
  { from: "api", to: "react", fromSide: "bottom", toSide: "top" },
];

/* =========================================
   INFRA DIAGRAM DATA
========================================= */

const INFRA_NODES: DiagramNode[] = [
  {
    id: "source",
    title: "Development",
    subtitle: "Source Code",
    x: 300,
    y: 36,
    tone: "emerald",
    highlighted: true,
  },

  // Server deployment (left)
  {
    id: "clone",
    title: "Git Clone",
    subtitle: "Server Checkout",
    x: 95,
    y: 125,
    tone: "orange",
  },
  {
    id: "ubuntu",
    title: "Ubuntu Server",
    subtitle: "VM / Linux",
    x: 95,
    y: 191,
    tone: "orange",
    highlighted: true,
  },
  {
    id: "pm2",
    title: "PM2",
    subtitle: "Process Manager",
    x: 95,
    y: 257,
    tone: "orange",
    highlighted: true,
  },
  {
    id: "nginx",
    title: "Nginx / SSL",
    subtitle: "Reverse Proxy",
    x: 95,
    y: 323,
    tone: "orange",
  },

  // Kubernetes deployment (right)
  {
    id: "yaml",
    title: "K8s YAML",
    subtitle: "Deployment Manifests",
    x: 505,
    y: 125,
    tone: "blue",
  },
  {
    id: "master",
    title: "Kube Master",
    subtitle: "Control Plane",
    x: 505,
    y: 191,
    tone: "blue",
    highlighted: true,
  },
  {
    id: "service",
    title: "K8s Service",
    subtitle: "Cluster Service",
    x: 505,
    y: 257,
    tone: "blue",
    highlighted: true,
  },
  {
    id: "ingress",
    title: "NodePort / Ingress",
    subtitle: "External Entry Point",
    x: 505,
    y: 323,
    tone: "blue",
  },

  // Shared
  {
    id: "app",
    title: "Application",
    subtitle: "Frontend UI",
    x: 300,
    y: 392,
    tone: "emerald",
    highlighted: true,
  },
];

const INFRA_EDGES: DiagramEdge[] = [
  // Source branches
  {
    from: "source",
    to: "clone",
    fromSide: "bottom",
    toSide: "right",
    fromOff: -40,
  },
  {
    from: "source",
    to: "yaml",
    fromSide: "bottom",
    toSide: "left",
    fromOff: 40,
  },

  // Server flow
  { from: "clone", to: "ubuntu", fromSide: "bottom", toSide: "top" },
  { from: "ubuntu", to: "pm2", fromSide: "bottom", toSide: "top" },
  { from: "pm2", to: "nginx", fromSide: "bottom", toSide: "top" },
  { from: "nginx", to: "app", fromSide: "bottom", toSide: "left" },

  // Kubernetes flow
  { from: "yaml", to: "master", fromSide: "bottom", toSide: "top" },
  { from: "master", to: "service", fromSide: "bottom", toSide: "top" },
  { from: "service", to: "ingress", fromSide: "bottom", toSide: "top" },
  { from: "ingress", to: "app", fromSide: "bottom", toSide: "right" },
];

/* =========================================
   TABS
========================================= */

const TABS: { id: ArchitectureTab; label: string }[] = [
  { id: "dev", label: "DEV" },
  { id: "infra", label: "DEPLOY" },
];

/* =========================================
   GEOMETRY HELPERS
========================================= */

function anchorPoint(n: DiagramNode, side: Side, off = 0): [number, number] {
  switch (side) {
    case "top":
      return [n.x + off, n.y - NODE_H / 2];
    case "bottom":
      return [n.x + off, n.y + NODE_H / 2];
    case "left":
      return [n.x - NODE_W / 2, n.y + off];
    case "right":
      return [n.x + NODE_W / 2, n.y + off];
  }
}

const NORMALS: Record<Side, [number, number]> = {
  top: [0, -1],
  bottom: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/** Builds a cubic bezier path and measures its approximate length. */
function buildPath(
  a: DiagramNode,
  b: DiagramNode,
  edge: DiagramEdge,
): { d: string; length: number } {
  const [x1, y1] = anchorPoint(a, edge.fromSide, edge.fromOff ?? 0);
  const [x2, y2] = anchorPoint(b, edge.toSide, edge.toOff ?? 0);

  const dist = Math.hypot(x2 - x1, y2 - y1);
  const k = Math.max(20, Math.min(80, dist * 0.45));

  const [n1x, n1y] = NORMALS[edge.fromSide];
  const [n2x, n2y] = NORMALS[edge.toSide];

  const c1x = x1 + n1x * k;
  const c1y = y1 + n1y * k;
  const c2x = x2 + n2x * k;
  const c2y = y2 + n2y * k;

  const steps = 40;
  let length = 0;
  let px = x1;
  let py = y1;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;

    const x =
      u * u * u * x1 +
      3 * u * u * t * c1x +
      3 * u * t * t * c2x +
      t * t * t * x2;

    const y =
      u * u * u * y1 +
      3 * u * u * t * c1y +
      3 * u * t * t * c2y +
      t * t * t * y2;

    length += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }

  return {
    d: `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`,
    length,
  };
}

/* =========================================
   HERO
========================================= */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const stageOuterRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeBoxRef = useRef<HTMLDivElement>(null);

  const isFirstTabRender = useRef(true);
  const isSwitching = useRef(false);

  const [activeTab, setActiveTab] = useState<ArchitectureTab>("dev");

  /* ---------- HERO ENTRY ANIMATION ----------
     - Everything starts hidden (opacity-0 in CSS): no flash.
     - Starts only when the page is ready (load + fonts + 2 frames),
       so it never competes with hydration / image decoding.
     - The big architecture container is NOT faded (fading a huge
       subtree is expensive); the diagram staggers its own nodes in.
     - The marquee only starts moving after the intro finishes.
  ------------------------------------------- */

  useEffect(() => {
    const ctx = gsap.context(() => {}, containerRef);

    const run = () => {
      ctx.add(() => {
        if (prefersReducedMotion()) {
          gsap.set(
            [
              architectureRef.current,
              tabsRef.current,
              imageRef.current,
              marqueeRef.current,
            ],
            { opacity: 1 },
          );
          marqueeBoxRef.current?.setAttribute("data-run", "true");
          return;
        }

        gsap.set(architectureRef.current, { opacity: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", force3D: true },
          onComplete: () =>
            marqueeBoxRef.current?.setAttribute("data-run", "true"),
        });

        tl.fromTo(
          tabsRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.6, clearProps: "transform" },
        )
          .fromTo(
            imageRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.9, clearProps: "transform" },
            0.1,
          )
          .fromTo(
            marqueeRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7, clearProps: "transform" },
            0.5,
          );
      });
    };

    const cancel = whenPageReady(run);

    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  /* ---------- TAB TRANSITION ----------
     1. fade the current diagram out
     2. swap the tab (Diagram remounts and staggers itself in)
     3. restore the wrapper before paint
  ---------------------------------------------------- */

  const handleTab = (id: ArchitectureTab) => {
    if (id === activeTab || isSwitching.current) return;

    if (prefersReducedMotion() || !stageOuterRef.current) {
      setActiveTab(id);
      return;
    }

    isSwitching.current = true;

    gsap.to(stageOuterRef.current, {
      opacity: 0,
      y: 6,
      duration: 0.22,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: () => setActiveTab(id),
    });
  };

  useIsoLayoutEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false;
      return;
    }

    if (stageOuterRef.current) {
      gsap.set(stageOuterRef.current, {
        opacity: 1,
        y: 0,
        clearProps: "transform",
      });
    }

    isSwitching.current = false;
  }, [activeTab]);

  return (
    <section
      id="home"
      ref={containerRef}
      /* pt-24 on mobile pushes the tabs BELOW the fixed navbar.
         Desktop keeps the original tight padding.
         Change pt-24 to match your navbar height if needed
         (pt-20 = 80px, pt-28 = 112px). */
      className="pt-24 md:pt-[10px] pb-[10px] pl-5 min-h-screen flex items-center"
    >
      {/* Marquee keyframes. Paused until the intro finishes (data-run),
          then runs on the compositor. Hover pauses it. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes tech-marquee {
              from { transform: translate3d(0, 0, 0); }
              to   { transform: translate3d(-50%, 0, 0); }
            }
            .tech-marquee-track {
              animation: tech-marquee ${MARQUEE_DURATION}s linear infinite;
              animation-play-state: paused;
              will-change: transform;
            }
            .tech-marquee[data-run="true"] .tech-marquee-track {
              animation-play-state: running;
            }
            .tech-marquee[data-run="true"]:hover .tech-marquee-track {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .tech-marquee-track { animation: none; }
            }
          `,
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        {/* ================= MAIN HERO ================= */}

        {/* Two separate columns, vertically centered.
            left  = 1 part    (architecture diagram)
            right = 1.15 part (image) */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center">
          {/* ---------- LEFT COLUMN: ARCHITECTURE MAP ---------- */}

          <div
            ref={architectureRef}
            className="relative w-full min-w-0 opacity-0 pr-3"
          >
            {/* Background glow */}
            <div className="absolute inset-0 p-2 pointer-events-none overflow-hidden">
              <div
                className="absolute top-[5%] left-[10%] w-72 h-72 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(6,182,212,0.10), transparent)",
                }}
              />

              <div
                className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(139,92,246,0.10), transparent)",
                }}
              />
            </div>

            {/* DEV / DEPLOY TABS */}
            <div ref={tabsRef} className="relative z-10 mb-3 flex opacity-0">
              <div className="flex items-center p-1 rounded-lg border border-border/60 bg-card">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTab(tab.id)}
                    className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-300 ${
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DIAGRAM */}
            <ScaledStage outerRef={stageOuterRef}>
              {activeTab === "dev" ? (
                <Diagram
                  key="dev"
                  prefix="dev"
                  nodes={DEV_NODES}
                  edges={DEV_EDGES}
                  label="APPLICATION ARCHITECTURE"
                />
              ) : (
                <Diagram
                  key="infra"
                  prefix="infra"
                  nodes={INFRA_NODES}
                  edges={INFRA_EDGES}
                  label="INFRASTRUCTURE / DEPLOYMENT"
                >
                  <ColumnLabel text="SERVER DEPLOYMENT" x={95} y={80} />
                  <ColumnLabel text="KUBERNETES DEPLOYMENT" x={505} y={80} />
                </Diagram>
              )}
            </ScaledStage>
          </div>

          {/* ---------- RIGHT COLUMN: IMAGE ---------- */}

          <div ref={imageRef} className="w-full min-w-0 opacity-0">
            {/* Natural proportions, full column width.
                No fixed height, no crop, no zoom: the whole image
                is always visible and can't be cut off. */}
            <Image
              src="/stretched-image (1).png"
              alt="Vimal - Full-Stack Developer"
              width={1000}
              height={1000}
              priority
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 700px"
            />
          </div>
        </div>

        {/* ================= TECH STACK ================= */}

        <div ref={marqueeRef} className=" w-full opacity-0">
          <div className="text-center mb-5">
            <span className="text-sm text-muted-foreground font-medium">
              Tech Stack
            </span>
          </div>

          <div
            ref={marqueeBoxRef}
            className="tech-marquee relative w-full overflow-hidden rounded-xl border border-border/60 bg-card/40 py-4"
          >
            {/* Left corner fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/80 to-transparent" />

            {/* Right corner fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/80 to-transparent" />

            {/* Infinite marquee track */}
            <div className="tech-marquee-track flex w-max flex-nowrap">
              {[0, 1].map((group) => (
                <div
                  key={group}
                  className="flex flex-nowrap shrink-0"
                  aria-hidden={group === 1}
                >
                  {TECH_STACK.map((tech, index) => {
                    const colors = [
                      {
                        text: "text-cyan-400",
                        border: "border-cyan-500/40",
                        bg: "bg-cyan-500/10",
                        glow: "hover:shadow-cyan-500/20",
                        dot: "bg-cyan-400",
                      },
                      {
                        text: "text-violet-400",
                        border: "border-violet-500/40",
                        bg: "bg-violet-500/10",
                        glow: "hover:shadow-violet-500/20",
                        dot: "bg-violet-400",
                      },
                      {
                        text: "text-orange-400",
                        border: "border-orange-500/40",
                        bg: "bg-orange-500/10",
                        glow: "hover:shadow-orange-500/20",
                        dot: "bg-orange-400",
                      },
                      {
                        text: "text-blue-400",
                        border: "border-blue-500/40",
                        bg: "bg-blue-500/10",
                        glow: "hover:shadow-blue-500/20",
                        dot: "bg-blue-400",
                      },
                      {
                        text: "text-emerald-400",
                        border: "border-emerald-500/40",
                        bg: "bg-emerald-500/10",
                        glow: "hover:shadow-emerald-500/20",
                        dot: "bg-emerald-400",
                      },
                    ];

                    const color = colors[index % colors.length];

                    return (
                      <div
                        key={`${group}-${tech}`}
                        className={`
                  group mr-3 shrink-0 whitespace-nowrap
                  flex items-center gap-2
                  rounded-lg border px-4 py-2
                  text-xs font-medium
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-lg
                  ${color.text}
                  ${color.border}
                  ${color.bg}
                  ${color.glow}
                `}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`}
                        />
                        {tech}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* SCALED STAGE                                      */
/* Measures BEFORE first paint (layout effect).      */
/* ================================================= */

function ScaledStage({
  children,
  outerRef,
}: {
  children: React.ReactNode;
  outerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsoLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const next = Math.min(1, el.clientWidth / STAGE_W);
      setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="w-full">
      <div
        ref={wrapRef}
        className="relative w-full"
        style={{ height: STAGE_H * scale }}
      >
        <div
          className="absolute top-0 left-1/2"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* DIAGRAM                                           */
/* - SVG holds ONLY the static dashed lines (painted */
/*   once, never repainted).                         */
/* - Flowing dots are HTML elements moved with       */
/*   transform (compositor only), driven by ONE      */
/*   gsap.ticker callback and a precomputed lookup   */
/*   table (no getPointAtLength per frame).          */
/* - Entrance + dots wait for the page to be ready.  */
/* ================================================= */

type FlowDot = {
  key: string;
  pathIndex: number;
  dur: number;
  offset: number;
};

function Diagram({
  prefix,
  nodes,
  edges,
  label,
  children,
}: {
  prefix: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  label: string;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotsWrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ---- 1. build paths + dots once ---- */

  const { paths, dots } = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const paths = edges
      .map((edge, i) => {
        const a = nodeMap.get(edge.from);
        const b = nodeMap.get(edge.to);
        if (!a || !b) return null;

        const { d, length } = buildPath(a, b, edge);

        return {
          id: `${prefix}-edge-${i}`,
          d,
          travel: length / DOT_SPEED,
        };
      })
      .filter(Boolean) as { id: string; d: string; travel: number }[];

    const dots: FlowDot[] = [];

    paths.forEach((p, pi) => {
      const count = Math.max(1, Math.round(p.travel / DOT_SPACING_SECONDS));
      const gap = p.travel / count;
      const lineOffset = (pi * 0.37) % gap;

      for (let j = 0; j < count; j++) {
        dots.push({
          key: `${p.id}-dot-${j}`,
          pathIndex: pi,
          dur: p.travel,
          offset: j * gap + lineOffset,
        });
      }
    });

    return { paths, dots };
  }, [nodes, edges, prefix]);

  /* ---- 2. entrance animation ----
     Hide immediately (before paint), play when the page is ready. */

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(".dg-node", { opacity: 0, y: 14, scale: 0.94 });
      gsap.set([".dg-lines", ".dg-dots", ".dg-label"], { opacity: 0 });
    }, rootRef);

    const cancel = whenPageReady(() => {
      ctx.add(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", force3D: true },
        });

        tl.to(".dg-node", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.045,
          clearProps: "transform",
        })
          .to(".dg-lines", { opacity: 1, duration: 0.6 }, 0.15)
          .to(".dg-label", { opacity: 1, duration: 0.5 }, 0.3)
          .to(".dg-dots", { opacity: 1, duration: 0.6 }, 0.7);
      });
    });

    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  /* ---- 3. flowing dots: lookup table + single ticker ---- */

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrap = dotsWrapRef.current;
    if (!wrap) return;

    let ticker: (() => void) | null = null;
    let delayed: gsap.core.Tween | null = null;
    let io: IntersectionObserver | null = null;

    const start = () => {
      // Sample every path ONCE: x/y pairs for LUT_STEPS + 1 points
      const luts = pathRefs.current.map((path) => {
        if (!path) return null;

        const len = path.getTotalLength();
        const arr = new Float32Array((LUT_STEPS + 1) * 2);

        for (let s = 0; s <= LUT_STEPS; s++) {
          const pt = path.getPointAtLength((len * s) / LUT_STEPS);
          arr[s * 2] = pt.x;
          arr[s * 2 + 1] = pt.y;
        }

        return arr;
      });

      const startTime = gsap.ticker.time;

      let visible = true;
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(wrap);

      ticker = () => {
        if (!visible) return;

        const t = gsap.ticker.time - startTime;

        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          const el = dotRefs.current[i];
          const lut = luts[dot.pathIndex];
          if (!el || !lut) continue;

          const p = ((t + dot.offset) / dot.dur) % 1;

          // interpolate inside the lookup table
          const f = p * LUT_STEPS;
          const i0 = Math.min(LUT_STEPS - 1, Math.floor(f));
          const k = f - i0;

          const x = lut[i0 * 2] + (lut[(i0 + 1) * 2] - lut[i0 * 2]) * k;
          const y =
            lut[i0 * 2 + 1] + (lut[(i0 + 1) * 2 + 1] - lut[i0 * 2 + 1]) * k;

          // fade in at the start, fade out at the end of each line
          const o = p < 0.08 ? p / 0.08 : p > 0.92 ? (1 - p) / 0.08 : 1;

          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
          el.style.opacity = o.toFixed(2);
        }
      };

      gsap.ticker.add(ticker);
    };

    // start moving dots when the dots layer finishes fading in
    const cancel = whenPageReady(() => {
      delayed = gsap.delayedCall(0.7, start);
    });

    return () => {
      cancel();
      delayed?.kill();
      if (ticker) gsap.ticker.remove(ticker);
      io?.disconnect();
    };
  }, [dots]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* STATIC DASHED LINES (painted once) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      >
        <g
          className="dg-lines text-muted-foreground/55"
          fill="none"
          stroke="currentColor"
          strokeWidth={LINE_WIDTH}
          strokeDasharray={LINE_DASH}
          strokeLinecap="round"
        >
          {paths.map((p, i) => (
            <path
              key={p.id}
              id={p.id}
              d={p.d}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
            />
          ))}
        </g>
      </svg>

      {/* FLOWING DOTS: own composited layers, moved via transform only */}
      <div
        ref={dotsWrapRef}
        className="dg-dots pointer-events-none absolute inset-0"
      >
        {dots.map((dot, i) => (
          <div
            key={dot.key}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 flex items-center justify-center rounded-full bg-accent/25 will-change-transform"
            style={{
              width: DOT_GLOW_RADIUS * 2,
              height: DOT_GLOW_RADIUS * 2,
              marginLeft: -DOT_GLOW_RADIUS,
              marginTop: -DOT_GLOW_RADIUS,
              opacity: 0,
            }}
          >
            <span
              className="block rounded-full bg-accent"
              style={{
                width: DOT_RADIUS * 2,
                height: DOT_RADIUS * 2,
              }}
            />
          </div>
        ))}
      </div>

      {/* NODES */}
      {nodes.map((n) => (
        <ArchitectureNode key={n.id} node={n} />
      ))}

      {children}

      {/* BOTTOM LABEL */}
      <div
        className="dg-label absolute left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground/60 font-mono tracking-widest whitespace-nowrap"
        style={{ top: STAGE_H - 22 }}
      >
        {label}
      </div>
    </div>
  );
}

/* ================================================= */
/* ARCHITECTURE NODE                                 */
/* Outer wrapper  -> animated ONLY by GSAP           */
/* Inner card     -> CSS hover (no conflict)         */
/* ================================================= */

function ArchitectureNode({ node }: { node: DiagramNode }) {
  const { title, subtitle, x, y, highlighted, tone } = node;

  const [r, g, b] = TONES[tone];
  const rgba = (a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

  const cardStyle: React.CSSProperties = {
    backgroundImage: highlighted
      ? `linear-gradient(135deg, ${rgba(0.4)}, ${rgba(0.16)})`
      : `linear-gradient(135deg, ${rgba(0.24)}, ${rgba(0.09)})`,
    borderColor: highlighted ? rgba(0.95) : rgba(0.6),
    boxShadow: highlighted
      ? `0 0 22px ${rgba(0.35)}, inset 0 0 0 1px ${rgba(0.15)}`
      : `0 0 12px ${rgba(0.15)}`,
  };

  return (
    <div
      className="dg-node absolute z-10"
      style={{
        width: NODE_W,
        height: NODE_H,
        left: x - NODE_W / 2,
        top: y - NODE_H / 2,
      }}
    >
      <div
        className="
          flex h-full w-full flex-col justify-center
          px-3 rounded-lg border-2 bg-card
          transition-transform duration-300 ease-out
          hover:scale-[1.04]
        "
        style={cardStyle}
      >
        <div className="flex items-center gap-2">
          <span
            className="block w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: rgba(1),
              boxShadow: `0 0 8px ${rgba(0.9)}`,
            }}
          />
          <span className="text-[15px] font-semibold text-foreground whitespace-nowrap">
            {title}
          </span>
        </div>

        <div className="mt-0.5 ml-4 text-[11px] text-foreground/70 whitespace-nowrap">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* COLUMN LABEL (infra)                              */
/* ================================================= */

function ColumnLabel({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <div
      className="dg-label absolute -translate-x-1/2 -translate-y-1/2 z-20 text-[10px] font-mono tracking-[0.18em] text-muted-foreground/60 whitespace-nowrap"
      style={{ left: x, top: y }}
    >
      {text}
    </div>
  );
}