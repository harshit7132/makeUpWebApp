"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, ArrowRight, Sparkles, Star, Wand2 } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
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
  const prefersReduced = useReducedMotion();

  // Slider position (0 = 100% Before, 50 = Split, 100 = 100% After)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background subtle drift
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "22%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  // Main Left Column Typography (smooth upward drift & fade on scroll)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "-15%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.1]);

  // Arched Portrait Parallax Drift & Scale
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "10%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 1.04]);

  // Floating Gold Aura Ring
  const badgeY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "-30%"]);

  // Scroll-linked auto reveal: if user hasn't dragged, scrolling smoothly scrubs the transformation
  useEffect(() => {
    if (hasInteracted || prefersReduced) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 0.05 && latest <= 0.7) {
        const normalized = (latest - 0.05) / 0.65; // 0.0 to 1.0
        const targetPercent = 30 + normalized * 50; // glide from 30% to 80%
        setSliderPosition(Math.round(targetPercent));
      }
    });

    return () => unsubscribe();
  }, [hasInteracted, prefersReduced, scrollYProgress]);

  // Drag / Touch / Mouse handlers
  const updatePosition = useCallback((clientX: number) => {
    if (!sliderFrameRef.current) return;
    const rect = sliderFrameRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(Math.round(percentage));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setHasInteracted(true);
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const setView = (percent: number) => {
    setHasInteracted(true);
    setSliderPosition(percent);
  };

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-plum-dark text-white min-h-[92vh] flex items-center"
    >
      {/* Background Ambient Glow & Particles */}
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_65%_at_15%_20%,rgba(212,175,55,0.18),transparent_60%),radial-gradient(65%_65%_at_90%_85%,rgba(91,51,71,0.65),transparent_70%)]"
      />

      <motion.div
        style={{ y: badgeY }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[15%] h-56 w-56 rounded-full bg-gold/10 blur-3xl -z-10"
      />

      <div className="container-page relative z-10 w-full py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          
          {/* ================= LEFT COLUMN ================= */}
          <motion.div style={{ y: textY, opacity: textOpacity }} className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3.5 py-1 text-xs text-gold-light backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>Bridal makeup · Jodhpur &amp; Rajasthan Destination</span>
            </div>

            <h1 className="mt-5 font-serif text-[2.6rem] font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              Bridal makeup that feels like{" "}
              <em className="font-medium text-gold-light">you</em>, on your biggest day.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Traditional Rajasthani bridal looks, long-wear HD and airbrush finishes, hair styling, and heirloom
              poshak draping — by Prachi and her studio team.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href="/book"
                className="btn-primary px-7 py-3.5 text-[15px] shadow-luxury transition-transform duration-300 hover:scale-[1.02]"
              >
                Book your date <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="btn-light px-7 py-3.5 text-[15px] transition-transform duration-300 hover:scale-[1.02]"
              >
                Services &amp; prices
              </Link>
            </div>

            {/* Availability Checker placed cleanly on the Left column so the Portrait is 100% UNOBSTRUCTED */}
            <div className="mt-10 max-w-lg">
              <AvailabilityChecker className="border-gold/30 bg-white/95 text-plum shadow-2xl backdrop-blur-xl" />
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN (FULL BEFORE & AFTER PORTRAIT) ================= */}
          <div className="relative">
            {/* Quick Toggle Controls (Bare / Split / Royal Bride) */}
            <div className="mb-4 flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-medium uppercase tracking-wider text-gold-light flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span>Transformation View:</span>
              </span>
              <div className="inline-flex rounded-full border border-gold/30 bg-plum/60 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setView(0)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    sliderPosition === 0 ? "bg-white/20 text-white font-semibold" : "text-white/70 hover:text-white"
                  }`}
                >
                  Before
                </button>
                <button
                  type="button"
                  onClick={() => setView(50)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    sliderPosition > 10 && sliderPosition < 90
                      ? "bg-gold text-plum-dark font-semibold shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Split 50/50
                </button>
                <button
                  type="button"
                  onClick={() => setView(100)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    sliderPosition === 100 ? "bg-gold text-plum-dark font-semibold shadow-xs" : "text-white/70 hover:text-white"
                  }`}
                >
                  After
                </button>
              </div>
            </div>

            {/* Arched Full-View Before & After Portrait Frame */}
            <motion.div
              style={{ y: portraitY, scale: portraitScale }}
              className="relative mx-auto w-full max-w-[490px] select-none"
            >
              <div
                ref={sliderFrameRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="group relative aspect-[4/5] w-full cursor-ew-resize overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-plum-dark ring-1 ring-gold/40 shadow-2xl touch-none"
              >
                {/* 1. "BEFORE" Base Layer (Visible on the right of the divider) */}
                <div className="absolute inset-0 h-full w-full">
                  <FadeImg
                    src={beforeImage}
                    alt="Bride before makeup - clean skin and natural prep"
                    sizes="(min-width: 1024px) 500px, 90vw"
                    className="h-full w-full object-cover object-[50%_25%]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-plum-dark/60 via-transparent to-transparent pointer-events-none"
                  />
                </div>

                {/* 2. "AFTER" Clipped Layer (Visible on the left of the divider) */}
                <div
                  style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                  }}
                  className="absolute inset-0 h-full w-full pointer-events-none"
                >
                  <FadeImg
                    src={afterImage}
                    alt="Bride after makeup - royal Rajasthani bridal look"
                    sizes="(min-width: 1024px) 500px, 90vw"
                    className="h-full w-full object-cover object-[50%_25%]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-plum-dark/60 via-transparent to-transparent pointer-events-none"
                  />
                </div>

                {/* Floating Status Badges */}
                <div className="pointer-events-none absolute top-8 left-6 z-20">
                  <span className="rounded-full border border-gold/40 bg-gold/90 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-plum-dark backdrop-blur-md shadow-xs">
                    AFTER · Royal Bride
                  </span>
                </div>
                <div className="pointer-events-none absolute top-8 right-6 z-20">
                  <span className="rounded-full border border-white/20 bg-plum-dark/80 px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-white/90 backdrop-blur-md shadow-xs">
                    BEFORE · Bare Skin
                  </span>
                </div>

                {/* Liquid Gold Divider Line */}
                <div
                  style={{ left: `${sliderPosition}%` }}
                  className="pointer-events-none absolute inset-y-0 -ml-[1px] w-[2px] bg-gradient-to-b from-gold-light via-gold to-gold-dark z-20 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                >
                  {/* Golden Medallion Drag Handle */}
                  <div className="absolute top-1/2 -left-5 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-plum-dark text-gold-light shadow-luxury transition-transform duration-200 group-hover:scale-110 active:scale-95">
                    <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                {/* Instruction Banner at the bottom */}
                <div className="pointer-events-none absolute bottom-4 inset-x-0 text-center z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-plum-dark/85 px-3 py-1 text-[11px] text-white/80 backdrop-blur-md border border-white/10">
                    <Wand2 className="h-3 w-3 text-gold" aria-hidden="true" />
                    Drag handle or scroll to reveal
                  </span>
                </div>
              </div>

              {/* Decorative Aura Ring */}
              <motion.div
                style={{ y: badgeY }}
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full border border-gold/40 opacity-70"
              />

              {/* Floating Luxury Tag */}
              <motion.div
                style={{ y: badgeY }}
                className="absolute -top-4 -left-4 z-20 flex items-center gap-2 rounded-2xl border border-gold/30 bg-plum-dark/90 px-4 py-2 text-xs text-gold-light shadow-luxury backdrop-blur-md"
              >
                <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                <span>One bride per day · Exclusive focus</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
