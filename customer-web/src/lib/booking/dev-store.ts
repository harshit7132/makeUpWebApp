import type { SanitizedBooking } from "./types";
import { DEFAULT_SITE_IMAGES, DEFAULT_GALLERY, type SiteMedia, type GalleryPhoto, mergeSiteMedia } from "../site-images";

/**
 * In-memory dev-store used only when Firestore / Firebase Admin is offline in local development.
 * Allows testing the full lifecycle without needing an active emulator:
 * - Booking lifecycle
 * - Site Media (all photos of people on the website)
 * - Gallery (add, edit, delete, and 4-6 photo Instagram carousels)
 */
declare global {
  // eslint-disable-next-line no-var
  var __mbpDevBookings: Map<string, SanitizedBooking> | undefined;
  // eslint-disable-next-line no-var
  var __mbpDevSiteMedia: SiteMedia | undefined;
  // eslint-disable-next-line no-var
  var __mbpDevGallery: GalleryPhoto[] | undefined;
  // eslint-disable-next-line no-var
  var __mbpDevReviews: DevReview[] | undefined;
}

export interface DevReview {
  id: string;
  bookingId?: string;
  name: string;
  rating: number;
  text: string;
  eventType: string;
  city?: string;
  date: string;
  approved: boolean;
  createdAt: string;
}

export const INITIAL_DEV_REVIEWS: DevReview[] = [
  {
    id: "rev-1",
    bookingId: "MBP-COMP01",
    name: "Priyanka Rathore",
    rating: 5,
    text: "Prachi gave me the royal Rajputi bridal look of my dreams at Umaid Bhawan! The base was completely weightless, glowed throughout 10 hours of pheras and reception, and the poshak and dupatta draping was absolute perfection.",
    eventType: "Signature Bridal Makeup",
    city: "Jodhpur",
    date: "2026-11-15",
    approved: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "rev-2",
    bookingId: "MBP-COMP02",
    name: "Ananya Sharma",
    rating: 5,
    text: "Booking online was seamless and tracking gave me total peace of mind. On my sangeet day, Prachi arrived exactly on time with high-end luxury cosmetics. Received endless compliments on my dewy eye styling!",
    eventType: "Engagement & Pre-wedding Glam",
    city: "Jaipur",
    date: "2026-11-08",
    approved: true,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "rev-3",
    bookingId: "MBP-COMP03",
    name: "Sneha Shekhawat",
    rating: 5,
    text: "The eye artistry and heirloom jewellery styling were breathtaking. Prachi has such a calm, reassuring presence during wedding morning rush. Couldn't recommend Makeovers by Prachi more highly!",
    eventType: "Signature Bridal Makeup",
    city: "Udaipur",
    date: "2026-10-24",
    approved: true,
    createdAt: new Date(Date.now() - 26 * 86400000).toISOString(),
  },
];

if (!global.__mbpDevBookings) {
  global.__mbpDevBookings = new Map<string, SanitizedBooking>();
}
if (!global.__mbpDevSiteMedia) {
  global.__mbpDevSiteMedia = { ...DEFAULT_SITE_IMAGES };
}
if (!global.__mbpDevGallery) {
  global.__mbpDevGallery = [...DEFAULT_GALLERY];
}
if (!global.__mbpDevReviews) {
  global.__mbpDevReviews = [...INITIAL_DEV_REVIEWS];
}

export const devBookings = global.__mbpDevBookings;

export function getDevBooking(bookingId: string, phone: string): SanitizedBooking {
  const existing = devBookings.get(bookingId);
  if (existing) return existing;

  const isRejected = bookingId.toUpperCase().includes("REJ");
  const isSubmitted = bookingId.toUpperCase().includes("REV") || bookingId.toUpperCase().includes("SUB");
  const isCompleted = bookingId.toUpperCase().includes("COMP") || bookingId.toUpperCase().includes("DONE");

  const defaultBooking: SanitizedBooking = {
    bookingId,
    status: isCompleted ? "COMPLETED" : isRejected ? "PAYMENT_REJECTED" : isSubmitted ? "PAYMENT_PROOF_SUBMITTED" : "DEPOSIT_PENDING",
    serviceTitle: "Signature Bridal Makeup",
    packageName: null,
    customerName: "Harshit",
    event: {
      date: "2026-11-22",
      readyByTime: "06:30",
      venue: "Hotel",
      city: "Jodhpur",
      guestCount: 5,
    },
    commercials: {
      basePrice: 25000,
      travelFee: 0,
      totalAmount: 25000,
      depositRequired: 7500,
      depositPaid: isSubmitted || isCompleted ? 7500 : 0,
    },
    payment: {
      status: isCompleted ? "VERIFIED" : isRejected ? "REJECTED" : isSubmitted ? "VERIFICATION_PENDING" : "PENDING",
      utrLast4: isRejected || isSubmitted ? "4321" : null,
      rejectionReason: isRejected
        ? "The 12-digit UPI reference (UTR) provided does not match our bank account statement. Please verify and re-upload."
        : null,
      upiId: "prachi@okicici",
      payeeName: "Makeovers by Prachi",
    },
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };

  devBookings.set(bookingId, defaultBooking);
  return defaultBooking;
}

export function recordDevProofSubmission(bookingId: string, utrRaw: string) {
  const current = devBookings.get(bookingId) || getDevBooking(bookingId, "");
  const updated: SanitizedBooking = {
    ...current,
    status: "PAYMENT_PROOF_SUBMITTED",
    payment: {
      ...current.payment,
      status: "VERIFICATION_PENDING",
      utrLast4: utrRaw.slice(-4),
      rejectionReason: null,
    },
  };
  devBookings.set(bookingId, updated);
  return updated;
}

/* -------------------- Site Media (Photos of People) -------------------- */

export function getDevSiteMedia(): SiteMedia {
  return global.__mbpDevSiteMedia || DEFAULT_SITE_IMAGES;
}

export function updateDevSiteMedia(partial: Partial<SiteMedia>): SiteMedia {
  const current = getDevSiteMedia();
  const merged = mergeSiteMedia({
    ...current,
    ...partial,
    transformation: {
      ...current.transformation,
      ...(partial.transformation || {}),
    },
    services: {
      ...current.services,
      ...(partial.services || {}),
    },
    cities: {
      ...current.cities,
      ...(partial.cities || {}),
    },
  });
  global.__mbpDevSiteMedia = merged;
  return merged;
}

/* -------------------- Gallery & Instagram Carousels -------------------- */

export function getDevGallery(): GalleryPhoto[] {
  return global.__mbpDevGallery || DEFAULT_GALLERY;
}

export function addDevGalleryItem(item: Omit<GalleryPhoto, "id"> & { id?: string }): GalleryPhoto {
  const list = getDevGallery();
  const newItem: GalleryPhoto = {
    ...item,
    id: item.id || `gal-${Date.now()}`,
    sortOrder: item.sortOrder ?? list.length + 1,
  };
  global.__mbpDevGallery = [newItem, ...list];
  return newItem;
}

export function updateDevGalleryItem(id: string, updates: Partial<GalleryPhoto>): GalleryPhoto | null {
  const list = getDevGallery();
  const idx = list.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  global.__mbpDevGallery = [...list];
  return updated;
}

export function deleteDevGalleryItem(id: string): boolean {
  const list = getDevGallery();
  const next = list.filter((g) => g.id !== id);
  if (next.length === list.length) return false;
  global.__mbpDevGallery = next;
  return true;
}

/* -------------------- Customer Reviews -------------------- */

export function getDevReviews(): DevReview[] {
  return global.__mbpDevReviews || INITIAL_DEV_REVIEWS;
}

export function addDevReview(review: Omit<DevReview, "id" | "createdAt"> & { id?: string }): DevReview {
  const list = getDevReviews();
  const newRev: DevReview = {
    ...review,
    id: review.id || `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  global.__mbpDevReviews = [newRev, ...list];
  return newRev;
}
