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

      // Get the parent container (the div with relative positioning)
      const parentContainer = noBtn.parentElement;
      if (!parentContainer) return;

      // Get bounds
      const parentRect = parentContainer.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate movement area - allow button to move around more freely
      // Use viewport or container bounds for dramatic movement
      const padding = 30;
      const movementRangeX = 400; // horizontal movement range
      const movementRangeY = 300; // vertical movement range

      // Generate random offset from current position
      const offsetX = (Math.random() - 0.5) * movementRangeX;
      const offsetY = (Math.random() - 0.5) * movementRangeY;

      // Get current position
      const currentX = gsap.getProperty(noBtn, "x") || 0;
      const currentY = gsap.getProperty(noBtn, "y") || 0;

      // Calculate new position
      const targetX = currentX + offsetX;
      const targetY = currentY + offsetY;

      // Add some rotation and scale for more playful effect
      const rotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees
      const scale = 0.9 + Math.random() * 0.2; // 0.9 to 1.1

      gsap.to(noBtn, {
        x: targetX,
        y: targetY,
        rotation: rotation,
        scale: scale,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    // When hovering, make the button wander around continuously
    let wanderInterval = null;
    function startWandering() {
      // run immediate move
      moveNoButton();
      // then repeat while hovered - faster movement
      if (wanderInterval) clearInterval(wanderInterval);
      wanderInterval = setInterval(() => moveNoButton(), 300);
    }
    function stopWandering() {
      if (wanderInterval) {
        clearInterval(wanderInterval);
        wanderInterval = null;
      }
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

    // for desktop pointer events
    noBtn.addEventListener("mouseenter", handleEnter);
    noBtn.addEventListener("mouseleave", handleLeave);
    // for touch devices: when user touches the button start wandering and stop after short delay
    const touchHandler = (e) => {
      e.preventDefault();
      startWandering();
      setTimeout(stopWandering, 800);
    };
    noBtn.addEventListener("touchstart", touchHandler, { passive: false });

    return () => {
      stopWandering();
      noBtn.removeEventListener("mouseenter", handleEnter);
      noBtn.removeEventListener("mouseleave", handleLeave);
      noBtn.removeEventListener("touchstart", touchHandler);
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

    // animate form into presence
    requestAnimationFrame(() => {
      if (!formRef.current) return;
      gsap.fromTo(
        formRef.current,
        { y: 40, autoAlpha: 0, scale: 0.98 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" }
      );
      // micro animation for fields
      gsap.from(".form-field", {
        y: 18,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.1,
      });
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-neutral-900 to-black p-8"
    >
      <div className="relative w-full max-w-4xl">
        {/* Background hero glass card */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            ref={bgGradientRef}
            className="absolute left-1/4 top-10 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform rotate-12"
          ></div>
        </div>

        <div
          ref={mainCardRef}
          className="backdrop-blur-sm bg-white/4 border border-white/6 rounded-3xl p-12 md:p-16 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <h1 className="hero-title text-4xl md:text-5xl font-extrabold leading-tight text-white font-hbue">
                Ready to build something exceptional?
              </h1>
              <p
                ref={subtitleRef}
                className="mt-4 text-lg text-gray-300 max-w-xl font-founders tracking-wide"
              >
                Join our studio — we design elegant products with measurable
                outcomes. Tell us a little about you and we'll reach out.
              </p>

              <div className="mt-8 cta-row flex gap-4 items-center">
                <button
                  ref={yesBtnRef}
                  onClick={handleYesClick}
                  className="yes-btn relative z-10 inline-flex items-center gap-3 rounded-full px-6 py-3 bg-white text-gray-900 font-semibold shadow-lg hover:scale-1.02 focus:outline-none focus:ring-4 ring-white/20 transition-transform"
                >
                  Yes, let's talk
                </button>

                <div className="relative inline-block w-40 h-12 overflow-visible">
                  {/* No button is positioned absolutely and moved by GSAP (transform translate). */}
                  <button
                    ref={noBtnRef}
                    onClick={(e) => e.preventDefault()}
                    className="no-btn absolute left-0 top-0 inline-flex items-center justify-center w-full h-full rounded-full border border-white/10 text-white text-sm font-medium bg-transparent backdrop-blur-sm hover:cursor-pointer shadow-md z-20"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: animated form appears here */}
            <div className="flex-1 flex items-center justify-center">
              <div
                ref={formRef}
                className={`w-full max-w-md transition-all ${
                  formVisible ? "" : "opacity-0 pointer-events-none"
                } `}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 bg-white/6 border border-white/6 p-6 rounded-2xl shadow-xl"
                >
                  <div className="form-field">
                    <label className="block text-sm text-gray-200">Name</label>
                    <input
                      name="name"
                      required
                      className="mt-1 w-full rounded-lg px-4 py-3 bg-white/5 border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="form-field">
                    <label className="block text-sm text-gray-200">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full rounded-lg px-4 py-3 bg-white/5 border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="form-field">
                    <label className="block text-sm text-gray-200">Phone</label>
                    <input
                      name="phone"
                      inputMode="tel"
                      className="mt-1 w-full rounded-lg px-4 py-3 bg-white/5 border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="form-field">
                    <button
                      type="submit"
                      className="submit-btn w-full rounded-full py-3 font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* subtle footer */}
          <div className="mt-8 text-xs text-gray-400">
            No spam. We respect your privacy.
          </div>
        </div>
      </div>

      {/* Small styles to improve feel (Tailwind used heavily) */}
      <style>{`
        /* Slight glass card highlight */
        .backdrop-blur-sm { backdrop-filter: blur(8px); }
        .no-btn { transition: transform 120ms linear; }
        .yes-btn:active { transform: translateY(1px); }
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
