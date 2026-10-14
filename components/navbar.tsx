"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Spinner } from "@/components/ui/spinner";

import { Toast, ToastDescription } from "@/components/ui/toast";

/** useLayoutEffect on the client, useEffect on the server (no SSR warning) */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================================
// SCROLL OFFSET
// The navbar is `fixed`, so a section scrolled to the very top of the
// screen would hide under it. Floating navbar = top-3 (12px) + 68px
// height = 80px, so we stop 90px above the section (10px breathing room).
// If you change the navbar height, change this number too.
// ============================================================

const NAV_OFFSET = 90;

// ============================================================
// PAGE READY GATE
// Starts animations only after: window load + fonts + 2 clean
// frames (max wait 1.5s). Prevents animating while the main
// thread is busy hydrating / decoding images.
// ============================================================

let pageReady = false;

function whenPageReady(cb: () => void): () => void {
  if (pageReady) {
    cb();
    return () => {};
  }

  let cancelled = false;

  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true }),
        );

  const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  const timeout = new Promise<void>((resolve) =>
    window.setTimeout(resolve, 1500),
  );

  Promise.race([Promise.all([loaded, fonts]), timeout]).then(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        pageReady = true;
        if (!cancelled) cb();
      }),
    );
  });

  return () => {
    cancelled = true;
  };
}

// ============================================================
// STATIC DATA
// NOTE: each `id` must match the `id="..."` on the section in your page.
// ============================================================

const MENU_ITEMS: { id: string; label: string; center?: boolean }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Experience" },
  { id: "portfolio", label: "About" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/vimalofficial",
    icon: "/github.png",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vimal-pk-b140a3285/",
    icon: "/download.png",
  },
];

type VisitorData = {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
};

const openExternal = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

// ============================================================
// RESUME BUTTON
// Defined OUTSIDE Navbar so React never remounts it on re-render.
// ============================================================

function ResumeButton({
  mobile = false,
  loading,
  onClick,
}: {
  mobile?: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60 ${
        mobile ? "h-11 w-full" : "h-10 px-3"
      }`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <svg
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
          />
        </svg>
      )}

      <span className="text-sm font-medium">
        {loading ? "Preparing..." : "Download Resume"}
      </span>
    </button>
  );
}

// ============================================================
// NAVBAR
// ============================================================

export function Navbar() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  // Main floating navbar visibility
  const [isVisible, setIsVisible] = useState(true);

  // Full-width developer bar
  const [showDeveloperBar, setShowDeveloperBar] = useState(false);

  // Glass blur is switched on only AFTER the intro finishes
  const [glass, setGlass] = useState(false);

  // Resume states
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData>({});

  // Toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ---------- refs ----------
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleIconRef = useRef<SVGSVGElement>(null);

  // scroll logic lives in refs (no re-renders, no re-subscribing)
  const lastY = useRef(0);
  const ticking = useRef(false);
  const scrollLock = useRef(false);
  const lockTimer = useRef<number | undefined>(undefined);
  const barDismissed = useRef(false);

  // what GSAP last applied (keeps effects idempotent, StrictMode-safe)
  const appliedVisible = useRef(true);
  const appliedBar = useRef(false);
  const appliedMenu = useRef(false);

  // ============================================================
  // INTRO ANIMATION
  // Nav / bar / menu are hidden by CSS from the first frame.
  // The intro waits for the page to be ready (see whenPageReady).
  // ============================================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(barRef.current, { yPercent: -100, autoAlpha: 0 });
    });

    if (prefersReducedMotion()) {
      ctx.add(() => {
        gsap.set(navRef.current, { autoAlpha: 1 });
      });
      setGlass(true);

      return () => ctx.revert();
    }

    const cancel = whenPageReady(() => {
      ctx.add(() => {
        gsap.fromTo(
          navRef.current,
          { autoAlpha: 0, yPercent: -120 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
            force3D: true,
            onComplete: () => setGlass(true),
          },
        );
      });
    });

    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  // ============================================================
  // MAIN NAVBAR  show / hide
  // ============================================================

  useEffect(() => {
    if (appliedVisible.current === isVisible) return;
    appliedVisible.current = isVisible;

    const nav = navRef.current;
    if (!nav) return;

    if (prefersReducedMotion()) {
      gsap.set(nav, {
        autoAlpha: isVisible ? 1 : 0,
        yPercent: isVisible ? 0 : -150,
      });
      return;
    }

    gsap.to(
      nav,
      isVisible
        ? {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
            force3D: true,
          }
        : {
            yPercent: -150,
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.in",
            overwrite: "auto",
            force3D: true,
          },
    );
  }, [isVisible]);

  // ============================================================
  // DEVELOPER BAR  show / hide
  // ============================================================

  useEffect(() => {
    const show = showDeveloperBar && !isVisible;

    if (appliedBar.current === show) return;
    appliedBar.current = show;

    const bar = barRef.current;
    if (!bar) return;

    if (prefersReducedMotion()) {
      gsap.set(bar, {
        autoAlpha: show ? 1 : 0,
        yPercent: show ? 0 : -100,
      });
      return;
    }

    gsap.to(
      bar,
      show
        ? {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.45,
            delay: 0.12, // lets the main navbar start leaving first
            ease: "power3.out",
            overwrite: "auto",
            force3D: true,
          }
        : {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
            force3D: true,
          },
    );
  }, [showDeveloperBar, isVisible]);

  // ============================================================
  // MOBILE MENU  open / close
  // ============================================================

  useEffect(() => {
    if (appliedMenu.current === isOpen) return;
    appliedMenu.current = isOpen;

    const menu = menuRef.current;
    if (!menu) return;

    const items = menu.querySelectorAll<HTMLElement>(".menu-item");
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(menu, { autoAlpha: isOpen ? 1 : 0, y: 0, scale: 1 });
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    if (isOpen) {
      gsap.fromTo(
        menu,
        { autoAlpha: 0, y: -10, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
          force3D: true,
        },
      );

      gsap.fromTo(
        items,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          delay: 0.06,
          stagger: 0.045,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: "transform",
        },
      );
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        y: -8,
        scale: 0.97,
        duration: 0.22,
        ease: "power2.in",
        overwrite: "auto",
        force3D: true,
      });
    }

    // hamburger <-> close icon swap
    if (toggleIconRef.current) {
      gsap.fromTo(
        toggleIconRef.current,
        { rotate: -90, scale: 0.6, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          overwrite: "auto",
          clearProps: "transform,opacity",
        },
      );
    }
  }, [isOpen]);

  // ============================================================
  // SCROLL: hide on down, show on up + keep the active link in sync
  // ============================================================

  useEffect(() => {
    lastY.current = window.scrollY;

    // Which section is currently under the navbar line?
    const syncActiveSection = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (atBottom) {
        setActive(MENU_ITEMS[MENU_ITEMS.length - 1].id);
        return;
      }

      let current = MENU_ITEMS[0].id;

      for (const item of MENU_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET + 40) {
          current = item.id;
        }
      }

      setActive(current);
    };

    const update = () => {
      ticking.current = false;

      const y = Math.max(0, window.scrollY);
      const diff = y - lastY.current;

      // very top -> always show main navbar
      if (y <= 20) {
        setIsVisible(true);
        setShowDeveloperBar(false);
        barDismissed.current = false;
        lastY.current = y;
        if (!scrollLock.current) setActive(MENU_ITEMS[0].id);
        return;
      }

      // nav-link click is scrolling the page -> don't react
      if (scrollLock.current) {
        lastY.current = y;
        return;
      }

      syncActiveSection();

      // scrolling DOWN
      if (diff > 6) {
        setIsVisible(false);
        setIsOpen(false);

        if (!barDismissed.current) {
          setShowDeveloperBar(true);
        }

        lastY.current = y;
      }

      // scrolling UP
      else if (diff < -6) {
        setIsVisible(true);
        setShowDeveloperBar(false);
        barDismissed.current = false;

        lastY.current = y;
      }
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(lockTimer.current);
    };
  }, []);

  // ============================================================
  // MOBILE MENU: close on outside tap / Escape / resize to desktop
  // ============================================================

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  // ============================================================
  // SMOOTH SCROLL (nav links)
  // ============================================================

  const lockScroll = () => {
    scrollLock.current = true;
    window.clearTimeout(lockTimer.current);

    const release = () => {
      window.clearTimeout(lockTimer.current);
      window.removeEventListener("scrollend", release);
      scrollLock.current = false;
      lastY.current = window.scrollY;
    };

    // `scrollend` where supported, timeout as a fallback
    window.addEventListener("scrollend", release, { once: true });
    lockTimer.current = window.setTimeout(release, 1500);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    scrollToCenter?: boolean,
  ) => {
    e.preventDefault();

    setActive(id);
    setIsOpen(false);

    const element = document.getElementById(id);
    if (!element) return;

    lockScroll();

    let top: number;

    if (id === MENU_ITEMS[0].id) {
      // Home -> go all the way to the top
      top = 0;
    } else if (scrollToCenter) {
      // Center the section in the viewport (only if `center: true` is set)
      const rect = element.getBoundingClientRect();
      top = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
    } else {
      // Stop just below the fixed navbar instead of hiding under it
      top = window.scrollY + element.getBoundingClientRect().top - NAV_OFFSET;
    }

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
      setError("Please enter a valid email address.");
      return false;
    }

    setError("");
    return true;
  };

  // ============================================================
  // SEND RESUME
  // ============================================================

  const sendResume = async () => {
    if (!validateEmail(email)) return;

    setLoading(true);

    try {
      // Attach the email entered in the popup to the visitor record.
      await fetch("/api/getdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,

          latitude: visitorData.latitude,
          longitude: visitorData.longitude,
          accuracy: visitorData.accuracy,

          altitude: visitorData.altitude,
          altitudeAccuracy: visitorData.altitudeAccuracy,

          heading: visitorData.heading,
          speed: visitorData.speed,

          timestamp: visitorData.timestamp,

          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio,

          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

          language: navigator.language,
          languages: navigator.languages?.join(", ") || navigator.language,

          platform: navigator.platform,
          userAgent: navigator.userAgent,

          referrer: document.referrer,
          currentUrl: window.location.href,

          event: "resume_download_request",
        }),
      });

      // SEND RESUME EMAIL
      const res = await fetch("/api/send-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setToastMessage("Resume sent successfully. Check your email.");
        setOpenToast(true);

        setEmail("");
        setError("");
        setVisitorData({});
        setDialogOpen(false);
      } else {
        setToastMessage("Failed to send email.");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Resume sending error:", err);

      setToastMessage("Something went wrong. Please try again.");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // COLLECT VISITOR DATA BEFORE OPENING RESUME POPUP
  // ============================================================

  const prepareResumePopup = async () => {
    if (loading) return;

    setLoading(true);

    const baseData = {
      email: "",

      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,

      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      language: navigator.language,
      languages: navigator.languages?.join(", ") || navigator.language,

      platform: navigator.platform,
      userAgent: navigator.userAgent,

      referrer: document.referrer,
      currentUrl: window.location.href,

      event: "resume_popup_clicked",
    };

    const sendVisitorData = async (
      locationData: Record<string, unknown> = {},
    ) => {
      try {
        await fetch("/api/getdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...baseData, ...locationData }),
        });
      } catch (err) {
        // Visitor logging must not stop the resume popup.
        console.error("Visitor data error:", err);
      }
    };

    try {
      if ("geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                timestamp: position.timestamp,
              };

              // Save location for the next request (when email is entered)
              setVisitorData(locationData);

              await sendVisitorData(locationData);
              resolve();
            },

            async (err) => {
              console.warn("Location permission unavailable:", err.message);

              // Location denied/unavailable: still send the other metadata.
              await sendVisitorData();
              resolve();
            },

            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            },
          );
        });
      } else {
        await sendVisitorData();
      }
    } catch (err) {
      console.error("Resume visitor tracking error:", err);
    } finally {
      setLoading(false);

      // close the mobile menu so it doesn't sit behind the dialog overlay
      setIsOpen(false);

      // Popup opens ONLY AFTER /api/getdata was attempted.
      setDialogOpen(true);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);

        // Clear popup data whenever popup closes.
        if (!open) {
          setEmail("");
          setError("");
          setLoading(false);
          setVisitorData({});
        }
      }}
    >
      {/* ======================================================
          MAIN FLOATING NAVBAR
          - hidden from first paint (opacity-0 invisible)
          - centered with inset-x-0 mx-auto (NO tailwind translate,
            so GSAP owns the transform alone)
      ====================================================== */}

      <nav
        ref={navRef}
        className="invisible fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl opacity-0"
      >
        <div className="relative">
          {/* Outer glow (box-shadow, no blur filter) */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-[22px] bg-accent/10 shadow-[0_0_28px_0] shadow-accent/20" />

          {/* Main Navbar
              backdrop blur is enabled only after the intro (glass) */}
          <div
            className={`relative flex h-[68px] items-center rounded-[22px] border border-accent/30 px-2 shadow-[0_8px_40px_rgba(0,0,0,0.18)] sm:px-4 ${
              glass ? "bg-background/90 backdrop-blur-xl" : "bg-background/95"
            }`}
          >
            {/* LOGO */}
            <Link
              href="#home"
              onClick={(e) => handleNavClick(e, "home")}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[15px] bg-accent text-xl font-bold text-background shadow-lg transition-transform duration-200 hover:scale-105"
            >
              V
            </Link>

            {/* Divider */}
            <div className="mx-4 hidden h-8 w-px bg-border/70 md:block" />

            {/* DESKTOP NAVIGATION */}
            <div className="hidden flex-1 items-center gap-1 md:flex">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id, item.center)}
                  className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    active === item.id
                      ? "bg-accent/10 text-accent"
                      : "text-foreground/65 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {item.label}

                  {active === item.id && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </a>
              ))}
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden items-center gap-2 md:flex">
              {SOCIALS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => openExternal(s.href)}
                  className="group flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-background/40 px-3 transition-colors duration-200 hover:border-accent/40 hover:bg-accent/5"
                >
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={18}
                    height={18}
                    className="object-contain transition-transform group-hover:scale-110"
                  />

                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              ))}

              {/* <ResumeButton loading={loading} onClick={prepareResumePopup} /> */}

              <ResumeButton
                loading={false}
                onClick={() => {
                  window.location.href =
                    "https://drive.google.com/file/d/1vYA7dXFQ0ybnJkzvZoaj6MYLij-43ArR/view?usp=sharing";
                }}
              />
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-[14px] border border-border/70 transition-colors duration-200 hover:border-accent/40 hover:bg-accent/5 md:hidden"
            >
              <svg
                ref={toggleIconRef}
                className="h-5 w-5"
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

          {/* ==================================================
              MOBILE DROPDOWN
              - ALWAYS mounted, GSAP animates open/close
              - solid background (no backdrop blur while animating)
              - items use transition-colors only (no GSAP conflict)
          ================================================== */}

          <div
            ref={menuRef}
            className="invisible absolute inset-x-0 top-[78px] origin-top-right rounded-[22px] border border-accent/30 bg-background p-3 opacity-0 shadow-[0_12px_40px_rgba(0,0,0,0.2)] md:hidden"
          >
            {/* Navigation */}
            <div className="flex flex-col gap-1">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id, item.center)}
                  className={`menu-item flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    active === item.id
                      ? "bg-accent/10 text-accent"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-border/60" />

            {/* Social Buttons */}
            <div className="menu-item grid grid-cols-2 gap-2">
              {SOCIALS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => openExternal(s.href)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border/70 transition-colors duration-200 hover:border-accent/40 hover:bg-accent/5"
                >
                  <Image src={s.icon} alt={s.label} width={18} height={18} />

                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Resume */}
            <div className="menu-item mt-2">
              <ResumeButton
                mobile
                loading={loading}
                onClick={prepareResumePopup}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================
          FULL-WIDTH DEVELOPER IDENTITY BAR
          - hidden from first paint, GSAP slides it in/out
      ======================================================== */}

      <div
        ref={barRef}
        className="invisible fixed inset-x-0 top-0 z-[60] w-full opacity-0"
      >
        <div className="flex min-h-[44px] w-full items-center border-b border-accent/30 bg-background/95 pt-[env(safe-area-inset-top)] shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex w-full items-center gap-3 px-3 py-2 sm:px-6 lg:px-10">
            {/* Left Content (min-w-0 lets text shrink/truncate) */}
            <div className="flex min-w-0 max-w-7xl flex-1 items-center justify-start">
              {/* Status Dot */}
              <span className="relative mr-3 flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>

              {/* Identity:
                  mobile -> name on top, role below (truncates)
                  sm+    -> single line: name • role */}
              <div className="flex min-w-0 flex-col leading-tight sm:flex-row sm:items-center">
                <span className="whitespace-nowrap text-sm font-semibold text-accent">
                  Vimal PK
                </span>

                <span className="mx-2 hidden text-muted-foreground sm:inline">
                  •
                </span>

                <span className="mt-0.5 block truncate text-[11px] text-foreground/80 sm:mt-0 sm:text-sm">
                  AI-Based Passionate Full-Stack Developer
                </span>
              </div>

              {/* DESKTOP ONLY CONTACT DETAILS */}
              <div className="ml-8 hidden flex-shrink-0 items-center gap-5 lg:flex">
                {/* Email */}
                <a
                  href="mailto:vimalpk.official@gmail.com"
                  className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-accent"
                >
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  vimalpk.official@gmail.com
                </a>

                {/* Phone */}
                <a
                  href="tel:8838865435"
                  className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-accent"
                >
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.5 4.5A2 2 0 014.5 2.5h2.2a2 2 0 011.94 1.5l.7 2.8a2 2 0 01-.57 1.88L7.4 9.55a16 16 0 007.05 7.05l.87-1.37a2 2 0 011.88-.57l2.8.7a2 2 0 011.5 1.94v2.2a2 2 0 01-2 2A17 17 0 012.5 4.5z"
                    />
                  </svg>
                  8838865435
                </a>
              </div>
            </div>

            {/* CLOSE BUTTON (always visible, never squeezed) */}
            <button
              type="button"
              onClick={() => {
                barDismissed.current = true;
                setShowDeveloperBar(false);
              }}
              aria-label="Close developer bar"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          SINGLE RESUME DIALOG
      ======================================================== */}

      <DialogContent className="sm:max-w-md">
        <DialogTitle>Get My Resume</DialogTitle>

        <DialogDescription>
          Enter your email to receive the resume.
        </DialogDescription>

        <div className="mt-4 space-y-3">
          {/* Email Input */}
          <input
            autoComplete="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                sendResume();
              }
            }}
            className="w-full rounded-md border border-border bg-background p-2.5 text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          />

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Send Resume */}
          <button
            type="button"
            onClick={sendResume}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Spinner />}

            {loading ? "Sending..." : "Send Resume"}
          </button>
        </div>
      </DialogContent>

      {/* ========================================================
          TOAST
      ======================================================== */}

      <Toast open={openToast} onOpenChange={setOpenToast}>
        <ToastDescription>{toastMessage}</ToastDescription>
      </Toast>
    </Dialog>
  );
}
