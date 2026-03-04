'use client';

import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";

export function FloatingCallButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (btnRef.current) {
        btnRef.current.classList.add("shake");

        setTimeout(() => {
          btnRef.current?.classList.remove("shake");
        }, 600);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <a
      ref={btnRef}
      href="tel:+918838865435"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center
      rounded-full border-2 shadow-lg hover:scale-110 transition-transform"
      style={{
        backgroundColor: "#020202",
        borderColor: "#c25f00",
        color: "#c25f00"
      }}
      aria-label="Call Now"
    >
      <Phone size={20} strokeWidth={2.5} />
    </a>
  );
}