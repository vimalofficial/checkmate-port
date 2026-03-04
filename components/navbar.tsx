'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [active, setActive] = useState('home');

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string, scrollToCenter?: boolean) => {
    e.preventDefault();
    setActive(id);
    const element = document.getElementById(id);
    if (element) {
      if (scrollToCenter) {
        const elementRect = element.getBoundingClientRect();
        const elementTop = window.scrollY + elementRect.top;
        const elementHeight = elementRect.height;
        const viewportHeight = window.innerHeight;
        const scrollPosition = elementTop - (viewportHeight - elementHeight) / 2;
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="#home" className="text-2xl font-bold text-accent hover:text-secondary transition-colors">
            V
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <a
              href="#home"
              onClick={(e) => handleScroll(e, 'home')}
              className={`transition-colors ${
                active === 'home' ? 'text-accent' : 'text-foreground hover:text-accent'
              }`}
            >
              Home
            </a>
            <a
              // href="#tech-stack"
                            href="#services"
              onClick={(e) => handleScroll(e, 'services', true)}
              className={`transition-colors ${
                active === 'services' ? 'text-accent' : 'text-foreground hover:text-accent'
              }`}
            >
              Experience
            </a>
            <a
              href="#portfolio"
              onClick={(e) => handleScroll(e, 'portfolio')}
              className={`transition-colors ${
                active === 'portfolio' ? 'text-accent' : 'text-foreground hover:text-accent'
              }`}
            >
              Portfolio
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className={`transition-colors ${
                active === 'contact' ? 'text-accent' : 'text-foreground hover:text-accent'
              }`}
            >
              Contact
            </a>
          </div>

          <button className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
