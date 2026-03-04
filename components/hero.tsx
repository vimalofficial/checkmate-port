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
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
          duration: 1,
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "restart none none none",
        },
      });

      tl.from(titleRef.current, {
        opacity: 0,
        y: 40,
      })
        .from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
          },
          "-=0.6",
        )
        .from(
          buttonRef.current,
          {
            opacity: 0,
            y: 25,
          },
          "-=0.5",
        )
        .from(
          imageRef.current,
          {
            opacity: 0,
            scale: 0.95,
          },
          "-=0.6",
        )
        .from(
          socialRef.current,
          {
            opacity: 0,
            y: 20,
          },
          "-=0.5",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <section
      id="home"
      ref={containerRef}
      className="pt-[90px] pb-[10px] px-6 !min-height: 100vh flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h3
              ref={titleRef}
              className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-snug"
            >
              I'm <span className="text-accent">Vimal PK</span>
            </h3>

            <h5>Skills :</h5>

            <p
              ref={subtitleRef}
              className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              Typescript, Node.js, React.js | API Integration | Databases
              (MySQL, MongoDB, Supabase DB, prisma ORM) | Cloud & FTP Deployment
              | SSL/TLS with Let’s Encrypt | Version Control (Git, Bitbucket).
            </p>

            {/* Buttons Row */}
            {/* Buttons */}
            <div ref={buttonRef} className="flex flex-col gap-3">
              {/* Download Resume */}
              {/* <button className="w-fit px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-sm md:text-base bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
                Download Resume
              </button> */}

              <a
                href="https://aortepjbbvixlgouowra.supabase.co/storage/v1/object/public/vimal-official/resume/Vimal_PK.pdf"
                download
                className="inline-block w-fit px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-sm md:text-base bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Download Resume
              </a>

              {/* Social Buttons */}
              <div className="flex gap-3 flex-wrap">
                {/* GitHub */}

                <button
                  onClick={() =>
                    window.open("https://github.com/vimalofficial", "_blank")
                  }
                  className="flex items-center gap-2 flex-shrink-0 px-2 py-2 rounded-lg border border-border transition-all whitespace-nowrap"
                >
                  <Image
                    src="/github.png"
                    alt="GitHub"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  Github
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/vimal-pk-b140a3285/",
                      "_blank",
                    )
                  }
                  className="flex items-center gap-2 flex-shrink-0 px-2 py-2 rounded-lg border border-border transition-all whitespace-nowrap"
                >
                  <Image
                    src="/download.png"
                    alt="LinkedIn"
                    width={19}
                    height={19}
                    className="object-contain"
                  />
                  LinkedIn
                </button>
              </div>
            </div>
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

        {/* Tech Stack */}
        <div ref={socialRef} id="tech-stack" className="mt-10 w-full">
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

          {/* Mobile Marquee */}
          <div className="md:hidden overflow-hidden">
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div
                className="flex gap-4 whitespace-nowrap"
                style={{
                  animation: "marquee 10s linear infinite",
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
                      className="px-4 py-1.5 bg-card border border-border rounded-md text-xs text-muted-foreground flex-shrink-0"
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
