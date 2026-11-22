"use client";

import Link from "next/link";
import React, { useRef } from "react";
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
  const prefersReduced = useReducedMotion();

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

  return (
    <section ref={containerRef} className="relative bg-blush/40 lg:h-[250vh]">
      {/* Sticky Viewport Stage on Desktop, clean natural flow on Mobile (no clipping/cropping) */}
      <div className="w-full lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div className="container-page w-full py-12 sm:py-16 lg:py-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
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
              <h2 className="h-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
                Made for long days, <em className="font-medium text-gold-dark">bright lights</em> and every photo.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Every bride is unique. We scrupulously curate your look around your jewellery, outfit, and timeline so
                you stay radiant through the final pheras.
              </p>

              {/* Steps with living progress rail */}
              <div className="relative mt-8 space-y-4">
                <div
                  aria-hidden="true"
                  className="absolute left-6 top-3 bottom-3 hidden w-[2px] bg-sand/70 sm:block"
                >
                  <motion.div
                    style={{ height: progressHeight }}
                    className="w-full bg-gold-dark"
                  />
                </div>

                {STEPS.map((step) => (
                  <div
                    key={step.step}
                    className="group relative flex items-start gap-4 rounded-2xl border border-gold/20 bg-white/70 p-4 transition-all duration-300 hover:border-gold/50 hover:bg-white hover:shadow-soft"
                  >
                    <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-plum-dark font-serif text-sm font-semibold text-gold-light shadow-sm">
                      {step.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h3 className="font-semibold text-plum">{step.title}</h3>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark lg:hidden">
                          {step.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
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
