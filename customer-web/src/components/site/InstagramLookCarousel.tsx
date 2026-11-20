"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Instagram,
  Sparkles,
  Maximize2,
  Calendar,
  Layers,
} from "lucide-react";
import type { GalleryPhoto } from "../../lib/site-images";
import FadeImg from "./FadeImg";

interface Props {
  items: GalleryPhoto[];
  onOpenLightbox?: (photo: GalleryPhoto, imageIndex?: number) => void;
}

export default function InstagramLookCarousel({ items, onOpenLightbox }: Props) {
  // Filter items that have 4 to 6 photos in their carousel, or fallback to first items
  const carouselPosts = items.filter((item) => item.images && item.images.length >= 2);
  const displayPosts = carouselPosts.length > 0 ? carouselPosts : items.slice(0, 3);

  const [activePostIndex, setActivePostIndex] = useState(0);

  return (
    <div className="space-y-12">
      {/* Top post selector tabs */}
      <div className="no-scrollbar -mx-5 flex items-center justify-start gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:justify-center sm:px-0">
        {displayPosts.map((post, i) => {
          const count = post.images?.length || 1;
          const isActive = i === activePostIndex;
          return (
            <button
              key={post.id || post.title}
              type="button"
              onClick={() => setActivePostIndex(i)}
              className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-plum text-gold-light ring-2 ring-gold/50 shadow-md scale-[1.02]"
                  : "bg-white/80 text-plum/70 hover:bg-white hover:text-plum ring-1 ring-sand/70"
              }`}
            >
              <Instagram className={`h-3.5 w-3.5 ${isActive ? "text-gold-light" : "text-plum/50"}`} />
              <span className="font-serif">{post.title}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive ? "bg-gold-light text-plum" : "bg-champagne text-plum/70"
                }`}
              >
                {count} {count === 1 ? "photo" : "photos"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Instagram Carousel Post */}
      {displayPosts[activePostIndex] && (
        <div className="mx-auto max-w-xl">
          <SingleInstagramPost
            post={displayPosts[activePostIndex]}
            onOpenLightbox={onOpenLightbox}
          />
        </div>
      )}
    </div>
  );
}

function SingleInstagramPost({
  post,
  onOpenLightbox,
}: {
  post: GalleryPhoto;
  onOpenLightbox?: (photo: GalleryPhoto, imageIndex?: number) => void;
}) {
  const images = post.images && post.images.length > 0 ? post.images : [post.src];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = images.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) nextSlide();
    else if (diff < -40) prevSlide();
    touchStartX.current = null;
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-sand/80 bg-white shadow-luxury">
      {/* Instagram Header */}
      <div className="flex items-center justify-between border-b border-sand/40 px-5 py-3.5 bg-ivory/60">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="h-full w-full rounded-full bg-white p-[1.5px]">
              <FadeImg
                src={images[0]}
                alt="Makeovers by Prachi"
                sizes="40px"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs sm:text-sm text-plum">makeoversbyprachi</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[10px] font-medium text-gold-dark uppercase tracking-wider">{post.category}</span>
            </div>
            <p className="text-[11px] text-muted truncate">Rajasthan · Royal Destination Wedding</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {total > 1 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-plum/5 px-2.5 py-1 text-[11px] font-semibold text-plum">
              <Layers className="h-3 w-3 text-gold-dark" />
              {currentSlide + 1}/{total}
            </span>
          )}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-plum transition-colors p-1"
            aria-label="Instagram profile"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Media Carousel Viewport */}
      <div
        className="relative aspect-[4/5] w-full select-none overflow-hidden bg-plum-dark"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out-expo"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((imgUrl, idx) => (
            <div key={imgUrl + idx} className="relative h-full w-full shrink-0">
              <FadeImg
                src={imgUrl}
                alt={`${post.title} — Slide ${idx + 1}`}
                sizes="(min-width: 640px) 580px, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Slide Counter Badge in corner */}
        {total > 1 && (
          <span className="pointer-events-none absolute right-3.5 top-3.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-md">
            {currentSlide + 1} / {total}
          </span>
        )}

        {/* Expand lightbox button */}
        <button
          type="button"
          onClick={() => onOpenLightbox?.(post, currentSlide)}
          className="absolute left-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110"
          aria-label="Expand image"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>

        {/* Prev / Next Chevrons */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous photo in carousel"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-plum shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-30"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next photo in carousel"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-plum shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-30"
              disabled={currentSlide === total - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots Pagination */}
        {total > 1 && (
          <div className="absolute inset-x-0 bottom-3.5 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 bg-gold shadow-md" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Instagram Action Row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-4 text-plum">
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "hover:text-red-500"}`} />
            </button>
            <Link href="/contact" aria-label="Comment / Inquire" className="transition-transform hover:scale-110">
              <MessageCircle className="h-6 w-6 hover:text-gold-dark" />
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Look at this stunning look by Makeovers by Prachi: ${post.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="transition-transform hover:scale-110"
            >
              <Send className="h-6 w-6 hover:text-[#1DA851]" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className="transition-transform hover:scale-110 text-plum"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark className={`h-6 w-6 ${saved ? "fill-plum text-plum" : "hover:text-gold-dark"}`} />
          </button>
        </div>

        {/* Caption & Look Info */}
        <div className="space-y-1.5 text-xs sm:text-sm">
          <p className="font-serif text-base sm:text-lg font-semibold text-plum">{post.title}</p>
          <p className="leading-relaxed text-muted">
            <span className="font-semibold text-plum">makeoversbyprachi</span> {post.desc}
          </p>
          <p className="text-[11px] font-medium text-gold-dark">
            #MakeoversByPrachi #BridalMakeup #JodhpurBride #RajasthaniWedding #HDMakeup
          </p>
        </div>

        {/* Book this look CTA button */}
        <div className="mt-4 pt-3.5 border-t border-sand/60 flex items-center justify-between">
          <span className="text-xs text-muted flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold-dark" />
            Love this style?
          </span>
          <Link href="/book" className="btn-dark py-2 px-5 text-xs inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Book this look
          </Link>
        </div>
      </div>
    </article>
  );
}
