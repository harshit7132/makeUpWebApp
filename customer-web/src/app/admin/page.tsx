"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  ImagePlus,
  Instagram,
  Layers,
  Loader2,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { SiteMedia, GalleryPhoto } from "../../lib/site-images";
import FadeImg from "../../components/site/FadeImg";

export default function AdminPage() {
  const [tab, setTab] = useState<"media" | "gallery">("media");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Site Media State
  const [media, setMedia] = useState<SiteMedia | null>(null);

  // Gallery State
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryPhoto | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load site media & gallery
  const loadData = async () => {
    setLoading(true);
    try {
      const [mediaRes, galleryRes] = await Promise.all([
        fetch("/api/admin/site-media"),
        fetch("/api/admin/gallery"),
      ]);
      const mediaData = await mediaRes.json();
      const galleryData = await galleryRes.json();

      if (mediaData.media) setMedia(mediaData.media);
      if (galleryData.items) setGallery(galleryData.items);
    } catch {
      setMessage({ type: "error", text: "Failed to connect to admin API." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  };

  /* ---------------- Save Site Media ---------------- */
  const saveMedia = async () => {
    if (!media) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(media),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("All website photos updated and published successfully!");
    } catch (e: any) {
      flash(e.message || "Failed to save photos", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Delete Gallery Item ---------------- */
  const deleteGalleryItem = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the gallery?`)) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setGallery((prev) => prev.filter((item) => item.id !== id));
      flash(`Deleted "${title}"`);
    } catch {
      flash("Failed to delete gallery item", "error");
    }
  };

  return (
    <div className="min-h-screen bg-champagne text-plum">
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-sand bg-plum-dark text-white shadow-lift">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20 text-gold-light ring-1 ring-gold/40">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-lg font-semibold tracking-wide text-white">Studio Admin Panel</p>
              <p className="text-[10px] text-white/60 uppercase tracking-widest">Makeovers by Prachi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="btn-ghost py-1.5 px-3.5 text-xs text-white/80 hover:text-white inline-flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View live site
            </Link>
            <Link
              href="/gallery"
              target="_blank"
              className="btn-ghost py-1.5 px-3.5 text-xs text-white/80 hover:text-white inline-flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" /> View gallery
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Subheader & Navigation Tabs */}
      <div className="border-b border-sand bg-white shadow-sm">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("media")}
              className={`chip py-2 px-5 text-sm font-semibold transition-all ${
                tab === "media" ? "chip-active bg-plum text-gold-light" : "bg-champagne hover:bg-sand/60"
              }`}
            >
              <Camera className="h-4 w-4" /> All Website Photos of People
            </button>
            <button
              type="button"
              onClick={() => setTab("gallery")}
              className={`chip py-2 px-5 text-sm font-semibold transition-all ${
                tab === "gallery" ? "chip-active bg-plum text-gold-light" : "bg-champagne hover:bg-sand/60"
              }`}
            >
              <Instagram className="h-4 w-4" /> Gallery &amp; Instagram Carousels ({gallery.length})
            </button>
          </div>

          {tab === "media" && (
            <button
              type="button"
              onClick={saveMedia}
              disabled={saving || !media}
              className="btn-primary py-2 px-6 text-sm inline-flex items-center gap-2 shadow-luxury"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving changes..." : "Publish All Photo Changes"}
            </button>
          )}

          {tab === "gallery" && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setShowAddModal(true);
              }}
              className="btn-primary py-2 px-6 text-sm inline-flex items-center gap-2 shadow-luxury"
            >
              <Plus className="h-4 w-4" /> Add New Look / Carousel
            </button>
          )}
        </div>
      </div>

      {/* Floating Alert Notification */}
      {message && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
          <div
            className={`rounded-2xl px-5 py-3.5 text-sm font-medium shadow-2xl flex items-center gap-2.5 ${
              message.type === "success"
                ? "bg-emerald-900 text-emerald-100 ring-1 ring-emerald-700"
                : "bg-red-900 text-red-100 ring-1 ring-red-700"
            }`}
          >
            {message.type === "success" ? <Check className="h-4 w-4 text-emerald-300" /> : <X className="h-4 w-4 text-red-300" />}
            {message.text}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container-page py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-gold-dark" />
            <p className="mt-3 text-sm">Loading studio assets and gallery...</p>
          </div>
        ) : tab === "media" && media ? (
          <SiteMediaManager media={media} setMedia={setMedia} onSave={saveMedia} saving={saving} />
        ) : (
          <GalleryManager
            gallery={gallery}
            onEdit={(item) => {
              setEditingItem(item);
              setShowAddModal(true);
            }}
            onDelete={deleteGalleryItem}
          />
        )}
      </main>

      {/* Modal for Add / Edit Gallery Look & Instagram Carousel */}
      {showAddModal && (
        <GalleryItemModal
          initial={editingItem}
          onClose={() => setShowAddModal(false)}
          onSaved={(savedItem) => {
            setShowAddModal(false);
            setGallery((prev) => {
              const idx = prev.findIndex((i) => i.id === savedItem.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = savedItem;
                return next;
              }
              return [savedItem, ...prev];
            });
            flash(`"${savedItem.title}" saved successfully!`);
          }}
        />
      )}
    </div>
  );
}

/* ========================================================================= */
/*                          1. SITE MEDIA MANAGER                            */
/* ========================================================================= */

function SiteMediaManager({
  media,
  setMedia,
  onSave,
  saving,
}: {
  media: SiteMedia;
  setMedia: React.Dispatch<React.SetStateAction<SiteMedia | null>>;
  onSave: () => void;
  saving: boolean;
}) {
  const uploadImageField = async (file: File, updater: (url: string) => void) => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      updater(data.url);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    }
  };

  return (
    <div className="space-y-12">
      {/* Intro info box */}
      <div className="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-plum text-gold-light">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-semibold text-plum">Website Photography Control</h2>
            <p className="mt-1 text-sm text-muted">
              Here you can customize every single photo of people appearing across Makeovers by Prachi. Paste a photo URL,
              or click <strong>&ldquo;Upload Image&rdquo;</strong> to select a photo from your computer or phone. Changes
              publish immediately across the website upon saving.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO BEFORE & AFTER TRANSFORMATION */}
      <section className="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-soft">
        <div className="border-b border-sand pb-4 mb-6">
          <span className="eyebrow text-gold-dark">Homepage Hero</span>
          <h3 className="h-display text-2xl text-plum">Before &amp; After Transformation Photos</h3>
          <p className="text-xs text-muted mt-1">
            These two portraits power the interactive liquid gold transformation slider in the hero arch.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Before Photo */}
          <PhotoField
            label="BEFORE Photo (Bare Skin / Minimal Prep)"
            description="High-resolution portrait of bride before makeup."
            url={media.transformation.before}
            onChange={(val) =>
              setMedia((m) => m && { ...m, transformation: { ...m.transformation, before: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, transformation: { ...m.transformation, before: url } })
              )
            }
          />

          {/* After Photo */}
          <PhotoField
            label="AFTER Photo (Royal Bride / Finished Look)"
            description="Full royal bridal makeover with jewellery and dupatta."
            url={media.transformation.after}
            onChange={(val) =>
              setMedia((m) => m && { ...m, transformation: { ...m.transformation, after: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, transformation: { ...m.transformation, after: url } })
              )
            }
          />
        </div>
      </section>

      {/* SECTION 2: ARTIST & STUDIO DETAILS */}
      <section className="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-soft">
        <div className="border-b border-sand pb-4 mb-6">
          <span className="eyebrow text-gold-dark">Studio Artistry</span>
          <h3 className="h-display text-2xl text-plum">Detail &amp; Ceremony Photos</h3>
          <p className="text-xs text-muted mt-1">
            Displayed in the sticky 3-step scrollytelling section, banners, and ceremony callouts.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PhotoField
            label="Eye & Lash Detail"
            description="Step 02: Camera-ready eye look"
            url={media.detailEyes}
            onChange={(val) => setMedia((m) => m && { ...m, detailEyes: val })}
            onFileUpload={(file) =>
              uploadImageField(file, (url) => setMedia((m) => m && { ...m, detailEyes: url }))
            }
          />
          <PhotoField
            label="Palette & Brushes"
            description="Step 01: Consultation & mapping"
            url={media.detailPalette}
            onChange={(val) => setMedia((m) => m && { ...m, detailPalette: val })}
            onFileUpload={(file) =>
              uploadImageField(file, (url) => setMedia((m) => m && { ...m, detailPalette: url }))
            }
          />
          <PhotoField
            label="Jewellery & Dupatta"
            description="Step 03: Poshak & draping"
            url={media.detailJewellery}
            onChange={(val) => setMedia((m) => m && { ...m, detailJewellery: val })}
            onFileUpload={(file) =>
              uploadImageField(file, (url) => setMedia((m) => m && { ...m, detailJewellery: url }))
            }
          />
          <PhotoField
            label="Mehendi Ceremony"
            description="Pre-wedding celebration CTA banner"
            url={media.mehendi}
            onChange={(val) => setMedia((m) => m && { ...m, mehendi: val })}
            onFileUpload={(file) =>
              uploadImageField(file, (url) => setMedia((m) => m && { ...m, mehendi: url }))
            }
          />
        </div>
      </section>

      {/* SECTION 3: SERVICE CATEGORY CARDS */}
      <section className="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-soft">
        <div className="border-b border-sand pb-4 mb-6">
          <span className="eyebrow text-gold-dark">Service Catalog</span>
          <h3 className="h-display text-2xl text-plum">Service Category Cover Photos</h3>
          <p className="text-xs text-muted mt-1">
            Photos that appear on the homepage and services page when a service doesn&apos;t have an override image.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PhotoField
            label="Bridal Makeup"
            description="Full royal bridal package card"
            url={media.services.bridal}
            onChange={(val) =>
              setMedia((m) => m && { ...m, services: { ...m.services, bridal: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, services: { ...m.services, bridal: url } })
              )
            }
          />
          <PhotoField
            label="Engagement Glam"
            description="Sagan & ring ceremony card"
            url={media.services.engagement}
            onChange={(val) =>
              setMedia((m) => m && { ...m, services: { ...m.services, engagement: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, services: { ...m.services, engagement: url } })
              )
            }
          />
          <PhotoField
            label="Party & Sangeet"
            description="Reception & bridesmaid glam"
            url={media.services.party}
            onChange={(val) =>
              setMedia((m) => m && { ...m, services: { ...m.services, party: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, services: { ...m.services, party: url } })
              )
            }
          />
          <PhotoField
            label="Destination Wedding"
            description="Palace & lake destination card"
            url={media.services.destination}
            onChange={(val) =>
              setMedia((m) => m && { ...m, services: { ...m.services, destination: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, services: { ...m.services, destination: url } })
              )
            }
          />
        </div>
      </section>

      {/* SECTION 4: CITY DESTINATIONS */}
      <section className="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-soft">
        <div className="border-b border-sand pb-4 mb-6">
          <span className="eyebrow text-gold-dark">Destination Weddings</span>
          <h3 className="h-display text-2xl text-plum">City Celebration Portals</h3>
          <p className="text-xs text-muted mt-1">
            Featured on the homepage parallax strip and individual destination landing pages.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PhotoField
            label="Jodhpur"
            description="Blue City & fort wedding bride"
            url={media.cities.jodhpur}
            onChange={(val) =>
              setMedia((m) => m && { ...m, cities: { ...m.cities, jodhpur: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, cities: { ...m.cities, jodhpur: url } })
              )
            }
          />
          <PhotoField
            label="Jaipur"
            description="Royal fort & palace celebration"
            url={media.cities.jaipur}
            onChange={(val) =>
              setMedia((m) => m && { ...m, cities: { ...m.cities, jaipur: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, cities: { ...m.cities, jaipur: url } })
              )
            }
          />
          <PhotoField
            label="Udaipur"
            description="Lake-side & heritage palace"
            url={media.cities.udaipur}
            onChange={(val) =>
              setMedia((m) => m && { ...m, cities: { ...m.cities, udaipur: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, cities: { ...m.cities, udaipur: url } })
              )
            }
          />
          <PhotoField
            label="Global Destinations"
            description="Outstation & destination weddings"
            url={media.cities.destination}
            onChange={(val) =>
              setMedia((m) => m && { ...m, cities: { ...m.cities, destination: val } })
            }
            onFileUpload={(file) =>
              uploadImageField(file, (url) =>
                setMedia((m) => m && { ...m, cities: { ...m.cities, destination: url } })
              )
            }
          />
        </div>
      </section>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl bg-plum-dark p-4 text-white shadow-2xl">
        <div>
          <p className="font-semibold text-sm text-gold-light">Ready to publish your photo updates?</p>
          <p className="text-xs text-white/70">Your edits will be saved directly into the studio database.</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn-primary py-2.5 px-7 inline-flex items-center gap-2 shadow-luxury"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save All Photos"}
        </button>
      </div>
    </div>
  );
}

function PhotoField({
  label,
  description,
  url,
  onChange,
  onFileUpload,
}: {
  label: string;
  description: string;
  url: string;
  onChange: (url: string) => void;
  onFileUpload: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      await onFileUpload(f);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-sand/80 bg-ivory/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-serif text-sm font-semibold text-plum">{label}</p>
          <p className="text-[11px] text-muted">{description}</p>
        </div>
      </div>

      {/* Thumbnail preview */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-blush shadow-inner">
        {url ? (
          <FadeImg src={url} alt={label} sizes="300px" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">No image chosen</div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        )}
      </div>

      {/* URL Input */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted font-semibold block mb-1">Photo URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="field text-xs py-2 px-3"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-dark py-1.5 px-3 text-xs flex-1 inline-flex items-center justify-center gap-1.5"
        >
          <Upload className="h-3.5 w-3.5" /> Upload File
        </button>
      </div>
    </div>
  );
}

/* ========================================================================= */
/*                          2. GALLERY MANAGER                               */
/* ========================================================================= */

function GalleryManager({
  gallery,
  onEdit,
  onDelete,
}: {
  gallery: GalleryPhoto[];
  onEdit: (item: GalleryPhoto) => void;
  onDelete: (id: string, title: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-plum">Gallery &amp; Instagram Carousel Manager</h2>
            <p className="mt-1 text-sm text-muted">
              Add, edit, and delete looks shown on the website. Each look can be a single photo or an{" "}
              <strong>Instagram carousel with 4 to 6 photos</strong>!
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-plum/5 px-4 py-2 text-xs font-semibold text-plum">
            <Layers className="h-4 w-4 text-gold-dark" /> {gallery.length} Portfolio Items
          </span>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => {
          const isCarousel = item.images && item.images.length >= 2;
          const count = item.images?.length || 1;

          return (
            <div
              key={item.id || item.src}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-sand/80 bg-white shadow-soft transition-all hover:shadow-luxury"
            >
              <div>
                {/* Image Viewport */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-plum-dark">
                  <FadeImg
                    src={item.src}
                    alt={item.title}
                    sizes="(min-width: 1024px) 360px, 50vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="rounded-full bg-plum-dark/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-light backdrop-blur-md">
                      {item.category}
                    </span>

                    {isCarousel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                        <Instagram className="h-3 w-3" /> {count} Photos
                      </span>
                    ) : (
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/80">
                        Single
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-lg font-semibold text-plum">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{item.desc}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-sand/60 bg-ivory/50 p-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="btn-dark py-1.5 px-3.5 text-xs inline-flex items-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Look
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id || "", item.title)}
                  className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-700 hover:bg-red-100 transition-colors"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========================================================================= */
/*                   3. ADD / EDIT GALLERY ITEM MODAL                        */
/* ========================================================================= */

function GalleryItemModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: GalleryPhoto | null;
  onClose: () => void;
  onSaved: (item: GalleryPhoto) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [category, setCategory] = useState<GalleryPhoto["category"]>(initial?.category || "Bridal");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [src, setSrc] = useState(initial?.src || "");
  const [carouselImages, setCarouselImages] = useState<string[]>(
    initial?.images && initial.images.length > 0 ? [...initial.images] : initial?.src ? [initial.src] : []
  );
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a new slide slot to carousel (up to 6 photos)
  const addSlide = () => {
    if (carouselImages.length >= 6) {
      alert("A carousel can have up to 6 photos.");
      return;
    }
    setCarouselImages((prev) => [...prev, ""]);
  };

  const removeSlide = (idx: number) => {
    setCarouselImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSlideUrl = (idx: number, val: string) => {
    setCarouselImages((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    // Set first slide as main src if not specified
    if (idx === 0) setSrc(val);
  };

  const handleFileUpload = async (file: File, targetIdx: number) => {
    setUploadingIndex(targetIdx);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      updateSlideUrl(targetIdx, data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload photo");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for this look.");
      return;
    }

    const cleanImages = carouselImages.filter((s) => s.trim().length > 0);
    const mainPhoto = src.trim() || cleanImages[0];

    if (!mainPhoto) {
      alert("Please provide at least one photo for this look.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<GalleryPhoto> = {
        id: initial?.id,
        title: title.trim(),
        category,
        desc: desc.trim(),
        src: mainPhoto,
        full: mainPhoto,
        ratio: 2 / 3,
        images: cleanImages.length > 1 ? cleanImages : undefined,
      };

      const url = initial?.id ? `/api/admin/gallery/${initial.id}` : "/api/admin/gallery";
      const method = initial?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      onSaved(data.item);
    } catch (err: any) {
      alert(err.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-plum-dark/80 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-2xl my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-champagne text-plum hover:bg-sand transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-serif text-2xl font-semibold text-plum">
          {initial ? "Edit Gallery Look" : "Add New Look / Instagram Carousel"}
        </h2>
        <p className="mt-1 text-xs text-muted">
          Add up to 6 photos in a carousel post (like Instagram) to showcase full look breakdowns.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label className="field-label">Look Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Rajputi Poshak Bride"
              className="field"
            />
          </div>

          {/* Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryPhoto["category"])}
                className="field"
              >
                <option value="Bridal">Bridal</option>
                <option value="Engagement">Engagement</option>
                <option value="Party">Party</option>
                <option value="Destination">Destination</option>
                <option value="Details">Details</option>
              </select>
            </div>
            <div>
              <label className="field-label">Aspect Ratio</label>
              <p className="text-xs text-muted mt-2">Standard 2:3 vertical portrait</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Description / Look Notes</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. HD finish with traditional polki jewellery and secure velvet dupatta drape."
              className="field text-sm"
            />
          </div>

          {/* Instagram Carousel Photos (4 to 6 photos) */}
          <div className="rounded-2xl border border-sand bg-ivory/60 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-sm font-semibold text-plum flex items-center gap-1.5">
                  <Instagram className="h-4 w-4 text-rose-600" />
                  Instagram Carousel Photos ({carouselImages.length}/6)
                </p>
                <p className="text-[11px] text-muted">Add 4 to 6 photos to turn this look into a multi-photo carousel.</p>
              </div>
              {carouselImages.length < 6 && (
                <button
                  type="button"
                  onClick={addSlide}
                  className="btn-dark py-1.5 px-3 text-xs inline-flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Slide
                </button>
              )}
            </div>

            {/* Slides list */}
            <div className="space-y-3">
              {carouselImages.map((imgUrl, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-sand bg-white p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne font-mono text-xs font-bold text-plum">
                    {i + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-blush">
                    {imgUrl ? (
                      <FadeImg src={imgUrl} alt="" sizes="40px" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[9px] text-muted">Empty</div>
                    )}
                  </div>

                  {/* URL Input */}
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => updateSlideUrl(i, e.target.value)}
                    placeholder="Photo URL (https://...)"
                    className="field text-xs py-1.5 flex-1"
                  />

                  {/* File Upload Button */}
                  <label className="btn-dark py-1.5 px-2.5 text-xs shrink-0 cursor-pointer inline-flex items-center gap-1">
                    {uploadingIndex === i ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, i);
                      }}
                    />
                  </label>

                  {/* Remove Slide */}
                  {carouselImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlide(i)}
                      className="p-1.5 text-muted hover:text-red-700 transition-colors"
                      title="Remove slide"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand">
            <button type="button" onClick={onClose} className="btn-ghost py-2 px-5 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-7 text-sm inline-flex items-center gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving Look..." : "Save Look to Gallery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
