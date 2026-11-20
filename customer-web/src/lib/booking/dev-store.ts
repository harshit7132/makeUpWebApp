import type { SanitizedBooking } from "./types";

/**
 * In-memory dev-store used only when Firestore / Firebase Admin is offline in local development.
 * Allows testing the full lifecycle (DEPOSIT_PENDING -> PAYMENT_PROOF_SUBMITTED -> PAYMENT_REJECTED / CONFIRMED)
 * without needing an active emulator.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mbpDevBookings: Map<string, SanitizedBooking> | undefined;
}

if (!global.__mbpDevBookings) {
  global.__mbpDevBookings = new Map<string, SanitizedBooking>();
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
