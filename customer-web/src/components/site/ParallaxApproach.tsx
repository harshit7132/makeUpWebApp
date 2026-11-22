"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import FadeImg from "./FadeImg";
import { DEFAULT_SITE_IMAGES, SITE_IMAGES } from "../../lib/site-images";

const STEPS = [
  {
    step: "01",
    title: "A consultation first",
    text: "We talk through your bridal outfit, heirloom jewellery, skin type, and the exact signature look you envision for every ceremony.",
    tag: "Skin & Palette Mapping",
    img: SITE_IMAGES.detailPalette,
    alt: "Bridal eyeshadow palette, pigments and brushes",
  },
  {
    step: "02",
    title: "Skin prep that lasts",
    text: "Long-wear HD or airbrush bases formulated specifically for desert warmth, joyful tears, high humidity, and 12+ hour rituals.",
    tag: "Camera-Ready HD Base",
    img: SITE_IMAGES.services.bridal,
    alt: "Bridal makeup with glowing skin and smoky eye detail",
  },
  {
    step: "03",
    title: "Hair & draping included",
    text: "Complete styling covering intricate bridal hair, floral setting, and secure poshak, dupatta or saree draping that stays locked in place.",
    tag: "Traditional Poshak & Jewellery",
    img: SITE_IMAGES.detailJewellery,
    alt: "Close-up of royal traditional gold bridal jewellery and dupatta",
  },
];

export default function ParallaxApproach() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualTapRef = useRef(false);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const prefersReduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  // Desktop scrollytelling progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Step 1: 0.00 - 0.38
  const img1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);
  const img1Scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.05]);

  // Step 2: 0.32 - 0.70
  const img2Opacity = useTransform(scrollYProgress, [0.30, 0.40, 0.65, 0.72], [0, 1, 1, 0]);
  const img2Scale = useTransform(scrollYProgress, [0.30, 0.70], [0.96, 1.05]);

  // Step 3: 0.66 - 1.00
  const img3Opacity = useTransform(scrollYProgress, [0.66, 0.76, 1], [0, 1, 1]);
  const img3Scale = useTransform(scrollYProgress, [0.66, 1], [0.96, 1.04]);

  // Progress bar height for the right column
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["10%", "100%"]);

  // Mobile scroll tracking: smoothly updates activeStep as the user scrolls through the cards on phone
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        if (typeof window === "undefined") return;
        // On desktop (>=1024px), Framer Motion's scrollYProgress drives the view
        if (window.innerWidth >= 1024) return;
        if (isManualTapRef.current) return;

        // Sweet spot focal line in the phone viewport below the sticky photo card (~220px from top)
        const photoBottom = 220;
        const focalLine = Math.max(photoBottom + 60, photoBottom + (window.innerHeight - photoBottom) * 0.42);

        let closestIdx = 0;
        let minDistance = Infinity;

        cardRefs.current.forEach((el, idx) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenter - focalLine);

          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        setActiveStep((prev) => (prev !== closestIdx ? closestIdx : prev));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  const handleStepSelect = (idx: number) => {
    setActiveStep(idx);
    isManualTapRef.current = true;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      isManualTapRef.current = false;
    }, 800);
  };

  // Touch swipe support on mobile photo card
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleStepSelect(Math.min(STEPS.length - 1, activeStep + 1));
      } else {
        handleStepSelect(Math.max(0, activeStep - 1));
      }
    }
  };

  return (
    <section ref={containerRef} className="relative bg-blush/40 lg:h-[250vh]">
      {/* Sticky Viewport Stage on Desktop, clean natural flow on Mobile (no clipping/cropping) */}
      <div className="w-full lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div className="container-page w-full py-10 sm:py-14 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Visual Stage (Left) - Desktop only with sticky cross-fade transitions */}
            <div className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-plum-dark shadow-2xl ring-1 ring-gold/30">
                {/* Visual 1 */}
                <motion.div
                  style={{ opacity: prefersReduced ? 1 : img1Opacity, scale: prefersReduced ? 1 : img1Scale }}
                  className="absolute inset-0 h-full w-full"
                >
                  <FadeImg
                    src={STEPS[0].img}
                    alt={STEPS[0].alt}
                    sizes="(min-width: 1024px) 520px, 80vw"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum-dark">
                      {STEPS[0].tag}
                    </span>
                  </div>
                </motion.div>

                {/* Visual 2 */}
                <motion.div
                  style={{ opacity: prefersReduced ? 1 : img2Opacity, scale: prefersReduced ? 1 : img2Scale }}
                  className="absolute inset-0 h-full w-full"
                >
                  <FadeImg
                    src={STEPS[1].img}
                    alt={STEPS[1].alt}
                    sizes="(min-width: 1024px) 520px, 80vw"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum-dark">
                      {STEPS[1].tag}
                    </span>
                  </div>
                </motion.div>

                {/* Visual 3 */}
                <motion.div
                  style={{ opacity: prefersReduced ? 1 : img3Opacity, scale: prefersReduced ? 1 : img3Scale }}
                  className="absolute inset-0 h-full w-full"
                >
                  <FadeImg
                    src={STEPS[2].img}
                    alt={STEPS[2].alt}
                    sizes="(min-width: 1024px) 520px, 80vw"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum-dark">
                      {STEPS[2].tag}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Decorative arched framing behind */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-[2.5rem] border border-gold/30"
              />
            </div>

            {/* Content & Interactive Step Cards (Right) */}
            <div className="relative pl-0 lg:pl-6">
              <p className="eyebrow eyebrow-line">Our Approach</p>
              <h2 className="h-display mt-2.5 text-2xl sm:text-4xl lg:text-5xl">
                Made for long days, <em className="font-medium text-gold-dark">bright lights</em> and every photo.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-muted sm:text-base">
                Every bride is unique. We scrupulously curate your look around your jewellery, outfit, and timeline so
                you stay radiant through the final pheras.
              </p>

              {/* Mobile Visual Stage (lg:hidden) - Sticky at top so photo stays visible across all 3 steps */}
              <div
                className="sticky top-16 z-30 -mx-4 px-4 pt-1.5 pb-2.5 bg-blush/95 backdrop-blur-md lg:hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-plum-dark shadow-xl ring-1 ring-gold/30">
                  {STEPS.map((step, idx) => (
                    <div
                      key={step.step}
                      className={`absolute inset-0 h-full w-full transition-opacity duration-500 ease-out ${
                        activeStep === idx ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                      }`}
                    >
                      <FadeImg
                        src={step.img}
                        alt={step.alt}
                        sizes="(max-width: 1024px) 100vw, 520px"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/90 via-plum-dark/20 to-transparent" />
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
                        <span className="inline-block rounded-full bg-gold/95 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-plum-dark shadow-sm">
                          {step.tag}
                        </span>
                        <span className="rounded-full border border-gold/30 bg-plum-dark/80 px-2 py-0.5 font-serif text-[11px] sm:text-xs text-gold-light">
                          {step.step} / 03
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Dot navigation indicators */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-gold/20 bg-plum-dark/70 px-2.5 py-1 backdrop-blur-sm">
                    {STEPS.map((s, idx) => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => handleStepSelect(idx)}
                        aria-label={`Show ${s.title}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeStep === idx ? "w-5 bg-gold" : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Subtle decorative framing */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 -left-1 -z-10 h-full w-full rounded-2xl border border-gold/30"
                />
              </div>

              {/* Steps with living progress rail */}
              <div className="relative mt-5 space-y-3.5 pb-6 sm:mt-8 sm:space-y-4 sm:pb-8">
                <div
                  aria-hidden="true"
                  className="absolute left-6 top-3 bottom-3 hidden w-[2px] bg-sand/70 sm:block"
                >
                  <motion.div
                    style={{ height: progressHeight }}
                    className="w-full bg-gold-dark"
                  />
                </div>

                {STEPS.map((step, idx) => (
                  <div
                    key={step.step}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    onClick={() => handleStepSelect(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleStepSelect(idx);
                      }
                    }}
                    className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-3.5 sm:p-4 transition-all duration-300 ${
                      activeStep === idx
                        ? "border-gold-dark/60 bg-white shadow-soft ring-1 ring-gold-dark/30 lg:border-gold/20 lg:bg-white/70 lg:ring-0 lg:hover:border-gold/50 lg:hover:bg-white"
                        : "border-gold/20 bg-white/70 hover:border-gold/50 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl font-serif text-sm font-semibold shadow-sm transition-colors duration-300 ${
                        activeStep === idx
                          ? "bg-plum text-gold-light ring-1 ring-gold/40 lg:bg-plum-dark"
                          : "bg-plum-dark text-gold-light"
                      }`}
                    >
                      {step.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h3 className="text-sm sm:text-base font-semibold text-plum">{step.title}</h3>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark lg:hidden">
                          {step.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex items-center gap-4">
                <Link href="/gallery" className="link-gold text-sm font-medium">
                  Explore full bridal gallery <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
