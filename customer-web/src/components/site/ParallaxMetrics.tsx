"use client";

import React, { useRef } from "react";
import { BadgeCheck, MapPin, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const METRICS = [
  {
    icon: Sparkles,
    value: "HD & Airbrush",
    label: "Long-wear, camera-ready finishes tested for 12+ hours",
  },
  {
    icon: HeartHandshake,
    value: "1 Bride Per Day",
    label: "Dedicated, unhurried attention with zero rush",
  },
  {
    icon: MapPin,
    value: "Across Rajasthan",
    label: "Jodhpur, Jaipur, Udaipur & Palace destination venues",
  },
  {
    icon: ShieldCheck,
    value: "Instant Booking ID",
    label: "Track your booking & transparent status online any time",
  },
];

export default function ParallaxMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yDrift = useTransform(scrollYProgress, [0, 1], [prefersReduced ? 0 : 20, prefersReduced ? 0 : -20]);

  return (
    <section ref={ref} aria-label="Why book with us" className="border-b border-sand/70 bg-ivory/80 py-10 backdrop-blur-sm">
      <div className="container-page">
        <motion.ul
          style={{ y: yDrift }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {METRICS.map(({ icon: Icon, value, label }, i) => (
            <li
              key={value}
              className="group relative flex items-start gap-4 rounded-2xl border border-gold/20 bg-white/60 p-5 shadow-xs transition-all duration-300 hover:border-gold/50 hover:bg-white hover:shadow-soft"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-blush/60 text-gold-dark shadow-xs transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <span className="block font-serif text-lg font-semibold tracking-tight text-plum">
                  {value}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {label}
                </span>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
