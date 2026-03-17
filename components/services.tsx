"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsContentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("pyramidions");

  // Scroll-in entrance animation
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(titleRef.current, {
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
          tabsListRef.current,
          {
            opacity: 0,
            x: isMobile ? 0 : -50,
            y: isMobile ? 20 : 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          tabsContentRef.current,
          {
            opacity: 0,
            x: isMobile ? 0 : 50,
            y: isMobile ? 20 : 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate entire tab card when switching tabs
  useEffect(() => {
    if (!tabsContentRef.current) return;

    gsap.fromTo(
      tabsContentRef.current,
      {
        opacity: 0,
        y: 20,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
      },
    );
  }, [activeTab]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-[30px] px-3 bg-[#f1f1f1]"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* TITLE */}
        <div className="text-center mb-14">
          <h2
            ref={titleRef}
            className="text-2xl md:text-4xl !text-black font-bold mb-4"
          >
            Professional Experience
          </h2>

          <p
            ref={descriptionRef}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Building scalable systems, deploying production-ready applications,
            and delivering reliable digital solutions.
          </p>
        </div>

        <Tabs
          defaultValue="pyramidions"
          orientation="vertical"
          onValueChange={(val) => setActiveTab(val)}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* LEFT SIDE */}
            <div ref={tabsListRef} className="md:col-span-4 w-full">
              <div className="w-full overflow-x-auto md:overflow-visible">
                <TabsList className="flex md:flex-col flex-row gap-3 w-max md:w-full bg-transparent p-0">
                  <TabsTrigger
                    value="pyramidions"
                    className="flex-shrink-0 md:w-full px-5 py-3 !text-black rounded-lg border border-border data-[state=active]:border-accent data-[state=active]:bg-accent/10 transition-all whitespace-nowrap"
                  >
                    Pyramidions Solutions
                  </TabsTrigger>

                  <TabsTrigger
                    value="socialbeat"
                    className="flex-shrink-0 md:w-full px-5 py-3 !text-black rounded-lg border border-border data-[state=active]:border-accent data-[state=active]:bg-accent/10 transition-all whitespace-nowrap"
                  >
                    Social Beat
                  </TabsTrigger>

                  <TabsTrigger
                    value="projects"
                    className="flex-shrink-0 md:w-full px-5 py-3 !text-black rounded-lg border border-border data-[state=active]:border-accent data-[state=active]:bg-accent/10 transition-all whitespace-nowrap"
                  >
                    Personal Projects
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div ref={tabsContentRef} className="md:col-span-8 w-full">
              <TabsContent
                value="projects"
                className="relative p-6 pt-12 rounded-xl border border-border bg-card"
              >
                <span className="absolute top-4 right-4 text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full whitespace-nowrap">
                  Personal Project
                </span>

                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">
                    Website Analyzer
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    AI Powered Website Performance & SEO Analyzer
                  </p>
                </div>

                <div className="space-y-6 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Key Features
                    </h4>

                    <ul className="space-y-2">
                      <li>• Website Performance Analysis using Lighthouse</li>
                      <li>• AI Insights using Google Gemini API</li>
                      <li>• PageSpeed Insights API Integration</li>
                      <li>• Headless Browser Testing with Browserless API</li>
                      <li>• Automated PDF Report Generation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Tech Stack
                    </h4>

                    <ul className="space-y-2">
                      <li>• Node.js, Express.js</li>
                      <li>• EJS Template Engine</li>
                      <li>• MongoDB Database</li>
                      <li>• Multer File Upload</li>
                      <li>• html2canvas for PDF Reports</li>
                      <li>• Vercel Deployment</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Integrations
                    </h4>

                    <ul className="space-y-2">
                      <li>• Google PageSpeed Insights API</li>
                      <li>• Gemini for Google Cloud AI</li>
                      <li>• Browserless API</li>
                    </ul>
                  </div>

                  <div>
                    <ul className="space-y-2">
                      <li className="break-all">
                        • Live Project:{" "}
                        <a
                          href="https://vimal-official-website-analyzer.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://vimal-official-website-analyzer.vercel.app/
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* PYRAMIDIONS */}
              <TabsContent
                value="pyramidions"
                className="relative p-6 pt-12 rounded-xl border border-border bg-card"
              >
                <span className="absolute top-4 right-4 text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full whitespace-nowrap">
                  Aug 2025 - Till
                </span>

                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">
                    Full Stack Developer
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pyramidions Solutions - Maduravoyal, Chennai
                  </p>
                </div>

                <div className="space-y-6 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      PKG AstroTalk Admin Platform
                    </h4>
                    <ul className="space-y-2">
                      <li>• Backend API Architecture</li>
                      <li>• Admin Dashboard Integration</li>
                      <li>• Production Deployment</li>
                      <li className="break-all">
                        • API Docs:{" "}
                        <a
                          href="https://adminapi.pkgastrotalk.com/api-docs/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://adminapi.pkgastrotalk.com/api-docs/
                        </a>
                      </li>
                      <li className="break-all">
                        • Admin Panel:{" "}
                        <a
                          href="https://admin.pkgastrotalk.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://admin.pkgastrotalk.com/
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Synapse Sprints API
                    </h4>
                    <ul className="space-y-2">
                      <li>• REST APIs Developed & Deployed</li>
                      <li>• Domain Pointing & SSL Configuration</li>
                      <li>• Razorpay Integration</li>
                      <li className="break-all">
                        • Live API:{" "}
                        <a
                          href="https://api.synapsesprints.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://api.synapsesprints.com/
                        </a>
                      </li>
                      <li className="break-all">
                        • Admin Panel:{" "}
                        <a
                          href="https://admin.synapsesprints.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://admin.synapsesprints.com/
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* SOCIAL BEAT */}
              <TabsContent
                value="socialbeat"
                className="relative p-6 pt-12 rounded-xl border border-border bg-card"
              >
                <span className="absolute top-4 right-4 text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full whitespace-nowrap">
                  Jan 2025 - Aug 2025
                </span>

                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">
                    Web Developer Intern
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Social Beat | Internship - Egmore, Chennai
                  </p>
                </div>

                <div className="space-y-6 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Casagrand Primrose
                    </h4>
                    <ul className="space-y-2">
                      <li>• WordPress Development (PHP)</li>
                      <li>• Deployment & SSL Setup</li>
                      <li className="break-all">
                        • Live Site:{" "}
                        <a
                          href="https://casagrandprimrose.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://casagrandprimrose.com/
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-white">JK Cement</h4>
                    <ul className="space-y-2">
                      <li>• WordPress Custom Theme Setup</li>
                      <li>• SSL & Server Configuration</li>
                      <li className="break-all">
                        • Live Site:{" "}
                        <a
                          href="https://www.jkcement.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://www.jkcement.com/
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-white">JK AYA</h4>
                    <ul className="space-y-2">
                      <li>• CMS Configuration</li>
                      <li>• DNS Mapping & SSL</li>
                      <li className="break-all">
                        • Live Site:{" "}
                        <a
                          href="https://aya.jkcement.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          https://aya.jkcement.com/
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
