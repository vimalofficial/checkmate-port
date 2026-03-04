"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    scrollToCenter?: boolean
  ) => {
    e.preventDefault();
    setActive(id);
    setIsOpen(false); // 🔥 Close mobile menu after click

    const element = document.getElementById(id);
    if (element) {
      if (scrollToCenter) {
        const elementRect = element.getBoundingClientRect();
        const elementTop = window.scrollY + elementRect.top;
        const elementHeight = elementRect.height;
        const viewportHeight = window.innerHeight;
        const scrollPosition =
          elementTop - (viewportHeight - elementHeight) / 2;

        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="#home"
            onClick={(e) => handleScroll(e as any, "home")}
            className="text-2xl font-bold text-accent hover:text-secondary transition-colors"
          >
            V
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { id: "home", label: "Home" },
              { id: "services", label: "Experience", center: true },
              { id: "portfolio", label: "About" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) =>
                  handleScroll(e, item.id, item.center)
                }
                className={`transition-colors ${
                  active === item.id
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border animate-in slide-in-from-top duration-300">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {[
              { id: "home", label: "Home" },
              { id: "services", label: "Experience", center: true },
              { id: "portfolio", label: "About" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) =>
                  handleScroll(e, item.id, item.center)
                }
                className={`transition-colors ${
                  active === item.id
                    ? "text-accent"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}