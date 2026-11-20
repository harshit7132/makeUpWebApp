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
}

if (!global.__mbpDevBookings) {
  global.__mbpDevBookings = new Map<string, SanitizedBooking>();
}
if (!global.__mbpDevSiteMedia) {
  global.__mbpDevSiteMedia = { ...DEFAULT_SITE_IMAGES };
}
if (!global.__mbpDevGallery) {
  global.__mbpDevGallery = [...DEFAULT_GALLERY];
}

export const devBookings = global.__mbpDevBookings;

export function getDevBooking(bookingId: string, phone: string): SanitizedBooking {
  const existing = devBookings.get(bookingId);
  if (existing) return existing;

  const isRejected = bookingId.toUpperCase().includes("REJ");
  const isSubmitted = bookingId.toUpperCase().includes("REV") || bookingId.toUpperCase().includes("SUB");

  const defaultBooking: SanitizedBooking = {
    bookingId,
    status: isRejected ? "PAYMENT_REJECTED" : isSubmitted ? "PAYMENT_PROOF_SUBMITTED" : "DEPOSIT_PENDING",
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
      depositPaid: isSubmitted ? 7500 : 0,
    },
    payment: {
      status: isRejected ? "REJECTED" : isSubmitted ? "VERIFICATION_PENDING" : "PENDING",
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
