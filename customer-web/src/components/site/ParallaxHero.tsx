"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import AvailabilityChecker from "./AvailabilityChecker";
import FadeImg from "./FadeImg";
import { SITE_IMAGES } from "../../lib/site-images";

export default function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Layer 1: Background ambient drift & dim
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "25%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  // Layer 2: Main typography and CTAs (gently lifts and fades out)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Layer 3: Arched bridal portrait (drifts downwards at different pace and scales subtly)
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "12%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 1.06]);

  // Layer 4: Floating Availability Checker (counter-drift upwards to create deep 3D separation)
  const checkerY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "-24%"]);

  // Layer 5: Floating gold badge (moves faster upwards)
  const badgeY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "-40%"]);

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-plum-dark text-white min-h-[92vh] flex items-center"
    >
      {/* Background Parallax Layer */}
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_65%_at_15%_20%,rgba(212,175,55,0.18),transparent_60%),radial-gradient(65%_65%_at_90%_85%,rgba(91,51,71,0.65),transparent_70%)]"
      />

      {/* Decorative floating gold ambient particles */}
      <motion.div
        style={{ y: badgeY }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[15%] h-56 w-56 rounded-full bg-gold/10 blur-3xl -z-10"
      />

      {/* Mobile hero image banner */}
      <div className="relative h-[58vh] max-h-[520px] min-h-[400px] w-full lg:hidden">
        <FadeImg
          src={SITE_IMAGES.hero}
          alt="A bride in traditional jewellery with soft smoky eye makeup"
          loading="eager"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-plum-dark/60 via-transparent to-plum-dark"
        />
      </div>

      <div className="container-page relative z-10 w-full py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          {/* Left Column: Heading, Subtitle & Primary CTAs */}
          <motion.div style={{ y: textY, opacity: textOpacity }} className="-mt-20 relative lg:mt-0">
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

            {/* Mobile Availability Checker */}
            <div className="mt-10 lg:hidden">
              <AvailabilityChecker />
            </div>
          </motion.div>

          {/* Right Column: Desktop Arched Portrait + 3D Counter-Drifting Card */}
          <div className="relative hidden lg:block">
            {/* Arched Portrait Frame */}
            <motion.div
              style={{ y: portraitY, scale: portraitScale }}
              className="relative ml-auto aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] ring-1 ring-gold/40 shadow-2xl"
            >
              <FadeImg
                src={SITE_IMAGES.hero}
                alt="A bride in traditional jewellery with soft smoky eye makeup"
                loading="eager"
                sizes="480px"
                className="h-full w-full object-cover object-[50%_30%]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-plum-dark/50 via-transparent to-transparent"
              />
            </motion.div>

            {/* Floating Gold Aura Ring */}
            <motion.div
              style={{ y: badgeY }}
              aria-hidden="true"
              className="absolute -right-6 -top-6 h-36 w-36 rounded-full border border-gold/40 opacity-70"
            />

            {/* Floating Luxury Tag */}
            <motion.div
              style={{ y: badgeY }}
              className="absolute -top-4 left-4 z-20 flex items-center gap-2 rounded-2xl border border-gold/30 bg-plum-dark/85 px-4 py-2.5 text-xs text-gold-light shadow-luxury backdrop-blur-md"
            >
              <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
              <span>One bride per day · Exclusive focus</span>
            </motion.div>

            {/* Floating Availability Checker with 3D counter-drift */}
            <motion.div
              style={{ y: checkerY }}
              className="absolute -bottom-10 -left-12 z-20 w-[390px] shadow-2xl"
            >
              <AvailabilityChecker className="border-gold/30 bg-white/95 backdrop-blur-xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
