"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // ---------------------------------------
  // Hide navbar on scroll down
  // Show navbar on scroll up
  // ---------------------------------------
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar near the top
      if (currentScrollY <= 20) {
        setIsVisible(true);
      }
      // Scrolling down
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setIsOpen(false);
      }
      // Scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ---------------------------------------
  // Navigation items
  // ---------------------------------------
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

  // ---------------------------------------
  // Smooth scroll
  // ---------------------------------------
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    scrollToCenter?: boolean
  ) => {
    e.preventDefault();

    setActive(id);
    setIsOpen(false);

    const element = document.getElementById(id);

    if (!element) return;

    if (scrollToCenter) {
      const elementRect = element.getBoundingClientRect();
      const elementTop =
        window.scrollY + elementRect.top;

      const elementHeight = elementRect.height;
      const viewportHeight = window.innerHeight;

      const scrollPosition =
        elementTop -
        (viewportHeight - elementHeight) / 2;

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

  // ---------------------------------------
  // External links
  // ---------------------------------------
  const openExternal = (url: string) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <nav
      className={`
        fixed
        top-2
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

        {/* =====================================
            OUTER GLOW
        ====================================== */}
        <div
          className="
            absolute
            -inset-[1px]
            rounded-[22px]
            bg-accent/10
            blur-sm
          "
        />

        {/* =====================================
            MAIN NAVBAR
        ====================================== */}
        <div
          className="
            relative
            flex
            items-center
            h-[68px]
            px-0
            sm:px-4

            rounded-[22px]

            border
            border-accent/30

            bg-background/85
            backdrop-blur-2xl

            shadow-[0_8px_40px_rgba(0,0,0,0.18)]
          "
        >

          {/* =================================
              LOGO
          ================================= */}
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
              hover:shadow-accent/30

              flex-shrink-0
            "
          >
            V
          </Link>

          {/* =================================
              DIVIDER
          ================================= */}
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

          {/* =================================
              DESKTOP NAVIGATION
          ================================= */}
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
                    item.center
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

              </a>
            ))}
          </div>

          {/* =================================
              SOCIAL BUTTONS
          ================================= */}
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
              onClick={() =>
                openExternal(
                  "https://github.com/vimalofficial"
                )
              }
              aria-label="GitHub"
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
                duration-200
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

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                GitHub
              </span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() =>
                openExternal(
                  "https://www.linkedin.com/in/vimal-pk-b140a3285/"
                )
              }
              aria-label="LinkedIn"
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
                duration-200
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

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                LinkedIn
              </span>
            </button>
          </div>

          {/* =================================
              MOBILE MENU BUTTON
          ================================= */}
          <button
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

        {/* =====================================
            MOBILE DROPDOWN
        ====================================== */}
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

            {/* Mobile Navigation */}
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
                      item.center
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

            {/* Mobile Social */}
            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >

              {/* GitHub */}
              <button
                onClick={() =>
                  openExternal(
                    "https://github.com/vimalofficial"
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

                <span
                  className="
                    text-sm
                    font-medium
                  "
                >
                  GitHub
                </span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() =>
                  openExternal(
                    "https://www.linkedin.com/in/vimal-pk-b140a3285/"
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

                <span
                  className="
                    text-sm
                    font-medium
                  "
                >
                  LinkedIn
                </span>
              </button>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
