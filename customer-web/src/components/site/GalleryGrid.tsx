"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Layers, Loader2, X } from "lucide-react";
import { DEFAULT_SITE_IMAGES, type GalleryPhoto } from "../../lib/site-images";
import FadeImg from "./FadeImg";

export default function GalleryGrid({ items }: { items: GalleryPhoto[] }) {
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const [active, setActive] = useState("All");
  const [openModal, setOpenModal] = useState<{ itemIndex: number; photoIndex: number } | null>(null);
  const shown = active === "All" ? items : items.filter((i) => i.category === active);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpenModal(null);
    window.setTimeout(() => lastTrigger.current?.focus(), 0);
  }, []);

  return (
    <>
      {/* Category filter tabs */}
      <div
        className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        role="tablist"
        aria-label="Filter gallery"
      >
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={`chip shrink-0 ${active === c ? "chip-active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry Columns with Multi-Photo Carousel Cards */}
      <div key={active} className="mt-8 animate-fade-in columns-2 gap-3 sm:gap-5 lg:columns-3">
        {shown.map((item, i) => (
          <GalleryCard
            key={item.id || item.src}
            item={item}
            index={i}
            onOpen={(itemIdx, photoIdx) => {
              setOpenModal({ itemIndex: itemIdx, photoIndex: photoIdx });
            }}
          />
        ))}
      </div>

      {/* Lightbox supporting carousel per look */}
      {openModal !== null && shown[openModal.itemIndex] && (
        <Lightbox
          items={shown}
          itemIndex={openModal.itemIndex}
          initialPhotoIndex={openModal.photoIndex}
          onItemIndex={(idx) => setOpenModal({ itemIndex: idx, photoIndex: 0 })}
          onClose={close}
        />
      )}
    </>
  );
}

function GalleryCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryPhoto;
  index: number;
  onOpen: (itemIndex: number, photoIndex: number) => void;
}) {
  const images = item.images && item.images.length > 0 ? item.images : [item.src];
  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((p) => (p - 1 + images.length) % images.length);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((p) => (p + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setPhotoIndex((p) => (p + 1) % images.length);
      else setPhotoIndex((p) => (p - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  return (
    <figure className="mb-3 break-inside-avoid sm:mb-5">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(index, photoIndex)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpen(index, photoIndex);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="group relative block w-full overflow-hidden rounded-2xl bg-blush text-left shadow-soft cursor-pointer select-none"
        aria-label={`Open look: ${item.title}`}
      >
        <div style={{ aspectRatio: String(item.ratio || 2 / 3) }} className="relative overflow-hidden bg-plum-dark/10">
          <FadeImg
            key={images[photoIndex]}
            src={images[photoIndex]}
            fallbackSrc={item.src || DEFAULT_SITE_IMAGES.hero}
            alt={`${item.title} — Photo ${photoIndex + 1}`}
            sizes="(min-width: 1024px) 360px, 50vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        </div>

        {/* Gradient shadow for text & controls contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/90 via-plum-dark/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Multi-photo indicator badge (top left) */}
        {images.length > 1 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-plum-dark/85 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md z-10 pointer-events-none">
            <Layers className="h-3 w-3 text-gold-light" />
            {photoIndex + 1} / {images.length}
          </span>
        )}

        {/* Carousel slide arrows inside the card */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              aria-label="Previous photo in this look"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-plum-dark/80 text-white opacity-0 transition-all duration-200 hover:bg-plum hover:scale-110 group-hover:opacity-100 shadow-md backdrop-blur-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Next photo in this look"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-plum-dark/80 text-white opacity-0 transition-all duration-200 hover:bg-plum hover:scale-110 group-hover:opacity-100 shadow-md backdrop-blur-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Caption with integrated non-colliding indicators */}
        <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-plum-dark/95 via-plum-dark/70 to-transparent p-3 pt-10 text-white sm:p-4 sm:pt-12">
          {images.length > 1 && (
            <div className="mb-1.5 flex items-center gap-1.5 pointer-events-auto">
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(dotIdx);
                  }}
                  aria-label={`Photo ${dotIdx + 1} of ${images.length}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === photoIndex ? "w-4 bg-gold" : "w-1.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}

          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light sm:block">
            {item.category}
          </span>
          <span className="block font-serif text-xs font-semibold leading-snug sm:text-base">
            {item.title}
          </span>
          {item.desc && (
            <span className="mt-0.5 block text-[11px] text-white/75 truncate line-clamp-1 sm:text-xs">
              {item.desc}
            </span>
          )}
        </figcaption>

        {/* Expand Icon (top right) */}
        <span className="absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-full bg-white/85 text-plum opacity-0 transition duration-300 group-hover:opacity-100 sm:inline-flex z-10 shadow-sm">
          <Expand className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </figure>
  );
}

function Lightbox({
  items,
  itemIndex,
  initialPhotoIndex = 0,
  onItemIndex,
  onClose,
}: {
  items: GalleryPhoto[];
  itemIndex: number;
  initialPhotoIndex?: number;
  onItemIndex: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[itemIndex];
  const images = item.images && item.images.length > 0 ? item.images : [item.full || item.src];
  const [photoIndex, setPhotoIndex] = useState(initialPhotoIndex);

  const dialogRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [dx, setDx] = useState(0);

  // Sync photoIndex when changing looks
  useEffect(() => {
    setPhotoIndex(0);
  }, [itemIndex]);

  const goLook = useCallback(
    (delta: number) => {
      onItemIndex((itemIndex + delta + items.length) % items.length);
    },
    [itemIndex, items.length, onItemIndex]
  );

  const goPhoto = useCallback(
    (delta: number) => {
      if (images.length <= 1) {
        goLook(delta);
        return;
      }
      setPhotoIndex((prev) => {
        const next = prev + delta;
        if (next < 0) {
          goLook(-1);
          return 0;
        }
        if (next >= images.length) {
          goLook(1);
          return 0;
        }
        return next;
      });
    },
    [images.length, goLook]
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goPhoto(1);
      else if (e.key === "ArrowLeft") goPhoto(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goPhoto, onClose]);

  const currentImageSrc = images[photoIndex] || item.full || item.src;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — look ${itemIndex + 1} of ${items.length}`}
      className="fixed inset-0 z-[80] flex animate-fade-in flex-col bg-plum-dark/[0.98]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white sm:px-6"
        style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center gap-2 text-sm tabular-nums text-white/70">
          <span>Look {itemIndex + 1} of {items.length}</span>
          {images.length > 1 && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gold-light">
              Photo {photoIndex + 1} / {images.length}
            </span>
          )}
        </div>
        <button
          type="button"
          data-autofocus
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Main Viewport */}
      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchMove={(e) => {
          if (!touch.current) return;
          const ddx = e.touches[0].clientX - touch.current.x;
          const ddy = e.touches[0].clientY - touch.current.y;
          if (Math.abs(ddx) > Math.abs(ddy)) setDx(ddx);
        }}
        onTouchEnd={() => {
          if (Math.abs(dx) > 60) goPhoto(dx < 0 ? 1 : -1);
          setDx(0);
          touch.current = null;
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/30" />
        </div>

        <figure key={currentImageSrc} className="relative max-h-full animate-fade-in">
          <div
            className="flex max-h-full flex-col items-center transition-transform duration-200 ease-out-expo"
            style={dx ? { transform: `translateX(${dx}px)`, transitionDuration: "0ms" } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageSrc}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_SITE_IMAGES.hero;
              }}
              alt={`${item.title} — Slide ${photoIndex + 1}`}
              className="max-h-[calc(100dvh-13rem)] w-auto max-w-full select-none rounded-xl object-contain shadow-float"
              draggable={false}
            />

            {/* Thumbnail dots for multi-photo look */}
            {images.length > 1 && (
              <div className="mt-3 flex items-center gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === photoIndex ? "w-6 bg-gold" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to photo ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            <figcaption className="mt-3 max-w-xl px-4 text-center text-white">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">{item.category}</span>
              <span className="mt-1 block font-serif text-xl">{item.title}</span>
              {item.desc && <span className="mt-1 block text-sm text-white/70">{item.desc}</span>}
            </figcaption>
          </div>
        </figure>

        {/* Carousel arrows */}
        <button
          type="button"
          onClick={() => goPhoto(-1)}
          aria-label="Previous photo or look"
          className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 sm:inline-flex"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goPhoto(1)}
          aria-label="Next photo or look"
          className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 sm:inline-flex"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <p className="pb-4 text-center text-xs text-white/50 sm:hidden" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
        Swipe to see more photos
      </p>
    </div>
  );
}
