"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import FadeImg from "./FadeImg";
import { SITE_IMAGES } from "../../lib/site-images";

interface ParallaxTransformationProps {
  /** Optional override URLs if passing directly */
  beforeImage?: string;
  afterImage?: string;
}

export default function ParallaxTransformation({
  beforeImage = SITE_IMAGES.transformation.before,
  afterImage = SITE_IMAGES.transformation.after,
}: ParallaxTransformationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderFrameRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Slider position (percentage 0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Background subtle drift
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "20%"]);
  // Subtle frame scale & float
  const frameY = useTransform(scrollYProgress, [0, 1], [prefersReduced ? 0 : 30, prefersReduced ? 0 : -30]);

  // If user hasn't manually touched the slider yet, animate the curtain dynamically as they scroll!
  useEffect(() => {
    if (hasInteracted || prefersReduced) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress across the central 40% of the viewport to slider reveal
      if (latest >= 0.2 && latest <= 0.8) {
        const normalized = (latest - 0.2) / 0.6; // 0.0 to 1.0
        // Glide slider from 25% to 75%
        const targetPercent = 25 + normalized * 50;
        setSliderPosition(Math.round(targetPercent));
      }
    });

    return () => unsubscribe();
  }, [hasInteracted, prefersReduced, scrollYProgress]);

  // Handle drag / touch / mouse move
  const updatePosition = useCallback((clientX: number) => {
    if (!sliderFrameRef.current) return;
    const rect = sliderFrameRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
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

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-plum-dark py-20 text-white sm:py-28"
    >
      {/* Background ambient lighting & radial glow */}
      <motion.div
        style={{ y: bgY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_20%,rgba(212,175,55,0.14),transparent_60%),radial-gradient(70%_60%_at_80%_80%,rgba(91,51,71,0.5),transparent_70%)]"
      />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Interactive Before & After Stage (Left) */}
          <motion.div style={{ y: frameY }} className="relative mx-auto w-full max-w-[500px] select-none">
            {/* The Before & After Arched Container */}
            <div
              ref={sliderFrameRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="group relative aspect-[4/5] w-full cursor-ew-resize overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-plum-dark ring-1 ring-gold/40 shadow-2xl touch-none"
            >
              {/* Layer 1: "BEFORE" Image (Base Layer) */}
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

              {/* Layer 2: "AFTER" Image (Clipped Layer) */}
              <div
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
                className="absolute inset-0 h-full w-full pointer-events-none"
              >
                <FadeImg
                  src={afterImage}
                  alt="Bride after makeup - royal Rajasthani bridal transformation"
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
                <span className="rounded-full border border-white/20 bg-plum-dark/80 px-3 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-md shadow-xs">
                  BEFORE · Bare Canvas
                </span>
              </div>
              <div className="pointer-events-none absolute top-8 right-6 z-20">
                <span className="rounded-full border border-gold/40 bg-gold/90 px-3 py-1 text-xs font-semibold tracking-wide text-plum-dark backdrop-blur-md shadow-xs">
                  AFTER · Royal Bride
                </span>
              </div>

              {/* Golden Divider Line */}
              <div
                style={{ left: `${sliderPosition}%` }}
                className="pointer-events-none absolute inset-y-0 -ml-[1px] w-[2px] bg-gradient-to-b from-gold-light via-gold to-gold-dark z-20 shadow-[0_0_12px_rgba(212,175,55,0.75)]"
              >
                {/* Circular Golden Medallion Handle */}
                <div className="absolute top-1/2 -left-5 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-plum-dark text-gold-light shadow-luxury transition-transform duration-200 group-hover:scale-110 active:scale-95">
                  <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>

              {/* Subtle bottom instruction banner */}
              <div className="pointer-events-none absolute bottom-5 inset-x-0 text-center z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-plum-dark/75 px-3.5 py-1 text-[11px] text-white/80 backdrop-blur-md border border-white/10">
                  <Wand2 className="h-3 w-3 text-gold" aria-hidden="true" />
                  Drag slider or scroll to reveal
                </span>
              </div>
            </div>

            {/* Decorative Arched Gold Outline behind frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-t-[999px] rounded-b-[2.5rem] border border-gold/30"
            />
          </motion.div>

          {/* Storytelling & Key Points (Right) */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3.5 py-1 text-xs text-gold-light backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>The Transformation Journey</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              From bare canvas to <em className="font-medium text-gold-light">regal bridal glory</em>.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white/80">
              We never mask who you are. Our artistry enhances your natural features with lightweight, high-performance
              formulations designed to withstand the heat, moisture, and emotional moments of an Indian wedding.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">Skin-First Micro Hydration</h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    Targeted moisture and pore refinement so your base looks like radiant second skin, not makeup.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">Custom HD &amp; Airbrush Blending</h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    Formulated for ultra-HD 4K cameras with seamless matching across your neck, decollete, and collarbones.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">Royal Jewellery &amp; Poshak Setting</h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    Symmetrical maang tikka, nath, and dupatta anchoring that stays firmly in place through the final pheras.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href="/book"
                className="btn-primary px-7 py-3 text-[14px] shadow-luxury transition-transform duration-300 hover:scale-[1.02]"
              >
                Book your bridal trial <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="btn-light px-7 py-3 text-[14px] transition-transform duration-300 hover:scale-[1.02]"
              >
                View packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
