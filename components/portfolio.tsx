// 'use client';

// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// export function Portfolio() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const itemsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(titleRef.current, {
//         opacity: 0,
//         y: 30,
//         duration: 0.8,
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: 'top 80%',
//           toggleActions: 'play none none none',
//         },
//       });

//       const items = itemsRef.current?.querySelectorAll('[data-project]');
//       if (items) {
//         gsap.from(items, {
//           opacity: 0,
//           y: 40,
//           stagger: 0.15,
//           duration: 0.8,
//           scrollTrigger: {
//             trigger: itemsRef.current,
//             start: 'top 80%',
//             toggleActions: 'play none none none',
//           },
//         });
//       }
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   const projects = [
//     {
//       title: 'UI/UX Design',
//       count: 'UI Project',
//       arrow: true,
//     },
//     {
//       title: 'Front End Development',
//       count: 'UI Project',
//       arrow: true,
//     },
//     {
//       title: 'Mobile App Development',
//       count: 'UI Project',
//       arrow: true,
//     },
//   ];

//   return (
//     <section id="portfolio" ref={containerRef} className="py-20 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-16">
//           <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-foreground mb-4">
//             Portfolio
//           </h2>
//           <p className="text-muted-foreground text-lg">
//             View my recent projects and work experience
//           </p>
//         </div>

//         <div ref={itemsRef} className="space-y-4">
//           {projects.map((project, index) => (
//             <div
//               key={index}
//               data-project
//               className="p-6 bg-card rounded-lg border border-border hover:border-accent hover:bg-card/50 transition-all group cursor-pointer"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
//                     {project.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">{project.count}</p>
//                 </div>
//                 {project.arrow && (
//                   <div className="text-accent group-hover:translate-x-2 transition-transform">
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


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
          {/* <p className="text-muted-foreground text-lg max-w-3xl">
            Full-stack developer specializing in scalable backend systems,
            cloud deployment, and production-ready web applications.
          </p> */}
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
              I design and develop secure REST APIs, real-time systems,
              and full-stack applications using Node.js and Next.js.
              My focus is on building scalable architectures that are
              optimized for performance and reliability.
            </p>

            <p>
              I have hands-on experience deploying applications on AWS,
              configuring S3 storage, implementing SSL certificates,
              domain mapping, and managing production environments.
            </p>

            <p>
              I also integrate third-party services such as Razorpay,
              Google APIs, and email systems, ensuring seamless
              communication between systems and secure payment workflows.
            </p>
          </div>

          {/* RIGHT STATS / HIGHLIGHTS */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">100+</h3>
              <p className="text-sm text-muted-foreground mt-1">
                APIs Built
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">5+</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Deployments
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">30+</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Integrations
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-2xl font-bold text-accent">1+</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Years Experience
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}