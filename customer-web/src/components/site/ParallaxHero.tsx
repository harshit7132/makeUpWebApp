"use client";

import Link from "next/link";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { ArrowLeftRight, ArrowRight, Sparkles, Star, Wand2 } from "lucide-react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import AvailabilityChecker from "./AvailabilityChecker";
import FadeImg from "./FadeImg";
import { SITE_IMAGES } from "../../lib/site-images";

interface ParallaxHeroProps {
  beforeImage?: string;
  afterImage?: string;
}

export default function ParallaxHero({
  beforeImage = SITE_IMAGES.transformation.before,
  afterImage = SITE_IMAGES.transformation.after,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderFrameRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const afterLayerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Active view indicator for the pill buttons ('before' | 'split' | 'after')
  const [activeView, setActiveView] = useState<"before" | "split" | "after">("split");

  const isDraggingRef = useRef(false);
  const currentPosRef = useRef(50);

  // Apply slider position directly to DOM (Zero React re-renders = True 120 FPS buttery smooth)
  const applyPosition = useCallback((pos: number, animate = false) => {
    currentPosRef.current = pos;
    const divider = dividerRef.current;
    const afterLayer = afterLayerRef.current;

    if (divider && afterLayer) {
      if (animate) {
        divider.style.transition = "left 380ms cubic-bezier(0.16, 1, 0.3, 1)";
        afterLayer.style.transition = "clip-path 380ms cubic-bezier(0.16, 1, 0.3, 1)";
      } else {
        divider.style.transition = "none";
        afterLayer.style.transition = "none";
      }
      divider.style.left = `${pos}%`;
      afterLayer.style.clipPath = `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`;
    }
  }, []);

  // Update on mouse/touch drag
  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!sliderFrameRef.current) return;
      const rect = sliderFrameRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const rawPercent = (x / rect.width) * 100;
      const clamped = Math.max(0, Math.min(100, rawPercent));
      applyPosition(clamped, false);

      if (clamped < 15) setActiveView("before");
      else if (clamped > 85) setActiveView("after");
      else setActiveView("split");
    },
    [applyPosition]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    // CRITICAL: e.preventDefault() prevents browser native image drag and text selection ghosts
    e.preventDefault();
    isDraggingRef.current = true;
    handlePointerMove(e.clientX);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    handlePointerMove(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Optional mouse wheel / trackpad horizontal scroll support directly on the frame
  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 1) {
      const next = Math.max(0, Math.min(100, currentPosRef.current + delta * 0.12));
      applyPosition(next, false);
      if (next < 15) setActiveView("before");
      else if (next > 85) setActiveView("after");
      else setActiveView("split");
    }
  };

  // Button clicks animate smoothly to preset positions
  const setPresetView = (view: "before" | "split" | "after") => {
    setActiveView(view);
    if (view === "before") applyPosition(0, true);
    if (view === "split") applyPosition(50, true);
    if (view === "after") applyPosition(100, true);
  };

  // Scroll sync: smoothly glides the slider as user scrolls up or down the page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    // Initial 50% split setup
    applyPosition(50, false);

    if (prefersReduced) return;

    let rafId = 0;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Only pause scroll-sync if user is actively holding down the mouse to drag
      if (isDraggingRef.current) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // As you scroll down from top of page (0.0) through the hero (0.5)
        // the slider smoothly glides from 25% (mostly before) to 85% (full bridal after)
        const progress = Math.max(0, Math.min(1, latest / 0.5));
        const pos = 25 + progress * 60; // scrubs from 25% to 85% smoothly
        applyPosition(pos, false);

        if (pos < 20) setActiveView("before");
        else if (pos > 80) setActiveView("after");
        else setActiveView("split");
      });
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafId);
    };
  }, [applyPosition, prefersReduced, scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-plum-dark text-white min-h-[90vh] lg:min-h-screen flex items-center pt-24 pb-12 lg:pt-28 lg:pb-14 select-none"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_65%_at_15%_20%,rgba(212,175,55,0.16),transparent_60%),radial-gradient(65%_65%_at_90%_85%,rgba(91,51,71,0.6),transparent_70%)]"
      />

      <div className="container-page relative z-10 w-full">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3.5 py-1 text-xs text-gold-light backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>Bridal makeup · Jodhpur &amp; Rajasthan Destination</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.4rem] font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.2rem]">
              Bridal makeup that feels like{" "}
              <em className="font-medium text-gold-light">you</em>, on your biggest day.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Traditional Rajasthani bridal looks, long-wear HD and airbrush finishes, hair styling, and heirloom
              poshak draping — by Prachi and her studio team.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="btn-primary px-6 py-3 text-[14px] shadow-luxury transition-transform duration-300 hover:scale-[1.02]"
              >
                Book your date <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="btn-light px-6 py-3 text-[14px] transition-transform duration-300 hover:scale-[1.02]"
              >
                Services &amp; prices
              </Link>
            </div>

            {/* Availability Checker placed cleanly on the left column */}
            <div className="mt-8 max-w-md">
              <AvailabilityChecker className="border-gold/30 bg-white/95 text-plum shadow-2xl backdrop-blur-xl p-4 sm:p-5" />
            </div>
          </div>

          {/* ================= RIGHT COLUMN (FULL UNOBSTRUCTED BEFORE & AFTER) ================= */}
          <div className="relative flex flex-col items-center select-none">
            {/* Quick Pill Controls */}
            <div className="mb-3 flex w-full max-w-[420px] items-center justify-between px-1">
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold-light">
                <Wand2 className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span>Transformation:</span>
              </span>
              <div className="inline-flex rounded-full border border-gold/30 bg-plum/70 p-1 backdrop-blur-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setPresetView("before")}
                  className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
                    activeView === "before"
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Before
                </button>
                <button
                  type="button"
                  onClick={() => setPresetView("split")}
                  className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
                    activeView === "split"
                      ? "bg-gold text-plum-dark font-semibold shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Split 50/50
                </button>
                <button
                  type="button"
                  onClick={() => setPresetView("after")}
                  className={`rounded-full px-3 py-1 text-xs transition-all duration-200 ${
                    activeView === "after"
                      ? "bg-gold text-plum-dark font-semibold shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  After
                </button>
              </div>
            </div>

            {/* Arched Portrait Stage */}
            <div className="relative w-full max-w-[420px] select-none">
              {/* Outer Glow Ring */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full border border-gold/30 opacity-70"
              />

              {/* Exclusive Focus Tag */}
              <div className="absolute -top-3.5 -left-3.5 z-30 flex items-center gap-1.5 rounded-xl border border-gold/30 bg-plum-dark/95 px-3 py-1.5 text-[11px] text-gold-light shadow-luxury backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
                <span>One bride per day</span>
              </div>

              {/* The Arched Before & After Frame with Touch/Drag/Wheel events */}
              <div
                ref={sliderFrameRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onWheel={onWheel}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  touchAction: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
                className="group relative h-[56vh] max-h-[510px] min-h-[380px] w-full cursor-ew-resize overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-plum-dark ring-1 ring-gold/40 shadow-2xl select-none"
              >
                {/* Layer 1: BEFORE Image (Underneath) */}
                <div className="pointer-events-none absolute inset-0 h-full w-full select-none">
                  <FadeImg
                    src={beforeImage}
                    alt="Bride before makeup - clean skin and natural prep"
                    sizes="420px"
                    draggable={false}
                    className="h-full w-full object-cover object-[50%_15%] pointer-events-none select-none"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-dark/50 via-transparent to-transparent"
                  />
                </div>

                {/* Layer 2: AFTER Image (Clipped overlay with GPU acceleration) */}
                <div
                  ref={afterLayerRef}
                  style={{
                    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                    willChange: "clip-path",
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none"
                >
                  <FadeImg
                    src={afterImage}
                    alt="Bride after makeup - royal Rajasthani bridal look"
                    sizes="420px"
                    draggable={false}
                    className="h-full w-full object-cover object-[50%_15%] pointer-events-none select-none"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-dark/50 via-transparent to-transparent"
                  />
                </div>

                {/* Floating Status Badges */}
                <div className="pointer-events-none absolute top-6 left-5 z-20 select-none">
                  <span className="rounded-full border border-gold/40 bg-gold/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-plum-dark backdrop-blur-md shadow-xs">
                    AFTER · Royal Bride
                  </span>
                </div>
                <div className="pointer-events-none absolute top-6 right-5 z-20 select-none">
                  <span className="rounded-full border border-white/20 bg-plum-dark/85 px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-white/90 backdrop-blur-md shadow-xs">
                    BEFORE · Bare Skin
                  </span>
                </div>

                {/* Liquid Gold Divider Line */}
                <div
                  ref={dividerRef}
                  style={{
                    left: "50%",
                    willChange: "left",
                  }}
                  className="pointer-events-none absolute inset-y-0 -ml-[1px] w-[2px] bg-gradient-to-b from-gold-light via-gold to-gold-dark z-20 shadow-[0_0_12px_rgba(212,175,55,0.85)] select-none"
                >
                  {/* Golden Medallion Drag Handle */}
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gold bg-plum-dark text-gold-light shadow-luxury transition-transform duration-150 group-hover:scale-110 active:scale-95 select-none">
                    <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>

                {/* Instruction pill at bottom */}
                <div className="pointer-events-none absolute bottom-3.5 inset-x-0 text-center z-20 select-none">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-plum-dark/85 px-3 py-1 text-[10px] text-white/80 backdrop-blur-md border border-white/10">
                    <Wand2 className="h-3 w-3 text-gold" aria-hidden="true" />
                    Drag or scroll to transform
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
