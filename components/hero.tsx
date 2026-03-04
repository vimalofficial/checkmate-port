"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export function Hero() {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  //     tl.from(titleRef.current, {
  //       opacity: 0,
  //       y: 60,
  //       duration: 1,
  //     })
  //       .from(
  //         subtitleRef.current,
  //         {
  //           opacity: 0,
  //           y: 40,
  //           duration: 0.8,
  //         },
  //         '-=0.6'
  //       )
  //       .from(
  //         imageRef.current,
  //         {
  //           opacity: 0,
  //           scale: 0.9,
  //           duration: 0.8,
  //         },
  //         '-=0.6'
  //       )
  //       .from(
  //         socialRef.current,
  //         {
  //           opacity: 0,
  //           y: 30,
  //           duration: 0.8,
  //         },
  //         '-=0.4'
  //       );
  //   }, containerRef);

  //   return () => ctx.revert();
  // }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out", // smoother easing
          duration: 1.2, // slightly longer
        },
      });

      tl.from(titleRef.current, {
        opacity: 0,
        y: 40, // reduced distance (less jumpy)
        force3D: true,
      })
        .from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 1,
            force3D: true,
          },
          "-=0.8",
        )
        .from(
          imageRef.current,
          {
            opacity: 0,
            scale: 0.95, // subtle scale
            duration: 1,
            force3D: true,
          },
          "-=0.9",
        )
        .from(
          socialRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.9,
            force3D: true,
          },
          "-=0.8",
        );
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
        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h3
              ref={titleRef}
              className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-snug"
            >
              I'm <span className="text-accent">Vimal PK</span>
            </h3>

            <h5>Skills</h5>

            <p
              ref={subtitleRef}
              className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              Full-Stack Developer | Typescript, Node.js, React.js | API
              Integration | Databases (MySQL, MongoDB, Supabase DB, prisma ORM)
              | Cloud & FTP Deployment | SSL/TLS with Let’s Encrypt | Version
              Control (Git, Bitbucket).
            </p>
            {/* 
            <button className="px-6 py-2.5 bg-accent !text-md  text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
              Download Resume
            </button> */}

            <button className="px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-sm md:text-base bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
              Download Resume
            </button>
          </div>

          {/* Right Image */}
          <div ref={imageRef} className="flex justify-center md:justify-end">
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

        {/* Trusted By Section */}
        {/* <div
          ref={socialRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <span className="text-muted-foreground whitespace-nowrap">
            Tech Stack
          </span>

          <div className="flex flex-wrap gap-4 justify-center">
            {['Meta', 'Google', 'LinkedIn', 'Slack'].map((company) => (
              <div
                key={company}
                className="px-5 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:scale-105 transition-transform duration-300"
              >
                {company}
              </div>
            ))}
          </div>
        </div> */}
        {/* 
        <div
          ref={socialRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <span className="text-muted-foreground whitespace-nowrap font-medium">
            Tech Stack
          </span>

          <div className="flex flex-wrap gap-4 justify-center">
            {[
              "Node.js",
              "Next.js",
              "REST APIs",
              "WebSocket",
              "AWS",
              "Amazon S3",
              "Google APIs",
              "Razorpay",
              "Git",
              "SSL & Domain Config",
              "Prisma ORM",
            ].map((tech) => (
              <div
                key={tech}
                className="px-5 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:scale-105 transition-transform duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        </div> */}

        

        <div ref={socialRef} id="tech-stack" className="mt-10 w-full">
          <div className="text-center mb-5">
            <span className="text-sm text-muted-foreground font-medium">
              Tech Stack
            </span>
          </div>

          {/* Desktop - Static Grid */}
          <div className="hidden md:flex flex-wrap gap-3 justify-center mb-4">
            {[
              "Node.js",
              "Next.js",
              "REST APIs",
              "WebSocket",
              "AWS",
              "Amazon S3",
              "Google APIs",
              "Razorpay",
              "Git",
              "SSL",
              "Prisma ORM",
            ].map((tech) => (
              <div
                key={tech}
                className="px-4 py-1.5 bg-card border border-border rounded-md text-xs text-muted-foreground"
              >
                {tech}
              </div>
            ))}
          </div>

          {/* Mobile - Marquee */}
          <div className="md:hidden overflow-hidden">
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div
                className="flex gap-4 w-max whitespace-nowrap"
                style={{
                  animation: "marquee 60s linear infinite",
                  animationPlayState: isHovering ? "paused" : "running",
                }}
              >
                {[
                  "Node.js",
                  "Next.js",
                  "REST APIs",
                  "WebSocket",
                  "AWS",
                  "Amazon S3",
                  "Google APIs",
                  "Razorpay",
                  "Git",
                  "SSL",
                  "Prisma ORM",
                ]
                  .concat([
                    "Node.js",
                    "Next.js",
                    "REST APIs",
                    "WebSocket",
                    "AWS",
                    "Amazon S3",
                    "Google APIs",
                    "Razorpay",
                    "Git",
                    "SSL",
                    "Prisma ORM",
                  ])
                  .map((tech, index) => (
                    <div
                      key={index}
                      className="px-4 py-1.5 bg-card border border-border rounded-md text-xs text-muted-foreground"
                    >
                      {tech}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
