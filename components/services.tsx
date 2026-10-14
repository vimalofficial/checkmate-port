"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

gsap.registerPlugin(ScrollTrigger);

/** useLayoutEffect on the client, useEffect on the server (no SSR warning) */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsContentRef = useRef<HTMLDivElement>(null);

  const isFirstTabRender = useRef(true);

  const [activeTab, setActiveTab] = useState("cyberwarfare");

  // Scroll-in entrance animation.
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .from(titleRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          descriptionRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          skillsRef.current,
          {
            opacity: 0,
            y: 28,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.25",
        )
        .from(
          tabsListRef.current,
          {
            opacity: 0,
            x: isMobile ? 0 : -50,
            y: isMobile ? 20 : 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.25",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate only the active tab panel when the tab changes.
  // Runs BEFORE paint (layout effect) so the new panel never flashes
  // at full opacity first. Skipped on first render.
  useIsoLayoutEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false;
      return;
    }

    if (!tabsContentRef.current) return;

    const ctx = gsap.context(() => {
      const activePanel = tabsContentRef.current?.querySelector<HTMLElement>(
        '[role="tabpanel"][data-state="active"]',
      );

      if (!activePanel) return;

      gsap.fromTo(
        activePanel,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    }, tabsContentRef);

    return () => ctx.revert();
  }, [activeTab]);

  // h-auto + flex-none: the shadcn trigger defaults to
  // h-[calc(100%-1px)] flex-1, which squashes vertical tabs and makes
  // their text overlap.
  const tabTriggerClass =
    "h-auto flex-none justify-start text-left md:w-full px-5 py-3 !text-black rounded-lg border border-border data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:shadow-none transition-colors whitespace-nowrap";

  const linkClass = "text-accent hover:underline font-medium break-all";

  return (
    <section
      id="services"
      ref={containerRef}
      className="bg-[#f1f1f1] px-3 py-[30px]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-14 text-center">
          <h2
            ref={titleRef}
            className="mb-4 text-2xl font-bold !text-black md:text-4xl"
          >
            Professional Experience
          </h2>

          <p
            ref={descriptionRef}
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Building scalable applications, deploying production systems, and
            automating reliable infrastructure.
          </p>
        </div>

        {/* TECHNICAL SKILLS */}
        <div ref={skillsRef} className="relative isolate flow-root mb-20 w-full">
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Technical Toolkit
            </p>
            <h3 className="text-xl font-bold !text-black md:text-2xl">
              Technical Skills
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              Technologies I use to build applications, integrate APIs, and deploy reliable systems.
            </p>
          </div>

          <div className="relative grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Backend & APIs",
                skills: ["Node.js", "Express.js", "REST APIs", "JWT", "IDP", "Socket.IO", "OTP Integration", "Email Integrations"],
              },
              {
                title: "Databases & Storage",
                skills: ["MySQL", "PostgreSQL", "MongoDB", "Supabase", "Prisma ORM", "AWS S3", "Supabase Storage", "GCP Buckets"],
              },
              {
                title: "DevOps & Infrastructure",
                skills: ["Docker", "Docker Images", "Kubernetes", "Kubernetes YAML", "Services", "Service Accounts", "RBAC", "Service Tokens", "PAT Tokens", "Namespaces", "Linux", "HAProxy", "Nginx", "PM2", "Git"],
              },
              {
                title: "Cloud & Deployment",
                skills: ["AWS", "Vercel", "Render", "Netlify", "Domain Mapping", "SSL/TLS", "Let's Encrypt", "Certbot"],
              },
              {
                title: "Frontend Development",
                skills: ["JavaScript", "TypeScript", "React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Redux"],
              },
              {
                title: "CMS, Testing & Integrations",
                skills: ["WordPress", "PHP", "Razorpay", "Google APIs", "Puppeteer", "Lighthouse", "Browserless API", "Google AI Studio", "Postman", "GitHub", "Bitbucket"],
              },
            ].map((category) => (
              <div
                key={category.title}
                className="skill-card relative box-border min-w-0 rounded-xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <h4 className="mb-3 font-semibold text-black">{category.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-[#f1f1f1] px-2.5 py-1 text-xs font-medium text-black"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="w-full"
          >
            <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-12">
              {/* LEFT: EXPERIENCE TABS */}
              <div
                ref={tabsListRef}
                className="min-w-0 w-full self-start md:col-span-4"
              >
                <div className="w-full overflow-x-auto md:overflow-visible">
                  {/* h-auto: the shadcn TabsList defaults to a fixed h-9,
                      which crushed the stacked tabs together */}
                  <TabsList className="m-0 flex h-auto w-max items-stretch self-start gap-3 bg-transparent p-0 md:w-full md:flex-col">
                    <TabsTrigger
                      value="cyberwarfare"
                      className={tabTriggerClass}
                    >
                      Cyberwarfare Labs
                    </TabsTrigger>
                    <TabsTrigger
                      value="pyramidions"
                      className={tabTriggerClass}
                    >
                      Pyramidion Solutions
                    </TabsTrigger>
                    <TabsTrigger value="socialbeat" className={tabTriggerClass}>
                      Social Beat
                    </TabsTrigger>
                    <TabsTrigger value="projects" className={tabTriggerClass}>
                      Personal Projects
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* RIGHT: SELECTED EXPERIENCE */}
              <div
                ref={tabsContentRef}
                className="min-w-0 w-full self-start md:col-span-8"
              >
                {/* CYBERWARFARE LABS */}
                <TabsContent
                  className="relative m-0 w-full rounded-xl border border-border bg-card p-6 pt-12"
                  value="cyberwarfare"
                >
                  <span className="absolute right-4 top-4 whitespace-nowrap rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
                    Jun 2026 – Present
                  </span>

                  <h3 className="mb-2 text-xl font-semibold">
                    Full Stack Developer
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Cyberwarfare Labs · Bengaluru, India
                  </p>

                  <div className="space-y-6 text-sm text-muted-foreground">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Infinity Platform
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          • Integrated Identity Provider (IDP) synchronization
                          with applications.
                        </li>
                        <li>
                          • Created Docker images and containers for cybersecurity
                          lab environments.
                        </li>
                        <li>
                          • Created Kubernetes YAML manifests for Deployments,
                          Services, Namespaces, Service Accounts, and RBAC.
                        </li>
                        <li>
                          • Configured Linux servers, application hosting,
                          databases, file uploads, and connectivity between
                          applications and lab services.
                        </li>
                        <li>
                          • Worked on automation workflows for lab provisioning,
                          scheduling, queue processing, and resource cleanup.
                        </li>
                        <li>
                          • Configured HAProxy and Nginx for application routing,
                          reverse proxying, and load balancing.
                        </li>
                        <li>
                          • Configured links and service connectivity required
                          for lab access.
                        </li>
                      </ul>
                      <p className="mt-3">
                        • Live Project:{" "}
                        <a
                          href="https://infinity.cyberwarfare.live/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          infinity.cyberwarfare.live
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        CTFd Automation
                      </h4>
                      <p>
                        Worked on lab activity and automation-related services.
                      </p>
                      <p className="mt-2">
                        • Service:{" "}
                        <a
                          href="http://51.38.79.249:5000/labactivity/health"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          CTFd Automation Health Endpoint
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Technologies
                      </h4>
                      <p>
                        Docker, Kubernetes, YAML, Linux, HAProxy, Nginx, IDP
                        integration, server configuration, database setup, queue
                        processing, and automation.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* PYRAMIDION SOLUTIONS */}
                <TabsContent
                  className="relative m-0 w-full rounded-xl border border-border bg-card p-6 pt-12"
                  value="pyramidions"
                >
                  <span className="absolute right-4 top-4 whitespace-nowrap rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
                    Aug 2025 – May 2026
                  </span>

                  <h3 className="mb-2 text-xl font-semibold">
                    Full Stack Developer
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Pyramidion Solutions · Chennai, India
                  </p>

                  <div className="space-y-6 text-sm text-muted-foreground">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        PK AstroTalk Admin
                      </h4>
                      <ul className="space-y-2">
                        <li>• Backend API development and integration.</li>
                        <li>• Admin dashboard functionality.</li>
                        <li>• Application deployment and maintenance.</li>
                      </ul>
                      <p className="mt-3">
                        • Live Admin:{" "}
                        <a
                          href="https://admin.pkgastrotalk.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          admin.pkgastrotalk.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Synapse Sprints
                      </h4>
                      <ul className="space-y-2">
                        <li>• REST API development and deployment.</li>
                        <li>• Domain mapping and SSL configuration.</li>
                        <li>• Payment gateway integration.</li>
                      </ul>
                      <p className="mt-3">
                        • Live Admin:{" "}
                        <a
                          href="https://admin.synapsesprints.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          admin.synapsesprints.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Technologies
                      </h4>
                      <p>
                        Node.js, Express.js, TypeScript, React.js, Next.js,
                        Prisma ORM, PostgreSQL, MongoDB, Socket.IO, AWS, and
                        SSL/TLS.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* SOCIAL BEAT */}
                <TabsContent
                  className="relative m-0 w-full rounded-xl border border-border bg-card p-6 pt-12"
                  value="socialbeat"
                >
                  <span className="absolute right-4 top-4 whitespace-nowrap rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
                    Jan 2025 – Aug 2025
                  </span>

                  <h3 className="mb-2 text-xl font-semibold">Web Developer</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Social Beat · Chennai, India
                  </p>

                  <div className="space-y-6 text-sm text-muted-foreground">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Social Beat Team Page
                      </h4>
                      <ul className="space-y-2">
                        <li>• WordPress website development and customization.</li>
                        <li>• Dynamic content and CMS configuration.</li>
                      </ul>
                      <p className="mt-3">
                        • Live Site:{" "}
                        <a
                          href="https://teampage.socialbeat.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          teampage.socialbeat.in
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        JK Cement AYA
                      </h4>
                      <ul className="space-y-2">
                        <li>• Website and CMS customization.</li>
                        <li>• Website deployment and configuration.</li>
                      </ul>
                      <p className="mt-3">
                        • Live Site:{" "}
                        <a
                          href="https://aya.jkcement.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          aya.jkcement.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Technologies
                      </h4>
                      <p>
                        WordPress, PHP, MySQL, Elementor, Advanced Custom Fields
                        (ACF), Gravity Forms, HTML, CSS, and JavaScript.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* PERSONAL PROJECTS */}
                <TabsContent
                  className="relative m-0 w-full rounded-xl border border-border bg-card p-6 pt-12"
                  value="projects"
                >
                  <span className="absolute right-4 top-4 whitespace-nowrap rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
                    Personal Project
                  </span>

                  <h3 className="mb-2 text-xl font-semibold">Website Analyzer</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    AI-assisted website performance, SEO, and competitor analysis.
                  </p>

                  <div className="space-y-6 text-sm text-muted-foreground">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        <li>• Website performance analysis using Lighthouse.</li>
                        <li>• Automated browser workflows using Puppeteer.</li>
                        <li>• Headless browser integration through Browserless API.</li>
                        <li>• AI-assisted competitor analysis using Google AI Studio.</li>
                        <li>• Website insights and report generation.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Technologies
                      </h4>
                      <p>
                        Next.js, Node.js, Express.js, Puppeteer, Google
                        Lighthouse, Browserless API, Google AI Studio, MongoDB,
                        and Vercel.
                      </p>
                    </div>

                    <p>
                      • Live Project:{" "}
                      <a
                        href="https://vimal-official-website-analyzer.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        vimal-official-website-analyzer.vercel.app
                      </a>
                    </p>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}