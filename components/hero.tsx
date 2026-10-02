"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);

  /* ========================================= */
  /* HERO ANIMATION                            */
  /* ========================================= */

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

  return (
    <section
      id="home"
      ref={containerRef}
      className="pt-[90px] pb-[10px] px-6 min-h-screen flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">

        {/* ========================================= */}
        {/* MAIN HERO                                 */}
        {/* ========================================= */}

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* ========================================= */}
          {/* LEFT - ARCHITECTURE MAP                  */}
          {/* ========================================= */}

          <div
            ref={architectureRef}
            className="relative w-full h-[500px] md:h-[540px] overflow-hidden"
          >

            {/* ========================================= */}
            {/* BACKGROUND GLOW                          */}
            {/* ========================================= */}

            <div className="absolute inset-0 pointer-events-none">

              <div className="absolute top-[20%] left-[25%] w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

              <div className="absolute bottom-[15%] right-[15%] w-52 h-52 bg-accent/5 rounded-full blur-3xl" />

            </div>


            {/* ========================================= */}
            {/* SVG CONNECTIONS                           */}
            {/* ========================================= */}

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 600 540"
              preserveAspectRatio="xMidYMid meet"
            >

              <defs>

                {/* =============================== */}
                {/* DATABASE → PRISMA                */}
                {/* =============================== */}

                <path
                  id="mysql-prisma"
                  d="M 95 70 C 160 70, 190 130, 270 150"
                  fill="none"
                />

                <path
                  id="redis-prisma"
                  d="M 95 245 C 170 245, 190 175, 270 150"
                  fill="none"
                />


                {/* =============================== */}
                {/* PRISMA → API                     */}
                {/* =============================== */}

                <path
                  id="prisma-api"
                  d="M 300 175 L 300 265"
                  fill="none"
                />


                {/* =============================== */}
                {/* GOOGLE IDP → REST API            */}
                {/* =============================== */}

                <path
                  id="google-api"
                  d="M 100 425 C 150 400, 220 350, 285 300"
                  fill="none"
                />


                {/* =============================== */}
                {/* JWT → API                        */}
                {/* =============================== */}

                <path
                  id="jwt-api"
                  d="M 440 245 C 400 245, 380 285, 335 285"
                  fill="none"
                />


                {/* =============================== */}
                {/* API → REACT                      */}
                {/* =============================== */}

                <path
                  id="api-react"
                  d="M 300 315 L 300 410"
                  fill="none"
                />


                {/* =============================== */}
                {/* WEBHOOKS → API                   */}
                {/* =============================== */}

                <path
                  id="webhooks-api"
                  d="M 480 95 C 470 150, 410 220, 340 275"
                  fill="none"
                />


                {/* =============================== */}
                {/* PAYMENT → API                    */}
                {/* =============================== */}

                <path
                  id="payment-api"
                  d="M 500 390 C 455 390, 410 330, 340 300"
                  fill="none"
                />


                {/* =============================== */}
                {/* API → REDIS                      */}
                {/* =============================== */}

                <path
                  id="api-redis"
                  d="M 270 300 C 210 325, 150 300, 95 265"
                  fill="none"
                />

              </defs>


              {/* ================================= */}
              {/* DOTTED CONNECTION LINES            */}
              {/* ================================= */}

              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeDasharray="4 7"
                className="text-muted-foreground/30"
              >

                <use href="#mysql-prisma" />

                <use href="#redis-prisma" />

                <use href="#prisma-api" />

                {/* Google IDP → REST API */}
                <use href="#google-api" />

                <use href="#jwt-api" />

                <use href="#api-react" />

                <use href="#webhooks-api" />

                <use href="#payment-api" />

                <use href="#api-redis" />

              </g>


              {/* ================================= */}
              {/* ANIMATED DATA DOTS                */}
              {/* ================================= */}

              <g>

                {/* MySQL → Prisma */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="2.8s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#mysql-prisma" />
                  </animateMotion>
                </circle>


                {/* Redis → Prisma */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="3.2s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#redis-prisma" />
                  </animateMotion>
                </circle>


                {/* Prisma → API */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="2s"
                    begin="0.4s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#prisma-api" />
                  </animateMotion>
                </circle>


                {/* ================================= */}
                {/* GOOGLE IDP → REST API              */}
                {/* ================================= */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="3s"
                    begin="0.6s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#google-api" />
                  </animateMotion>
                </circle>


                {/* JWT → API */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="2.5s"
                    begin="1s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#jwt-api" />
                  </animateMotion>
                </circle>


                {/* API → React */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="2.3s"
                    begin="0.3s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#api-react" />
                  </animateMotion>
                </circle>


                {/* Webhooks → API */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="3.5s"
                    begin="1.2s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#webhooks-api" />
                  </animateMotion>
                </circle>


                {/* Payment Gateway → API */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="3s"
                    begin="0.8s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#payment-api" />
                  </animateMotion>
                </circle>


                {/* API → Redis */}

                <circle r="3" className="fill-accent">
                  <animateMotion
                    dur="3.4s"
                    begin="1.4s"
                    repeatCount="indefinite"
                  >
                    <mpath href="#api-redis" />
                  </animateMotion>
                </circle>

              </g>

            </svg>


            {/* ========================================= */}
            {/* ARCHITECTURE NODES                        */}
            {/* ========================================= */}

            {/* MySQL */}

            <ArchitectureNode
              title="MySQL/MongoDB"
              subtitle="Database"
              className="left-[4%] top-[7%]"
            />


            {/* Redis */}

            <ArchitectureNode
              title="Redis"
              subtitle="Cache"
              className="left-[4%] top-[39%]"
            />


            {/* Prisma */}

            <ArchitectureNode
              title="Prisma ORM"
              subtitle="Data Layer"
              className="left-[40%] top-[22%]"
              highlighted
            />


            {/* ========================================= */}
            {/* GOOGLE IDP - MOVED TO BOTTOM LEFT        */}
            {/* ========================================= */}

            <ArchitectureNode
              title="Google IDP"
              subtitle="Identity Provider"
              className="left-[4%] top-[69%]"
              highlighted
            />


            {/* JWT */}

            <ArchitectureNode
              title="JWT"
              subtitle="Authentication"
              className="left-[68%] top-[39%]"
            />


            {/* Webhooks */}

            <ArchitectureNode
              title="Webhooks"
              subtitle="3rd Party"
              className="left-[73%] top-[7%]"
            />


            {/* REST APIs */}

            <ArchitectureNode
              title="REST APIs"
              subtitle="Node.js / Express"
              className="left-[39%] top-[50%]"
              highlighted
            />


            {/* Payment Gateway */}

            <ArchitectureNode
              title="Payment Gateway"
              subtitle="External Service"
              className="left-[68%] top-[69%]"
            />


            {/* React */}

            <ArchitectureNode
              title="React / Next.js"
              subtitle="Frontend"
              className="left-[39%] top-[78%]"
              highlighted
            />


            {/* ========================================= */}
            {/* LABEL                                    */}
            {/* ========================================= */}

            <div className="absolute left-1/2 -translate-x-1/2 bottom-0">

              <div className="text-[10px] md:text-xs text-muted-foreground/60 font-mono tracking-widest whitespace-nowrap">
                MY DEV APPLICATION ARCHITECTURE
              </div>

            </div>

          </div>


          {/* ========================================= */}
          {/* RIGHT - IMAGE                             */}
          {/* ========================================= */}

          <div
            ref={imageRef}
            className="flex justify-center md:justify-end"
          >

            <div className="relative w-full max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl">

              <Image
                src="https://aortepjbbvixlgouowra.supabase.co/storage/v1/object/public/vimal-official/brand-icon.png"
                alt="Vimal - Full-Stack Developer"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 400px"
              />

            </div>

          </div>

        </div>


        {/* ========================================= */}
        {/* TECH STACK                                */}
        {/* ========================================= */}

        <div className="mt-10 w-full">

          <div className="text-center mb-5">

            <span className="text-sm text-muted-foreground font-medium">
              Tech Stack
            </span>

          </div>


          {/* Desktop */}

          <div className="hidden md:flex flex-wrap gap-3 justify-center mb-4">

            {[
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
              "SSL",
            ].map((tech) => (

              <div
                key={tech}
                className="px-4 py-1.5 bg-card border border-border rounded-md text-xs text-muted-foreground"
              >
                {tech}
              </div>

            ))}

          </div>


          {/* Mobile */}

          <div
            className="md:hidden overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >

            <div
              className="flex gap-4 whitespace-nowrap"
              style={{
                animation: "marquee 14s linear infinite",
                animationPlayState: isHovering
                  ? "paused"
                  : "running",
              }}
            >

              {[
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
                "SSL",

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
                "SSL",
              ].map((tech, index) => (

                <div
                  key={index}
                  className="px-4 py-1.5 bg-card border border-border rounded-md text-xs text-muted-foreground flex-shrink-0"
                >
                  {tech}
                </div>

              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


/* ========================================= */
/* ARCHITECTURE NODE                         */
/* ========================================= */

function ArchitectureNode({
  title,
  subtitle,
  className,
  highlighted = false,
}: {
  title: string;
  subtitle: string;
  className?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`
        absolute
        ${className}
        z-10
        min-w-[100px]
        md:min-w-[125px]
        px-3
        py-2.5
        rounded-lg
        border
        backdrop-blur-md
        transition-all
        duration-300
        hover:scale-105

        ${
          highlighted
            ? "border-accent/50 bg-accent/5 shadow-[0_0_25px_rgba(0,0,0,0.08)]"
            : "border-border/60 bg-card/70"
        }
      `}
    >

      <div className="flex items-center gap-2">

        <span
          className={`
            block
            w-1.5
            h-1.5
            rounded-full
            shrink-0

            ${
              highlighted
                ? "bg-accent shadow-[0_0_8px_currentColor]"
                : "bg-muted-foreground/50"
            }
          `}
        />

        <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">
          {title}
        </span>

      </div>


      <div className="mt-1 ml-3.5 text-[9px] md:text-[10px] text-muted-foreground whitespace-nowrap">
        {subtitle}
      </div>

    </div>
  );
}