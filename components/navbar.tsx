"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Spinner } from "@/components/ui/spinner";

import { Toast, ToastDescription } from "@/components/ui/toast";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  // Main floating navbar visibility
  const [isVisible, setIsVisible] = useState(true);

  // Full-width developer bar
  const [showDeveloperBar, setShowDeveloperBar] = useState(false);
  const [developerBarDismissed, setDeveloperBarDismissed] = useState(false);

  // Resume states
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Visitor/location data collected before opening the resume popup
  const [visitorData, setVisitorData] = useState<{
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
    timestamp?: number;
  }>({});

  // Toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ============================================================
  // HIDE NAVBAR ON SCROLL DOWN
  // SHOW NAVBAR ON SCROLL UP
  // ============================================================

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show main navbar at very top
      if (currentScrollY <= 20) {
        setIsVisible(true);
        setShowDeveloperBar(false);
        setDeveloperBarDismissed(false);

        lastScrollY = currentScrollY;
        return;
      }

      // --------------------------------------------------------
      // SCROLLING DOWN
      // --------------------------------------------------------

      if (currentScrollY > lastScrollY + 3) {
        setIsVisible(false);
        setIsOpen(false);

        if (!developerBarDismissed) {
          setShowDeveloperBar(true);
        }
      }

      // --------------------------------------------------------
      // SCROLLING UP
      // --------------------------------------------------------

      else if (currentScrollY < lastScrollY - 3) {
        setIsVisible(true);
        setShowDeveloperBar(false);
        setDeveloperBarDismissed(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [developerBarDismissed]);

  // ============================================================
  // NAVIGATION ITEMS
  // ============================================================

  const menuItems = [
    {
      id: "home",
      label: "Home",
    },
    {
      id: "services",
      label: "Experience",
      center: true,
    },
    {
      id: "portfolio",
      label: "About",
    },
    {
      id: "contact",
      label: "Contact",
    },
  ];

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    scrollToCenter?: boolean,
  ) => {
    e.preventDefault();

    setActive(id);
    setIsOpen(false);

    const element = document.getElementById(id);

    if (!element) return;

    if (scrollToCenter) {
      const elementRect = element.getBoundingClientRect();

      const elementTop = window.scrollY + elementRect.top;

      const elementHeight = elementRect.height;

      const viewportHeight = window.innerHeight;

      const scrollPosition =
        elementTop - (viewportHeight - elementHeight) / 2;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    } else {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ============================================================
  // EXTERNAL LINKS
  // ============================================================

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      // Attach the email entered in the popup to the visitor record.
      await fetch("/api/getdata", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

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

          timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone,

          language: navigator.language,

          languages:
            navigator.languages?.join(", ") ||
            navigator.language,

          platform: navigator.platform,

          userAgent: navigator.userAgent,

          referrer: document.referrer,

          currentUrl: window.location.href,

          event: "resume_download_request",
        }),
      });

      // --------------------------------------------------------
      // SEND RESUME EMAIL
      // --------------------------------------------------------

      const res = await fetch("/api/send-resume", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      if (res.ok) {
        setToastMessage(
          "Resume sent successfully. Check your email.",
        );

        setOpenToast(true);

        setEmail("");
        setError("");

        setVisitorData({});

        setDialogOpen(false);
      } else {
        setToastMessage("Failed to send email.");

        setOpenToast(true);
      }
    } catch (error) {
      console.error("Resume sending error:", error);

      setToastMessage(
        "Something went wrong. Please try again.",
      );

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

    // ----------------------------------------------------------
    // Browser / Device Metadata
    // ----------------------------------------------------------

    const baseData = {
      email: "",

      screenWidth: window.screen.width,

      screenHeight: window.screen.height,

      colorDepth: window.screen.colorDepth,

      pixelRatio: window.devicePixelRatio,

      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone,

      language: navigator.language,

      languages:
        navigator.languages?.join(", ") ||
        navigator.language,

      platform: navigator.platform,

      userAgent: navigator.userAgent,

      referrer: document.referrer,

      currentUrl: window.location.href,

      event: "resume_popup_clicked",
    };

    // ----------------------------------------------------------
    // SEND DATA TO /api/getdata
    // ----------------------------------------------------------

    const sendVisitorData = async (
      locationData: Record<string, unknown> = {},
    ) => {
      try {
        await fetch("/api/getdata", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...baseData,
            ...locationData,
          }),
        });
      } catch (error) {
        // Visitor logging must not stop the resume popup.
        console.error("Visitor data error:", error);
      }
    };

    try {
      // --------------------------------------------------------
      // GET EXACT BROWSER LOCATION
      // --------------------------------------------------------

      if ("geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const locationData = {
                latitude: position.coords.latitude,

                longitude: position.coords.longitude,

                accuracy: position.coords.accuracy,

                altitude: position.coords.altitude,

                altitudeAccuracy:
                  position.coords.altitudeAccuracy,

                heading: position.coords.heading,

                speed: position.coords.speed,

                timestamp: position.timestamp,
              };

              // Save location for the next request when
              // the visitor enters their email.
              setVisitorData(locationData);

              // First call happens BEFORE popup opens.
              await sendVisitorData(locationData);

              resolve();
            },

            async (error) => {
              console.warn(
                "Location permission unavailable:",
                error.message,
              );

              // If location is denied/unavailable,
              // still send the other metadata.
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
        // Browser has no geolocation support.
        await sendVisitorData();
      }
    } catch (error) {
      console.error(
        "Resume visitor tracking error:",
        error,
      );
    } finally {
      setLoading(false);

      // --------------------------------------------------------
      // IMPORTANT:
      //
      // Popup opens ONLY AFTER /api/getdata was attempted.
      // --------------------------------------------------------

      setDialogOpen(true);
    }
  };

  // ============================================================
  // RESUME TRIGGER
  // ============================================================

  const ResumeTrigger = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => {
    return (
      <button
        type="button"
        onClick={prepareResumePopup}
        disabled={loading}
        className={
          mobile
            ? `
                w-full
                h-11

                flex
                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-accent/40

                bg-accent/10
                text-accent

                hover:bg-accent
                hover:text-accent-foreground

                transition-all
                duration-200

                disabled:opacity-60
                disabled:cursor-not-allowed
              `
            : `
                group

                flex
                items-center
                gap-2

                h-10
                px-3

                rounded-xl

                border
                border-accent/40

                bg-accent/10
                text-accent

                hover:bg-accent
                hover:text-accent-foreground

                transition-all
                duration-200

                disabled:opacity-60
                disabled:cursor-not-allowed
              `
        }
      >
        {loading ? (
          <Spinner />
        ) : (
          <svg
            className="w-[18px] h-[18px]"
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
          {loading
            ? "Preparing..."
            : "Download Resume"}
        </span>
      </button>
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);

        // IMPORTANT:
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
      ====================================================== */}

      <nav
        className={`
          fixed

          top-3

          left-1/2

          -translate-x-1/2

          w-[calc(100%-2rem)]

          max-w-5xl

          z-50

          transition-all

          duration-300

          ease-in-out

          ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-[150%] opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="relative">

          {/* Outer Glow */}

          <div
            className="
              absolute
              -inset-[1px]

              rounded-[22px]

              bg-accent/10

              blur-sm
            "
          />

          {/* Main Navbar */}

          <div
            className="
              relative

              flex

              items-center

              h-[68px]

              px-2

              sm:px-4

              rounded-[22px]

              border

              border-accent/30

              bg-background/85

              backdrop-blur-2xl

              shadow-[0_8px_40px_rgba(0,0,0,0.18)]
            "
          >

            {/* ==================================================
                LOGO
            ================================================== */}

            <Link
              href="#home"
              onClick={(e) =>
                handleScroll(e, "home")
              }
              className="
                group

                flex
                items-center
                justify-center

                w-11
                h-11

                rounded-[15px]

                bg-accent

                text-background

                font-bold

                text-xl

                shadow-lg

                transition-all

                duration-200

                hover:scale-105

                flex-shrink-0
              "
            >
              V
            </Link>

            {/* Divider */}

            <div
              className="
                hidden
                md:block

                h-8

                w-px

                bg-border/70

                mx-4
              "
            />

            {/* ==================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <div
              className="
                hidden
                md:flex

                items-center

                gap-1

                flex-1
              "
            >
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) =>
                    handleScroll(
                      e,
                      item.id,
                      item.center,
                    )
                  }
                  className={`
                    relative

                    px-4

                    py-2.5

                    rounded-xl

                    text-sm

                    font-medium

                    transition-all

                    duration-200

                    ${
                      active === item.id
                        ? `
                            bg-accent/10

                            text-accent
                          `
                        : `
                            text-foreground/65

                            hover:text-foreground

                            hover:bg-foreground/5
                          `
                    }
                  `}
                >
                  {item.label}

                  {active === item.id && (
                    <span
                      className="
                        absolute

                        bottom-1

                        left-1/2

                        -translate-x-1/2

                        w-1

                        h-1

                        rounded-full

                        bg-accent
                      "
                    />
                  )}
                </a>
              ))}
            </div>

            {/* ==================================================
                DESKTOP ACTIONS
            ================================================== */}

            <div
              className="
                hidden
                md:flex

                items-center

                gap-2
              "
            >

              {/* GitHub */}

              <button
                type="button"
                onClick={() =>
                  openExternal(
                    "https://github.com/vimalofficial",
                  )
                }
                className="
                  group

                  flex

                  items-center

                  gap-2

                  h-10

                  px-3

                  rounded-xl

                  border

                  border-border/80

                  bg-background/40

                  hover:border-accent/40

                  hover:bg-accent/5

                  transition-all
                "
              >
                <Image
                  src="/github.png"
                  alt="GitHub"
                  width={18}
                  height={18}
                  className="
                    object-contain

                    transition-transform

                    group-hover:scale-110
                  "
                />

                <span className="text-sm font-medium">
                  GitHub
                </span>
              </button>

              {/* LinkedIn */}

              <button
                type="button"
                onClick={() =>
                  openExternal(
                    "https://www.linkedin.com/in/vimal-pk-b140a3285/",
                  )
                }
                className="
                  group

                  flex

                  items-center

                  gap-2

                  h-10

                  px-3

                  rounded-xl

                  border

                  border-border/80

                  bg-background/40

                  hover:border-accent/40

                  hover:bg-accent/5

                  transition-all
                "
              >
                <Image
                  src="/download.png"
                  alt="LinkedIn"
                  width={18}
                  height={18}
                  className="
                    object-contain

                    transition-transform

                    group-hover:scale-110
                  "
                />

                <span className="text-sm font-medium">
                  LinkedIn
                </span>
              </button>

              {/* Resume */}

              <ResumeTrigger />

            </div>

            {/* ==================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setIsOpen(!isOpen)
              }
              className="
                md:hidden

                ml-auto

                flex

                items-center

                justify-center

                w-11

                h-11

                rounded-[14px]

                border

                border-border/70

                hover:border-accent/40

                hover:bg-accent/5

                transition-all
              "
              aria-label="Toggle navigation"
            >
              <svg
                className="w-5 h-5"
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
          ================================================== */}

          {isOpen && (
            <div
              className="
                absolute

                top-[78px]

                left-0
                right-0

                rounded-[22px]

                border

                border-accent/30

                bg-background/95

                backdrop-blur-2xl

                shadow-[0_12px_40px_rgba(0,0,0,0.2)]

                p-3

                md:hidden
              "
            >

              {/* Navigation */}

              <div
                className="
                  flex
                  flex-col

                  gap-1
                "
              >
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) =>
                      handleScroll(
                        e,
                        item.id,
                        item.center,
                      )
                    }
                    className={`
                      flex

                      items-center

                      px-4

                      py-3

                      rounded-xl

                      text-sm

                      font-medium

                      transition-all

                      ${
                        active === item.id
                          ? `
                              bg-accent/10

                              text-accent
                            `
                          : `
                              text-foreground/70

                              hover:text-foreground

                              hover:bg-foreground/5
                            `
                      }
                    `}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Divider */}

              <div
                className="
                  h-px

                  bg-border/60

                  my-3
                "
              />

              {/* Social Buttons */}

              <div
                className="
                  grid

                  grid-cols-2

                  gap-2
                "
              >

                {/* GitHub */}

                <button
                  type="button"
                  onClick={() =>
                    openExternal(
                      "https://github.com/vimalofficial",
                    )
                  }
                  className="
                    flex

                    items-center

                    justify-center

                    gap-2

                    h-11

                    rounded-xl

                    border

                    border-border/70

                    hover:border-accent/40

                    hover:bg-accent/5

                    transition-all
                  "
                >
                  <Image
                    src="/github.png"
                    alt="GitHub"
                    width={18}
                    height={18}
                  />

                  <span className="text-sm font-medium">
                    GitHub
                  </span>
                </button>

                {/* LinkedIn */}

                <button
                  type="button"
                  onClick={() =>
                    openExternal(
                      "https://www.linkedin.com/in/vimal-pk-b140a3285/",
                    )
                  }
                  className="
                    flex

                    items-center

                    justify-center

                    gap-2

                    h-11

                    rounded-xl

                    border

                    border-border/70

                    hover:border-accent/40

                    hover:bg-accent/5

                    transition-all
                  "
                >
                  <Image
                    src="/download.png"
                    alt="LinkedIn"
                    width={18}
                    height={18}
                  />

                  <span className="text-sm font-medium">
                    LinkedIn
                  </span>
                </button>

              </div>

              {/* Mobile Resume */}

              <div className="mt-2">
                <ResumeTrigger mobile />
              </div>

            </div>
          )}

        </div>
      </nav>

      {/* ========================================================
          FULL-WIDTH DEVELOPER IDENTITY BAR  (MOBILE FIXED)
      ======================================================== */}

      <div
        className={`
          fixed

          top-0

          left-0

          right-0

          w-full

          z-[60]

          transition-all

          duration-300

          ease-out

          ${
            showDeveloperBar &&
            !isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }
        `}
      >
        <div
          className="
            w-full

            min-h-[44px]

            flex

            items-center

            border-b

            border-accent/30

            bg-background/95

            backdrop-blur-2xl

            shadow-[0_8px_30px_rgba(0,0,0,0.15)]

            pt-[env(safe-area-inset-top)]
          "
        >

          <div
            className="
              w-full

              flex

              items-center

              gap-3

              px-3

              sm:px-6

              lg:px-10

              py-2
            "
          >

            {/* Left Content (min-w-0 lets text shrink/truncate) */}

            <div
              className="
                flex

                items-center

                min-w-0

                flex-1

                justify-start

                max-w-7xl
              "
            >

              {/* Status Dot */}

              <span
                className="
                  relative

                  flex

                  w-2

                  h-2

                  mr-3

                  flex-shrink-0
                "
              >
                <span
                  className="
                    absolute

                    inline-flex

                    w-full

                    h-full

                    rounded-full

                    bg-accent

                    opacity-60

                    animate-ping
                  "
                />

                <span
                  className="
                    relative

                    inline-flex

                    w-2

                    h-2

                    rounded-full

                    bg-accent
                  "
                />
              </span>

              {/* Identity:
                  mobile  -> name on top, role below (truncates if too narrow)
                  sm+     -> single line: name • role */}

              <div
                className="
                  flex

                  flex-col

                  sm:flex-row

                  sm:items-center

                  min-w-0

                  leading-tight
                "
              >
                <span
                  className="
                    text-sm

                    font-semibold

                    text-accent

                    whitespace-nowrap
                  "
                >
                  Vimal PK
                </span>

                <span
                  className="
                    hidden

                    sm:inline

                    text-muted-foreground

                    mx-2
                  "
                >
                  •
                </span>

                <span
                  className="
                    block

                    mt-0.5

                    sm:mt-0

                    text-[11px]

                    sm:text-sm

                    text-foreground/80

                    truncate
                  "
                >
                  AI-Based Passionate Full-Stack Developer
                </span>
              </div>

              {/* =================================================
                  DESKTOP ONLY CONTACT DETAILS
              ================================================= */}

              <div
                className="
                  hidden

                  lg:flex

                  items-center

                  ml-8

                  gap-5

                  flex-shrink-0
                "
              >

                {/* Email */}

                <a
                  href="mailto:vimalpk.official@gmail.com"
                  className="
                    flex

                    items-center

                    gap-2

                    text-xs

                    text-muted-foreground

                    hover:text-accent

                    transition-colors
                  "
                >
                  <svg
                    className="w-4 h-4 text-accent"
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
                  className="
                    flex

                    items-center

                    gap-2

                    text-xs

                    text-muted-foreground

                    hover:text-accent

                    transition-colors
                  "
                >
                  <svg
                    className="w-4 h-4 text-accent"
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

            {/* =================================================
                CLOSE BUTTON (always visible, never squeezed)
            ================================================= */}

            <button
              type="button"
              onClick={() => {
                setDeveloperBarDismissed(true);
                setShowDeveloperBar(false);
              }}
              aria-label="Close developer bar"
              className="
                flex

                items-center

                justify-center

                w-8

                h-8

                rounded-lg

                border

                border-border/60

                text-muted-foreground

                hover:text-foreground

                hover:border-accent/40

                hover:bg-accent/5

                transition-all

                flex-shrink-0
              "
            >
              <svg
                className="w-4 h-4"
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

        <DialogTitle>
          Get My Resume
        </DialogTitle>

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

              if (error) {
                setError("");
              }
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !loading
              ) {
                e.preventDefault();

                sendResume();
              }
            }}
            className="
              w-full

              border

              border-border

              rounded-md

              p-2.5

              bg-background

              text-foreground

              outline-none

              focus:border-accent

              focus:ring-1

              focus:ring-accent

              transition-all
            "
          />

          {/* Error */}

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Send Resume */}

          <button
            type="button"
            onClick={sendResume}
            disabled={loading}
            className="
              flex

              items-center

              justify-center

              gap-2

              w-full

              bg-accent

              text-accent-foreground

              px-4

              py-2.5

              rounded-md

              font-medium

              hover:opacity-90

              disabled:opacity-60

              disabled:cursor-not-allowed

              transition-all
            "
          >
            {loading && <Spinner />}

            {loading
              ? "Sending..."
              : "Send Resume"}
          </button>

        </div>
      </DialogContent>

      {/* ========================================================
          TOAST
      ======================================================== */}

      <Toast
        open={openToast}
        onOpenChange={setOpenToast}
      >
        <ToastDescription>
          {toastMessage}
        </ToastDescription>
      </Toast>

    </Dialog>
  );
}