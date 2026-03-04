// 'use client';

// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// export function Contact() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(contentRef.current, {
//         opacity: 0,
//         y: 40,
//         duration: 0.8,
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: 'top 80%',
//           toggleActions: 'play none none none',
//         },
//       });
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section id="contact" ref={containerRef} className="py-20 px-4 bg-[#f1f1f1]">
//       <div className="max-w-6xl mx-auto">
//         <div ref={contentRef} className="grid md:grid-cols-2 gap-12">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-bold !text-black text-foreground mb-6">
//               What Can I Do For Your Needs
//             </h2>
//             <p className="text-muted-foreground text-lg mb-8">
//               It is easier without the worry to the experts to get the best results with reliable quality
//             </p>
//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <div className="text-accent text-2xl mt-1">📊</div>
//                 <div>
//                   <h3 className="font-bold text-foreground">250+</h3>
//                   <p className="text-muted-foreground">Clients Completed</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="text-accent text-2xl mt-1">⭐</div>
//                 <div>
//                   <h3 className="font-bold text-foreground">100+</h3>
//                   <p className="text-muted-foreground">Projects Delivered</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="text-accent text-2xl mt-1">🏆</div>
//                 <div>
//                   <h3 className="font-bold text-foreground">30+</h3>
//                   <p className="text-muted-foreground">Happy Clients</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="text-accent text-2xl mt-1">💼</div>
//                 <div>
//                   <h3 className="font-bold text-foreground">10+</h3>
//                   <p className="text-muted-foreground">Years Experience</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="bg-card p-8 rounded-xl border border-border">
//               <h3 className="text-2xl font-bold text-foreground mb-6">Contact Me</h3>
//               <form className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Name</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
//                     placeholder="Your Name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Email</label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
//                     placeholder="your@email.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Message</label>
//                   <textarea
//                     rows={4}
//                     className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
//                     placeholder="Your message here..."
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
//                 >
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>

//         <div className="mt-16 pt-12 border-t border-border">
//           <div className="text-center">
//             <h3 className="text-2xl font-bold text-foreground mb-6">Connect With Me</h3>
//             <div className="flex justify-center gap-6">
//               <a href="#" className="text-accent hover:text-secondary transition-colors">
//                 <span className="sr-only">Facebook</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333H16V2.169C15.547 2.118 14.357 2 12.999 2 9.735 2 7 4.26 7 7.577V8z" />
//                 </svg>
//               </a>
//               <a href="#" className="text-accent hover:text-secondary transition-colors">
//                 <span className="sr-only">Twitter</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 5-5 8v4z" />
//                 </svg>
//               </a>
//               <a href="#" className="text-accent hover:text-secondary transition-colors">
//                 <span className="sr-only">LinkedIn</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
//                 </svg>
//               </a>
//               <a href="#" className="text-accent hover:text-secondary transition-colors">
//                 <span className="sr-only">Instagram</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
//                   <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
//                   <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-24 px-6 bg-[#f1f1f1]"
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={contentRef}
          className="grid md:grid-cols-2 gap-16 items-start"
        >
          {/* LEFT SIDE */}
          <div>
            <h2 className="text-3xl md:text-4xl !text-black font-bold text-foreground mb-6">
              Let’s Build Something Scalable
            </h2>

            <p className="text-muted-foreground text-base !text-black leading-relaxed mb-8">
              If you're looking for a developer who can design REST APIs,
              deploy production-ready applications on AWS, configure SSL,
              integrate payment systems, and build scalable full-stack
              platforms — let’s connect.
            </p>

            <div className="space-y-4 text-sm text-muted-foreground ">
              <p className="text-black">
                📧 Email:{" "}
                <a
                  href="mailto:your@email.com"
                  className="text-accent hover:underline"
                >
                  vimalpk.official@gmail.com
                </a>
              </p>

              <p className="text-black">
                💼 LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/vimal-pk-b140a3285/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  https://www.linkedin.com/in/vimal-pk-b140a3285/
                </a>
              </p>

              <p className="text-black">
                🧑‍💻 GitHub:{" "}
                <a
                  href="https://github.com/vimalofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  github.com/vimalofficial
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div>
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Send a Message
              </h3>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-20 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vimal PK. Built with Next.js & GSAP.
        </div>
      </div>
    </section>
  );
}

