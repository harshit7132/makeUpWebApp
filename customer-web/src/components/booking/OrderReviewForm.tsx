"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Sparkles, CheckCircle2, ArrowRight, Loader2, Quote, AlertCircle } from "lucide-react";
import type { SanitizedBooking } from "../../lib/booking/types";

interface Props {
  booking: SanitizedBooking;
}

export default function OrderReviewForm({ booking }: Props) {
  const storageKey = `mbp_reviewed_${booking.bookingId}`;
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState(booking.customerName || "");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<{
    name: string;
    rating: number;
    text: string;
    date: string;
  } | null>(null);
  const [error, setError] = useState("");

  // Load from localStorage if already reviewed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSubmittedReview(JSON.parse(saved));
      }
    } catch {}
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text.trim() || text.trim().length < 5) {
      setError("Please write a few words about your makeup experience.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          name: name.trim() || booking.customerName || "Verified Bride",
          rating,
          text: text.trim(),
          eventType: booking.serviceTitle || "Signature Bridal Makeup",
          city: booking.event?.city || "Jodhpur",
          date: booking.event?.date || new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "We couldn't submit your review. Please try again.");
        return;
      }

      const reviewRecord = {
        name: name.trim() || booking.customerName || "Verified Bride",
        rating,
        text: text.trim(),
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      };

      setSubmittedReview(reviewRecord);
      try {
        localStorage.setItem(storageKey, JSON.stringify(reviewRecord));
      } catch {}
    } catch {
      setError("Network issue. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;
  const ratingLabels: Record<number, string> = {
    1: "Poor experience",
    2: "Could be better",
    3: "Average experience",
    4: "Loved my look!",
    5: "Pure royal perfection! 👑",
  };

  if (submittedReview) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/15 via-champagne/40 to-ivory p-6 text-plum shadow-soft animate-fade-in">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-serif text-lg font-semibold text-plum">Your review is live on our website!</p>
              <span className="inline-flex gap-0.5 text-gold-dark">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= submittedReview.rating ? "fill-gold text-gold" : "fill-sand text-sand"}`} />
                ))}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Thank you {submittedReview.name}! Your kind words have been published and are inspiring brides preparing for their big day.
            </p>

            <blockquote className="mt-3 rounded-xl border border-gold/30 bg-white/80 p-3.5 text-sm italic text-plum shadow-xs">
              &ldquo;{submittedReview.text}&rdquo;
            </blockquote>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/reviews" className="btn-primary text-xs px-5 py-2 inline-flex items-center gap-1.5 shadow-sm">
                View on Reviews Page <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedReview(null)}
                className="text-xs text-muted hover:text-plum underline transition-colors"
              >
                Edit review
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-white p-6 shadow-soft animate-fade-up">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-gold-dark">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark">Order Completed</span>
          <h3 className="font-serif text-xl font-semibold text-plum">Share your bridal look review</h3>
        </div>
      </div>

      <p className="mt-2 text-xs sm:text-sm text-muted">
        Your celebration is complete! We would be honored if you could leave a short review. Your review will be featured directly on our website.
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Star rating selector */}
        <div>
          <label className="block text-xs font-semibold text-plum mb-1.5">Your Rating</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                  aria-label={`${star} stars`}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= currentDisplayRating
                        ? "fill-gold text-gold drop-shadow-xs"
                        : "fill-sand/60 text-sand"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-medium text-gold-dark">
              {ratingLabels[currentDisplayRating] || `${currentDisplayRating} out of 5`}
            </span>
          </div>
        </div>

        {/* Review text */}
        <div>
          <label htmlFor="review-text" className="block text-xs font-semibold text-plum mb-1.5">
            Your Experience / Kind Words <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-text"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us about the makeup longevity, poshak draping, hair styling, or how you felt on your big day..."
            className="w-full rounded-xl border border-sand/80 bg-champagne/20 p-3.5 text-sm text-plum placeholder:text-muted/60 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/30 transition-all"
            required
          />
        </div>

        {/* Reviewer details prefill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="review-name" className="block text-xs font-semibold text-plum mb-1">
              Your Name
            </label>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Harshit"
              className="w-full rounded-xl border border-sand/80 bg-champagne/20 px-3.5 py-2 text-sm text-plum focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/30"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-plum mb-1">
              Celebration Look
            </label>
            <div className="flex items-center rounded-xl border border-sand/60 bg-champagne/40 px-3.5 py-2 text-xs font-medium text-muted">
              {booking.serviceTitle} · {booking.event?.city || "Rajasthan"}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-2 w-full sm:w-auto px-7 py-2.5 inline-flex items-center justify-center gap-2 shadow-luxury"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting review...
            </>
          ) : (
            <>
              Submit review &amp; publish on website <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
