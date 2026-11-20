import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { ArrowRight, Instagram, Sparkles } from "lucide-react";
import GalleryGrid from "../../components/site/GalleryGrid";
import InstagramLookCarousel from "../../components/site/InstagramLookCarousel";
import { getGalleryItems } from "../../lib/booking/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery & Lookbook",
  description: "Bridal, engagement, party and destination makeup looks and multi-photo carousel breakdowns by Makeovers by Prachi.",
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
            Explore our latest looks and multi-photo breakdowns below.
          </p>
        </header>

        {/* 1. Instagram Carousel Spotlight (4 to 6 photos per look) */}
        <section className="mt-14 rounded-3xl border border-sand/80 bg-white/70 p-6 sm:p-10 shadow-soft">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm">
                  <Instagram className="h-4 w-4" />
                </span>
                <span className="eyebrow text-gold-dark">Instagram Lookbook Carousels</span>
              </div>
              <h2 className="h-display mt-2 text-2xl sm:text-3xl text-plum">
                Swipe for look breakdowns
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Each carousel features 4 to 6 angles — from HD base and eye details to poshak jewellery and dupatta drapes.
              </p>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Follow @makeoversbyprachi <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <InstagramLookCarousel items={items} />
        </section>

        {/* 2. Full Portfolio Masonry Gallery */}
        <section className="mt-20">
          <div className="flex items-center justify-between border-b border-sand/70 pb-4">
            <div>
              <p className="eyebrow">All Creations</p>
              <h2 className="h-display mt-1 text-2xl sm:text-3xl">Filter by celebration</h2>
            </div>
          </div>
          <GalleryGrid items={items} />
        </section>

        <p className="mt-8 text-xs text-muted">Photos feature studio clients and representative portfolio looks curated by Makeovers by Prachi.</p>

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
