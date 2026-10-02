"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

type ArchitectureTab = "dev" | "infra";

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
   Nodes + lines share ONE 600 x 540
   coordinate space, scaled to fit.
========================================= */

const STAGE_W = 600;
const STAGE_H = 540;
const NODE_W = 175;
const NODE_H = 60;

/** Dot speed in stage px / second (same for every line) */
const DOT_SPEED = 70;
/** Approx. seconds between consecutive dots on the same line */
const DOT_SPACING_SECONDS = 1.8;

type Side = "top" | "bottom" | "left" | "right";

type DiagramNode = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
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
  { id: "mysql", title: "MySQL/MongoDB", subtitle: "Database", x: 90, y: 45 },
  { id: "redis", title: "Redis", subtitle: "Cache", x: 90, y: 205 },
  { id: "google", title: "Google IDP", subtitle: "Identity Provider", x: 90, y: 375, highlighted: true },

  // Center column
  { id: "prisma", title: "Prisma ORM", subtitle: "Data Layer", x: 300, y: 130, highlighted: true },
  { id: "api", title: "REST APIs", subtitle: "Node.js / Express", x: 300, y: 290, highlighted: true },
  { id: "react", title: "React / Next.js", subtitle: "Frontend", x: 300, y: 460, highlighted: true },

  // Right column
  { id: "hfproxy", title: "HF Proxy", subtitle: "Model Gateway", x: 510, y: 45 },
  { id: "jwt", title: "JWT", subtitle: "Authentication", x: 510, y: 205 },
  { id: "webhooks", title: "Webhooks", subtitle: "3rd Party", x: 510, y: 290 },
  { id: "payment", title: "Payment Gateway", subtitle: "External Service", x: 510, y: 375 },
];

const DEV_EDGES: DiagramEdge[] = [
  { from: "mysql", to: "prisma", fromSide: "right", toSide: "left", toOff: -10 },
  { from: "redis", to: "prisma", fromSide: "right", toSide: "left", toOff: 10 },
  { from: "hfproxy", to: "prisma", fromSide: "left", toSide: "right" },
  { from: "prisma", to: "api", fromSide: "bottom", toSide: "top" },
  { from: "jwt", to: "api", fromSide: "left", toSide: "top", toOff: 45 },
  { from: "webhooks", to: "api", fromSide: "left", toSide: "right" },
  { from: "payment", to: "api", fromSide: "left", toSide: "bottom", toOff: 45 },
  { from: "google", to: "api", fromSide: "right", toSide: "left", toOff: 12 },
  { from: "api", to: "redis", fromSide: "left", toSide: "bottom", fromOff: -12 },
  { from: "api", to: "react", fromSide: "bottom", toSide: "top" },
];

/* =========================================
   INFRA DIAGRAM DATA
========================================= */

const INFRA_NODES: DiagramNode[] = [
  { id: "source", title: "Development", subtitle: "Source Code", x: 300, y: 40, highlighted: true },

  // Server deployment (left)
  { id: "clone", title: "Git Clone", subtitle: "Server Checkout", x: 95, y: 145 },
  { id: "ubuntu", title: "Ubuntu Server", subtitle: "VM / Linux", x: 95, y: 230, highlighted: true },
  { id: "pm2", title: "PM2", subtitle: "Process Manager", x: 95, y: 315, highlighted: true },
  { id: "nginx", title: "Nginx / SSL", subtitle: "Reverse Proxy", x: 95, y: 400 },

  // Kubernetes deployment (right)
  { id: "yaml", title: "K8s YAML", subtitle: "Deployment Manifests", x: 505, y: 145 },
  { id: "master", title: "Kube Master", subtitle: "Control Plane", x: 505, y: 230, highlighted: true },
  { id: "service", title: "K8s Service", subtitle: "Cluster Service", x: 505, y: 315, highlighted: true },
  { id: "ingress", title: "NodePort / Ingress", subtitle: "External Entry Point", x: 505, y: 400 },

  // Shared
  { id: "app", title: "Application", subtitle: "Frontend UI", x: 300, y: 485, highlighted: true },
];

const INFRA_EDGES: DiagramEdge[] = [
  // Source branches
  { from: "source", to: "clone", fromSide: "bottom", toSide: "right", fromOff: -40 },
  { from: "source", to: "yaml", fromSide: "bottom", toSide: "left", fromOff: 40 },

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
   GEOMETRY HELPERS
========================================= */

function anchorPoint(
  n: DiagramNode,
  side: Side,
  off = 0
): [number, number] {
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

/** Builds a cubic bezier path and measures its real length. */
function buildPath(
  a: DiagramNode,
  b: DiagramNode,
  edge: DiagramEdge
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

  // approximate bezier length by sampling
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
  const stageOuterRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<ArchitectureTab>("dev");

  /* ---------- HERO ENTRY ANIMATION ---------- */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(architectureRef.current, {
        opacity: 0,
        x: -30,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ---------- TAB TRANSITION (diagram only) ---------- */

  useEffect(() => {
    if (!stageOuterRef.current) return;

    gsap.fromTo(
      stageOuterRef.current,
      { opacity: 0.65, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="pt-[90px] pb-[10px] px-6 min-h-screen flex items-center"
    >
      {/* Marquee keyframes + hover pause (self-contained, no global CSS needed) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes tech-marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .tech-marquee-track {
              animation: tech-marquee ${MARQUEE_DURATION}s linear infinite;
              will-change: transform;
            }
            .tech-marquee:hover .tech-marquee-track {
              animation-play-state: paused;
            }
          `,
        }}
      />

      <div className="max-w-6xl mx-auto w-full">
        {/* ================= MAIN HERO ================= */}

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* ---------- LEFT: ARCHITECTURE MAP ---------- */}

          <div ref={architectureRef} className="relative w-full">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[20%] left-[25%] w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute bottom-[15%] right-[15%] w-52 h-52 bg-accent/5 rounded-full blur-3xl" />
            </div>

            {/* DEV / INFRA TABS */}
            <div className="relative z-40 mb-4 flex">
              <div className="flex items-center p-1 rounded-lg border border-border/60 bg-card/80 backdrop-blur-md">
                {(["dev", "infra"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.toUpperCase()}
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
                  <ColumnLabel text="SERVER DEPLOYMENT" x={95} y={100} />
                  <ColumnLabel text="KUBERNETES DEPLOYMENT" x={505} y={100} />
                </Diagram>
              )}
            </ScaledStage>
          </div>

          {/* ---------- RIGHT: IMAGE ---------- */}

          <div ref={imageRef} className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/brand-icon.png"
                alt="Vimal - Full-Stack Developer"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 400px"
              />
            </div>
          </div>
        </div>

        {/* ================= TECH STACK ================= */}

        <div className="mt-10 w-full">
          <div className="text-center mb-5">
            <span className="text-sm text-muted-foreground font-medium">
              Tech Stack
            </span>
          </div>

          {/* MARQUEE: single line, clipped inside its own container,
              always moving, pauses only on hover */}
          <div
            className="tech-marquee relative w-full overflow-hidden rounded-xl border border-border/60 bg-card/40 py-3"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
          >
            <div className="tech-marquee-track flex w-max flex-nowrap">
              {/* two identical groups -> seamless endless loop */}
              {[0, 1].map((group) => (
                <div
                  key={group}
                  className="flex flex-nowrap shrink-0"
                  aria-hidden={group === 1}
                >
                  {TECH_STACK.map((tech) => (
                    <div
                      key={`${group}-${tech}`}
                      className="mr-3 shrink-0 whitespace-nowrap px-4 py-1.5 bg-card border border-border rounded-md text-xs text-muted-foreground"
                    >
                      {tech}
                    </div>
                  ))}
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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      setScale(Math.min(1, el.clientWidth / STAGE_W));
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
/* ================================================= */

type FlowDot = {
  key: string;
  pathId: string;
  dur: number;
  begin: number;
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
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  /* ---- 1. build paths + measure real lengths ---- */

  const paths = edges
    .map((edge, i) => {
      const a = nodeMap.get(edge.from);
      const b = nodeMap.get(edge.to);
      if (!a || !b) return null;

      const { d, length } = buildPath(a, b, edge);

      return {
        id: `${prefix}-edge-${i}`,
        d,
        travel: length / DOT_SPEED, // seconds to travel the full line
      };
    })
    .filter(Boolean) as { id: string; d: string; travel: number }[];

  /* ---- 2. every line gets its OWN independent, endless loop ---- */

  const dots: FlowDot[] = [];

  paths.forEach((p, pi) => {
    const count = Math.max(1, Math.round(p.travel / DOT_SPACING_SECONDS));
    const gap = p.travel / count;
    const lineOffset = (pi * 0.37) % gap;

    for (let j = 0; j < count; j++) {
      dots.push({
        key: `${p.id}-dot-${j}`,
        pathId: p.id,
        dur: p.travel,
        begin: -(j * gap + lineOffset),
      });
    }
  });

  return (
    <div className="absolute inset-0">
      {/* LINES + FLOWING DOTS */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="4 7"
          className="text-muted-foreground/30"
        >
          {paths.map((p) => (
            <path key={p.id} id={p.id} d={p.d} />
          ))}
        </g>

        <g>
          {dots.map((dot) => (
            <circle key={dot.key} r="3" className="fill-accent" opacity="0">
              <animateMotion
                dur={`${dot.dur}s`}
                begin={`${dot.begin}s`}
                repeatCount="indefinite"
                calcMode="linear"
              >
                <mpath href={`#${dot.pathId}`} />
              </animateMotion>

              <animate
                attributeName="opacity"
                dur={`${dot.dur}s`}
                begin={`${dot.begin}s`}
                repeatCount="indefinite"
                values="0;1;1;0"
                keyTimes="0;0.08;0.92;1"
              />
            </circle>
          ))}
        </g>
      </svg>

      {/* NODES */}
      {nodes.map((n) => (
        <ArchitectureNode key={n.id} node={n} />
      ))}

      {children}

      {/* BOTTOM LABEL */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground/60 font-mono tracking-widest whitespace-nowrap"
        style={{ top: STAGE_H - 22 }}
      >
        {label}
      </div>
    </div>
  );
}

/* ================================================= */
/* ARCHITECTURE NODE                                 */
/* ================================================= */

function ArchitectureNode({ node }: { node: DiagramNode }) {
  const { title, subtitle, x, y, highlighted } = node;

  return (
    <div
      className={`
        absolute z-10
        flex flex-col justify-center
        px-3
        rounded-lg border backdrop-blur-md
        transition-colors duration-300
        hover:border-accent
        ${
          highlighted
            ? "border-accent/50 bg-accent/5 shadow-[0_0_25px_rgba(0,0,0,0.08)]"
            : "border-border/60 bg-card/70"
        }
      `}
      style={{
        width: NODE_W,
        height: NODE_H,
        left: x - NODE_W / 2,
        top: y - NODE_H / 2,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className={`block w-1.5 h-1.5 rounded-full shrink-0 ${
            highlighted
              ? "bg-accent shadow-[0_0_8px_currentColor]"
              : "bg-muted-foreground/50"
          }`}
        />
        <span className="text-[15px] font-medium text-foreground whitespace-nowrap">
          {title}
        </span>
      </div>

      <div className="mt-1 ml-3.5 text-[11px] text-muted-foreground whitespace-nowrap">
        {subtitle}
      </div>
    </div>
  );
}

/* ================================================= */
/* COLUMN LABEL (infra)                              */
/* ================================================= */

function ColumnLabel({
  text,
  x,
  y,
}: {
  text: string;
  x: number;
  y: number;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 text-[10px] font-mono tracking-[0.18em] text-muted-foreground/60 whitespace-nowrap"
      style={{ left: x, top: y }}
    >
      {text}
    </div>
  );
}