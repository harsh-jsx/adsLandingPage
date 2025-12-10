// AwwwardsLanding.jsx
// React component (single-file) — Tailwind CSS assumed available in project.
// Requires: npm i gsap

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export default function App() {
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);
  const formRef = useRef(null);
  const bgGradientRef = useRef(null);
  const mainCardRef = useRef(null);
  const subtitleRef = useRef(null);
  const footerRef = useRef(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    // Awwwards-level orchestrated entrance animation timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate background gradient first (subtle fade and scale)
      tl.from(bgGradientRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      })
        // Animate main card container (slide up with scale)
        .from(
          mainCardRef.current,
          {
            y: 80,
            opacity: 0,
            scale: 0.92,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.8"
        )
        // Animate hero title (slide up with fade)
        .from(
          ".hero-title",
          {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        )
        // Animate subtitle/description
        .from(
          subtitleRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.7"
        )
        // Animate buttons with stagger and bounce
        .from(
          ".cta-row > *",
          {
            y: 30,
            opacity: 0,
            scale: 0.85,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        )
        // Animate footer text (subtle fade)
        .from(
          footerRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // Add subtle continuous animation to background gradient
      gsap.to(bgGradientRef.current, {
        x: "+=20",
        y: "+=15",
        rotation: "+=3",
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    // keep the No button interactive: when mouse enters, jump to new random location
    const noBtn = noBtnRef.current;
    const container = containerRef.current;

    function moveNoButton() {
      if (!container || !noBtn) return;

      // Get current position
      const currentX = gsap.getProperty(noBtn, "x") || 0;
      const currentY = gsap.getProperty(noBtn, "y") || 0;

      // Move left or right by 250px (randomly choose direction)
      const directionX = Math.random() < 0.5 ? -1 : 1;
      const targetX = currentX + directionX * 250;

      // Move up or down by 200px (randomly choose direction)
      const directionY = Math.random() < 0.5 ? -1 : 1;
      const targetY = currentY + directionY * 200;

      // Get bounds to constrain movement
      const parentContainer = noBtn.parentElement;
      if (!parentContainer) return;

      const parentRect = parentContainer.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 25;

      // Constrain to viewport bounds
      const minX = -parentRect.left + padding;
      const maxX = viewportWidth - parentRect.right - padding;
      const constrainedX = Math.max(minX, Math.min(maxX, targetX));

      const minY = -parentRect.top + padding;
      const maxY = viewportHeight - parentRect.bottom - padding;
      const constrainedY = Math.max(minY, Math.min(maxY, targetY));

      // Animate the movement
      gsap.to(noBtn, {
        x: constrainedX,
        y: constrainedY,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // When hovering, make the button move left/right
    let isWandering = false;

    function startWandering() {
      if (isWandering) return;
      isWandering = true;

      // Move once when hovered/clicked
      moveNoButton();
    }

    function stopWandering() {
      isWandering = false;
      // Reset rotation and scale when not hovering
      if (noBtn) {
        gsap.to(noBtn, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    function handleEnter() {
      startWandering();
    }

    function handleLeave() {
      stopWandering();
    }

    // Enhanced touch handler for mobile devices
    let touchStartTime = 0;
    let touchMoved = false;

    const touchStartHandler = (e) => {
      touchStartTime = Date.now();
      touchMoved = false;
      e.preventDefault();
      startWandering();
    };

    const touchMoveHandler = (e) => {
      touchMoved = true;
    };

    const touchEndHandler = (e) => {
      const touchDuration = Date.now() - touchStartTime;
      // If it was a quick tap and didn't move much, stop wandering quickly
      // Otherwise, let it wander for a bit longer
      const delay = touchMoved || touchDuration > 300 ? 1200 : 600;
      setTimeout(() => {
        stopWandering();
      }, delay);
    };

    // for desktop pointer events
    noBtn.addEventListener("mouseenter", handleEnter);
    noBtn.addEventListener("mouseleave", handleLeave);
    noBtn.addEventListener("click", moveNoButton);

    // Enhanced touch handling for mobile devices
    noBtn.addEventListener("touchstart", touchStartHandler, { passive: false });
    noBtn.addEventListener("touchmove", touchMoveHandler, { passive: true });
    noBtn.addEventListener("touchend", touchEndHandler, { passive: true });
    noBtn.addEventListener("touchcancel", stopWandering, { passive: true });

    return () => {
      stopWandering();
      noBtn.removeEventListener("mouseenter", handleEnter);
      noBtn.removeEventListener("mouseleave", handleLeave);
      noBtn.removeEventListener("click", moveNoButton);
      noBtn.removeEventListener("touchstart", touchStartHandler);
      noBtn.removeEventListener("touchmove", touchMoveHandler);
      noBtn.removeEventListener("touchend", touchEndHandler);
      noBtn.removeEventListener("touchcancel", stopWandering);
      ctx.revert();
    };
  }, []);

  function handleYesClick() {
    if (formVisible) return;
    setFormVisible(true);

    // hide the No button gracefully
    const noBtn = noBtnRef.current;
    if (noBtn) {
      gsap.to(noBtn, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.35,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }

    // Animate form into presence with sophisticated timeline
    requestAnimationFrame(() => {
      if (!formRef.current) return;
      const formTl = gsap.timeline();

      formTl
        .fromTo(
          formRef.current,
          { y: 50, autoAlpha: 0, scale: 0.95, rotationX: -10 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            ease: "expo.out",
          }
        )
        // Animate form fields with stagger
        .from(
          ".form-field",
          {
            y: 25,
            autoAlpha: 0,
            scale: 0.96,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4"
        );
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
    };
    // micro submit animation
    gsap.to(formRef.current, {
      autoAlpha: 0.9,
      scale: 0.995,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
    });
    // In a real app: send data to API here.
    console.log("submit", data);
    // show subtle success
    gsap.to(formRef.current.querySelector(".submit-btn"), {
      scale: 0.96,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
    });
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-neutral-900 to-black p-3 xs:p-4 sm:p-6 md:p-8 overflow-x-hidden"
    >
      <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-0">
        {/* Background hero glass card */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            ref={bgGradientRef}
            className="absolute left-1/4 top-10 w-[400px] h-[400px] xs:w-[500px] xs:h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] rounded-full opacity-10 blur-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform rotate-12"
          ></div>
        </div>

        <div
          ref={mainCardRef}
          className="backdrop-blur-sm bg-white/4 border border-white/6 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl w-full"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
            <div className="flex-1 min-w-0">
              <h1 className="hero-title text-6xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-5xl font-extrabold leading-[1.1] text-white font-hbue break-words">
                Ready to build something exceptional?
              </h1>
              <p
                ref={subtitleRef}
                className="mt-3 xs:mt-4 text-lg xs:text-base sm:text-lg text-gray-300 max-w-xl font-founders tracking-wide leading-relaxed"
              >
                Join our studio — we design elegant products with measurable
                outcomes. Tell us a little about you and we'll reach out.
              </p>

              <div className="mt-5 xs:mt-6 sm:mt-8 cta-row flex flex-row items-center gap-2">
                <button
                  ref={yesBtnRef}
                  onClick={handleYesClick}
                  className="yes-btn relative z-10 flex items-center justify-center rounded-full w-32 sm:w-36 h-10 xs:h-11 text-xs xs:text-sm sm:text-sm bg-white text-gray-900 font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 ring-white/20 transition-transform whitespace-nowrap flex-shrink-0"
                >
                  Yes, let's talk
                </button>

                {/* Keep No button in normal flow; GSAP uses translate so layout stays aligned */}
                <button
                  ref={noBtnRef}
                  onClick={(e) => e.preventDefault()}
                  className="no-btn relative flex items-center justify-center w-32 sm:w-36 h-10 xs:h-11 rounded-full border border-white/10 text-white text-xs xs:text-sm font-medium bg-transparent backdrop-blur-sm hover:cursor-pointer active:cursor-pointer shadow-md z-0 touch-manipulation flex-shrink-0"
                >
                  No
                </button>
              </div>
            </div>

            {/* Right column: animated form appears here */}
            <div className="flex-1 flex items-center justify-center mt-6 lg:mt-0 lg:pl-8">
              <div
                ref={formRef}
                className={`w-full max-w-md transition-all ${
                  formVisible ? "" : "opacity-0 pointer-events-none"
                } `}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 bg-white/6 border border-white/6 p-4 xs:p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl w-full"
                >
                  <div className="form-field">
                    <label className="block text-sm text-gray-200 mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full rounded-lg px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-base bg-white/5 border border-white/8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-field">
                    <label className="block text-sm text-gray-200 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-lg px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-base bg-white/5 border border-white/8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="form-field">
                    <label className="block text-sm text-gray-200 mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      className="w-full rounded-lg px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-base bg-white/5 border border-white/8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                      placeholder="(555) 000-0000"
                    />
                  </div>

                  <div className="form-field pt-1">
                    <button
                      type="submit"
                      className="submit-btn w-full rounded-full py-2.5 xs:py-3 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg active:scale-[0.98] transition-transform"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* subtle footer */}
          <div
            ref={footerRef}
            className="mt-5 xs:mt-6 sm:mt-8 text-xs text-gray-400 text-center sm:text-left"
          >
            No spam. We respect your privacy.
          </div>
        </div>
      </div>

      {/* Small styles to improve feel (Tailwind used heavily) */}
      <style>{`
        /* Slight glass card highlight */
        .backdrop-blur-sm { backdrop-filter: blur(8px); }
        .no-btn { 
          transition: transform 120ms linear;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .yes-btn:active { transform: translateY(1px); }
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-touch-callout: none;
        }
        input::placeholder {
          color: rgba(156, 163, 175, 0.5);
        }
        input:focus::placeholder {
          color: rgba(156, 163, 175, 0.3);
        }
        /* Improve form input appearance on mobile */
        @media (max-width: 640px) {
          input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
        /* Prevent horizontal overflow */
        * {
          max-width: 100%;
        }
        /* Better text wrapping */
        h1, p {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        /* Ensure buttons don't shrink too much */
        button {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

/*
Usage
- Ensure Tailwind CSS is configured in your project for the classes to work.
- Install GSAP: npm install gsap
- Paste this file in your React app and import <AwwwardsLanding /> into a route or App.jsx

Notes & customization ideas
- Tweak the Random movement algorithm for 'No' to make it more playful or more constrained for mobile.
- Replace console.log in handleSubmit with a real API call.
- Add accessibility improvements such as aria-live to the form reveal and keyboard-safe behavior for "No" button on focus.
*/
