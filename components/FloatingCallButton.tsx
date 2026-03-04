'use client';

import { useEffect, useRef } from "react";
import Image from "next/image";

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
      href="tel:+919876543210"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 border-2 shadow-lg hover:scale-110 transition-transform overflow-hidden"
      style={{
        backgroundColor: "#020202",
        borderColor: "#c25f00"
      }}
      aria-label="Call Now"
    >
      <Image
        src="/phone.png"
        alt="Call"
        fill
        className="object-contain"
      />
    </a>
  );
}