"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import FadeImg from "./FadeImg";
import { SITE_IMAGES } from "../../lib/site-images";

interface CityItem {
  href: string;
  name: string;
  note: string;
  img: string;
  offset: number;
}

const CITIES: CityItem[] = [
  { href: "/jodhpur", name: "Jodhpur", note: "Our flagship studio & Blue City weddings", img: SITE_IMAGES.cities.jodhpur, offset: -25 },
  { href: "/jaipur", name: "Jaipur", note: "Royal fort & palace weddings", img: SITE_IMAGES.cities.jaipur, offset: 25 },
  { href: "/udaipur", name: "Udaipur", note: "Lake-side & heritage celebrations", img: SITE_IMAGES.cities.udaipur, offset: -15 },
  { href: "/destination-weddings", name: "Destination", note: "Anywhere across India & abroad", img: SITE_IMAGES.cities.destination, offset: 35 },
];

function ParallaxCityCard({
  city,
  scrollYProgress,
  prefersReduced,
}: {
  city: CityItem;
  scrollYProgress: MotionValue<number>;
  prefersReduced: boolean | null;
}) {
  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    [prefersReduced ? 0 : city.offset, prefersReduced ? 0 : -city.offset]
  );

  return (
    <motion.div style={{ y: cardY }} className="relative">
      <Link
        href={city.href}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl bg-plum shadow-soft transition-shadow duration-500 hover:shadow-2xl ring-1 ring-gold/20"
      >
        <FadeImg
          src={city.img}
          alt={`${city.name} wedding makeup`}
          sizes="(min-width:1024px) 280px, (min-width:640px) 50vw, 90vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-plum-dark/90 via-plum-dark/25 to-transparent"
        />

        {/* City Badge & Information */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-md mb-2">
            <MapPin className="h-3 w-3 text-gold-light" aria-hidden="true" />
            <span>Rajasthan</span>
          </span>
          <p className="font-serif text-2xl font-semibold tracking-tight">{city.name}</p>
          <p className="mt-1.5 flex items-center justify-between text-xs text-white/80 sm:text-sm">
            {city.note}
            <ArrowRight
              className="h-4 w-4 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-gold-light"
              aria-hidden="true"
            />
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ParallaxCities() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Giant background typography sliding horizontally
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["5%", prefersReduced ? "5%" : "-15%"]);

  return (
    <section ref={containerRef} className="section relative overflow-hidden pt-12 pb-24">
      {/* Giant Pinned Watermark Typography (Like Archar) */}
      <motion.div
        style={{ x: watermarkX }}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-0 select-none whitespace-nowrap font-serif text-[6.5rem] font-bold uppercase tracking-widest text-plum/5 sm:text-[11rem] -z-10"
      >
        Rajasthan · Weddings
      </motion.div>

      <div className="container-page relative z-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow eyebrow-line">Where We Work</p>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
              Based in Jodhpur, travelling across Rajasthan
            </h2>
          </div>
          <p className="text-sm text-muted">
            Available on-location with full professional lighting and equipment.
          </p>
        </div>

        {/* Parallax Staggered Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CITIES.map((c) => (
            <ParallaxCityCard
              key={c.href}
              city={c}
              scrollYProgress={scrollYProgress}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
