"use client";

import { useEffect, useRef } from "react";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setName("");
      setEmail("");
      setMessage("");

      setToastMessage("Message sent successfully.");
      setOpenToast(true);
    } else {
      setToastMessage("Failed to send message.");
      setOpenToast(true);
    }
  };

  return (
    <section id="contact" ref={containerRef} className="py-9 px-3 bg-[#f1f1f1]">
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
              If you're looking for a developer who can design REST APIs, deploy
              production-ready applications on AWS, configure SSL, integrate
              payment systems, and build scalable full-stack platforms — let’s
              connect.
            </p>
            import Image from "next/image";
            <div className="space-y-4 text-sm text-muted-foreground">
              {/* Email */}
              <div className="flex items-center gap-2 text-black">
                <Image
                  src="/email.png"
                  alt="Email"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <span>Email:</span>
                <a
                  href="mailto:vimalpk.official@gmail.com"
                  className="text-accent hover:underline"
                >
                  vimalpk.official@gmail.com
                </a>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-2 text-black">
                <Image
                  src="/download.png"
                  alt="LinkedIn"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <span>LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/vimal-pk-b140a3285/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  linkedin.com/in/vimal-pk-b140a3285
                </a>
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-2 text-black">
                <Image
                  src="/github.png"
                  alt="GitHub"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <span>GitHub:</span>
                <a
                  href="https://github.com/vimalofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  github.com/vimalofficial
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div>
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Send a Message
              </h3>

              {/* <form className="space-y-5">
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
              </form> */}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Message
                  </label>

                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  {loading && <Spinner />}

                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>

              <Toast open={openToast} onOpenChange={setOpenToast}>
                <ToastTitle>
                  <span className="flex flex-col leading-tight">
                    <span>Vimal PK</span>
                    <span>Portfolio</span>
                  </span>
                </ToastTitle>

                <ToastDescription>{toastMessage}</ToastDescription>
              </Toast>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
