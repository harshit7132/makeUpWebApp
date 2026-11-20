import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import GalleryGrid from "../../components/site/GalleryGrid";
import { getGalleryItems } from "../../lib/booking/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery & Lookbook",
  description: "Bridal, engagement, party and destination makeup looks and multi-photo carousels by Makeovers by Prachi.",
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main className="section pt-10 sm:pt-16">
      <div className="container-page">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="eyebrow eyebrow-line animate-fade-up">Portfolio & Lookbook</p>
          <h1 className="h-display mt-3 animate-fade-up text-5xl sm:text-6xl" style={{ animationDelay: "60ms" }}>
            Looks we love creating
          </h1>
          <p className="lead mt-4 animate-fade-up" style={{ animationDelay: "120ms" }}>
            From royal Rajputi poshak styling to dewy mehendi sundowners and lake-side destination pheras.
            Each look features multiple angles &mdash; swipe through the carousel on any creation to explore.
          </p>
        </header>

        {/* Full Portfolio Masonry Gallery with multi-photo carousels per section */}
        <section className="mt-12">
          <GalleryGrid items={items} />
        </section>

        <p className="mt-8 text-xs text-muted">
          Photos feature studio clients and representative portfolio looks curated by Makeovers by Prachi.
        </p>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-3 text-center" data-reveal>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-champagne text-gold-dark shadow-soft">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="font-serif text-3xl font-medium text-plum">Found a style you adore?</p>
          <p className="max-w-md text-sm text-muted">
            Reserve your date early. We take strictly one royal bride per day to guarantee undivided personal attention.
          </p>
          <Link href="/book" className="btn-primary mt-2 px-8 shadow-luxury transition-transform hover:scale-[1.02]">
            Book your date <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
