/**
 * Website photography and media models.
 *
 * All photos on the website of people (transformation before/after, hero,
 * artist details, services, cities) and the portfolio gallery can be
 * managed dynamically by the admin in the Admin Panel (/admin).
 *
 * These defaults serve as high-quality fallbacks when custom photos
 * have not yet been uploaded in Firestore or when developing locally.
 */

const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

export interface SiteMedia {
  /** Home hero (portrait, bride close-up) */
  hero: string;
  /** Before & After Transformation Photos */
  transformation: {
    before: string;
    after: string;
  };
  /** "Meet the artist" / studio detail images */
  detailEyes: string;
  detailPalette: string;
  detailJewellery: string;
  mehendi: string;
  /** Service-card images, keyed by category (lower-case) */
  services: {
    bridal: string;
    engagement: string;
    party: string;
    destination: string;
    default: string;
  };
  /** City / destination wedding celebration images */
  cities: {
    jodhpur: string;
    jaipur: string;
    udaipur: string;
    destination: string;
  };
}

export const DEFAULT_SITE_IMAGES: SiteMedia = {
  hero: u("1600685890506-593fdf55949b", 1400),
  transformation: {
    before: u("1617627143750-d86bc21e42bb", 1200),
    after: u("1600685890506-593fdf55949b", 1200),
  },
  detailEyes: u("1487412947147-5cebf100ffc2", 900),
  detailPalette: u("1596704017254-9b121068fb31", 900),
  detailJewellery: u("1601121141461-9d6647bca1ed", 900),
  mehendi: u("1597157639073-69284dc0fdaf", 900),
  services: {
    bridal: u("1610173827043-9db50e0d8ef9", 900),
    engagement: u("1597983073493-88cd35cf93b0", 900),
    party: u("1610030469983-98e550d6193c", 900),
    destination: u("1583878545126-2f1ca0142714", 900),
    default: u("1617627143750-d86bc21e42bb", 900),
  },
  cities: {
    jodhpur: u("1599661046289-e31897846e41", 1600),
    jaipur: u("1603262110263-fb0112e7cc33", 1600),
    udaipur: u("1615836245337-f5b9b2303f10", 1600),
    destination: u("1630526720753-aa4e71acf67d", 1600),
  },
};

export const SITE_IMAGES = DEFAULT_SITE_IMAGES;

export interface GalleryPhoto {
  id?: string;
  src: string;
  /** Larger version for the lightbox */
  full: string;
  title: string;
  category: "Bridal" | "Engagement" | "Party" | "Destination" | "Details";
  desc: string;
  /** natural aspect ratio (w/h) so the masonry grid doesn't jump while loading */
  ratio: number;
  /**
   * Multi-photo Instagram-style carousel (4 to 6 photos in a single section/post)
   */
  images?: string[];
  sortOrder?: number;
}

const g = (
  id: string,
  ratio: number,
  rest: Omit<GalleryPhoto, "src" | "full" | "ratio">,
  carouselIds?: string[]
): GalleryPhoto => {
  const images = carouselIds && carouselIds.length > 0 ? carouselIds.map((cid) => u(cid, 1200)) : undefined;
  return {
    src: u(id, 700),
    full: u(id, 1600),
    ratio,
    images,
    ...rest,
  };
};

export const DEFAULT_GALLERY: GalleryPhoto[] = [
  g(
    "1600685890506-593fdf55949b",
    2 / 3,
    {
      id: "gal-1",
      title: "Royal Rajputi Poshak Bride",
      category: "Bridal",
      desc: "5-shot carousel breakdown: long-wear base, soft smoky eyes, heirloom polki jewellery, and royal dupatta setting.",
    },
    [
      "1600685890506-593fdf55949b", // Full bridal look
      "1487412947147-5cebf100ffc2", // Eye & lash detail
      "1601121141461-9d6647bca1ed", // Jewellery & dupatta drape
      "1597157639073-69284dc0fdaf", // Mehendi & rings
      "1617627143750-d86bc21e42bb", // Sunset portrait
    ]
  ),
  g(
    "1597983073493-88cd35cf93b0",
    2 / 3,
    {
      id: "gal-2",
      title: "Mehendi-Day Dewy Glow",
      category: "Engagement",
      desc: "4-photo look series: Fresh, luminous glass skin with soft floral styling tailored for daytime outdoor celebration.",
    },
    [
      "1597983073493-88cd35cf93b0",
      "1596704017254-9b121068fb31",
      "1583391733956-3750e0ff4e8b",
      "1597157639073-69284dc0fdaf",
    ]
  ),
  g(
    "1630526720753-aa4e71acf67d",
    2 / 3,
    {
      id: "gal-3",
      title: "Lakeside Palace Destination",
      category: "Destination",
      desc: "4-shot destination series: Sweat-proof, humidity-tested base built for a full day of heritage palace outdoor ceremonies.",
    },
    [
      "1630526720753-aa4e71acf67d",
      "1583878545126-2f1ca0142714",
      "1610173827043-9db50e0d8ef9",
      "1600685890506-593fdf55949b",
    ]
  ),
  g("1601121141461-9d6647bca1ed", 1.44, {
    id: "gal-4",
    title: "Heirloom Polki Jewellery",
    category: "Details",
    desc: "Setting heavy jewellery and velvet dupatta so they stay comfortably anchored all night.",
  }),
  g(
    "1610173827043-9db50e0d8ef9",
    2 / 3,
    {
      id: "gal-5",
      title: "Classic Red Velvet Bridal",
      category: "Bridal",
      desc: "4-photo collection: HD finish with a radiant, photo-ready glow under venue spotlights.",
    },
    [
      "1610173827043-9db50e0d8ef9",
      "1600685890506-593fdf55949b",
      "1487412947147-5cebf100ffc2",
      "1601121141461-9d6647bca1ed",
    ]
  ),
  g("1610030469983-98e550d6193c", 2 / 3, {
    id: "gal-6",
    title: "Sangeet & Cocktail Glam",
    category: "Party",
    desc: "Photo-ready glamour for sangeet, cocktail party, reception and family celebration.",
  }),
  g("1597157639073-69284dc0fdaf", 1.5, {
    id: "gal-7",
    title: "Mehendi Ceremony Moments",
    category: "Details",
    desc: "Candid moments and intricate floral jewellery from the pre-wedding celebrations.",
  }),
  g("1617627143750-d86bc21e42bb", 2 / 3, {
    id: "gal-8",
    title: "Silk Saree & Temple Gold",
    category: "Bridal",
    desc: "Soft champagne gold eyes and a luminous base to complement traditional temple jewellery.",
  }),
  g("1583878545126-2f1ca0142714", 1.5, {
    id: "gal-9",
    title: "Poolside Pheras & Sundowner",
    category: "Destination",
    desc: "Waterproof, transfer-proof base formulated for warm daytime outdoor rituals.",
  }),
  g("1583391733956-3750e0ff4e8b", 0.8, {
    id: "gal-10",
    title: "Ivory & Pastel Lehenga",
    category: "Engagement",
    desc: "Modern soft glam with defined eyes and effortless romantic hair styling.",
  }),
  g("1487412947147-5cebf100ffc2", 1.5, {
    id: "gal-11",
    title: "Sculpted Eye & Lash Detail",
    category: "Details",
    desc: "Feathered individual lashes and smudge-proof liner tailored to eye geometry.",
  }),
];

export const GALLERY: GalleryPhoto[] = DEFAULT_GALLERY;

/** Picks the photo for a service card: Firestore `imageUrl` first, then by category / id keywords. */
export function serviceImage(
  s: { id: string; category?: string | null; title?: string; imageUrl?: string | null },
  customServices?: Record<string, string>
): string {
  if (s.imageUrl) return s.imageUrl;
  const servicesMap = customServices || SITE_IMAGES.services;
  const hay = `${s.category || ""} ${s.id} ${s.title || ""}`.toLowerCase();
  for (const key of ["destination", "engagement", "party", "bridal"]) {
    if (hay.includes(key)) return servicesMap[key] || DEFAULT_SITE_IMAGES.services[key];
  }
  return servicesMap.default || DEFAULT_SITE_IMAGES.services.default;
}

/** Merges custom admin photos over defaults */
export function mergeSiteMedia(custom?: Partial<SiteMedia> | null): SiteMedia {
  if (!custom) return DEFAULT_SITE_IMAGES;
  return {
    hero: custom.hero || DEFAULT_SITE_IMAGES.hero,
    transformation: {
      before: custom.transformation?.before || DEFAULT_SITE_IMAGES.transformation.before,
      after: custom.transformation?.after || DEFAULT_SITE_IMAGES.transformation.after,
    },
    detailEyes: custom.detailEyes || DEFAULT_SITE_IMAGES.detailEyes,
    detailPalette: custom.detailPalette || DEFAULT_SITE_IMAGES.detailPalette,
    detailJewellery: custom.detailJewellery || DEFAULT_SITE_IMAGES.detailJewellery,
    mehendi: custom.mehendi || DEFAULT_SITE_IMAGES.mehendi,
    services: {
      bridal: custom.services?.bridal || DEFAULT_SITE_IMAGES.services.bridal,
      engagement: custom.services?.engagement || DEFAULT_SITE_IMAGES.services.engagement,
      party: custom.services?.party || DEFAULT_SITE_IMAGES.services.party,
      destination: custom.services?.destination || DEFAULT_SITE_IMAGES.services.destination,
      default: custom.services?.default || DEFAULT_SITE_IMAGES.services.default,
    },
    cities: {
      jodhpur: custom.cities?.jodhpur || DEFAULT_SITE_IMAGES.cities.jodhpur,
      jaipur: custom.cities?.jaipur || DEFAULT_SITE_IMAGES.cities.jaipur,
      udaipur: custom.cities?.udaipur || DEFAULT_SITE_IMAGES.cities.udaipur,
      destination: custom.cities?.destination || DEFAULT_SITE_IMAGES.cities.destination,
    },
  };
}
