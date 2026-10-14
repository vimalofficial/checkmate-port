'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 85%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="portfolio" ref={containerRef} className="py-10 px-3 bg-card/30">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <div className="mb-4">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            About Me
          </h2>
          <p className="text-muted-foreground text-md max-w-3xl">
           I am capable of  Plan | Design | Develop | Deploy | Integrate | Optimize
          </p>
        </div>

        {/* CONTENT */}
        <div
          ref={contentRef}
          className="grid md:grid-cols-2 gap-7 items-start"
        >
          {/* LEFT TEXT */}
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m a full-stack developer who builds web applications,
              REST APIs and real-time features with JavaScript, TypeScript,
              Node.js, React and Next.js. I work with MySQL, PostgreSQL and
              MongoDB through Prisma ORM, and secure applications with JWT
              authentication and role-based authorization.
            </p>

            <p>
              On the infrastructure side, I containerize applications with
              Docker, write Kubernetes manifests (Deployments, Services,
              Namespaces, RBAC), and configure Linux servers with HAProxy,
              Nginx and PM2. I&apos;ve deployed production apps on AWS EC2
              and S3 with SSL/TLS, reverse proxying and load balancing.
            </p>

            <p>
              At Cyberwarfare Labs I work on the Infinity platform: IDP
              synchronization, lab provisioning and scheduling, queue
              processing and automated resource cleanup. I also integrate
              third-party APIs and AI services, including Google AI Studio,
              into real products.
            </p>
          </div>

          {/* RIGHT STATS / HIGHLIGHTS */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">1+</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Years Experience
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">3</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Companies
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">7</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Live Projects
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">2</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Degrees (BCA, MCA)
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}