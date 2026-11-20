import Link from "next/link";
import React from "react";
import { ArrowRight, Quote, Star } from "lucide-react";
import FadeImg from "../components/site/FadeImg";
import GalleryGrid from "../components/site/GalleryGrid";
import ParallaxApproach from "../components/site/ParallaxApproach";
import ParallaxCities from "../components/site/ParallaxCities";
import ParallaxHero from "../components/site/ParallaxHero";
import ParallaxMetrics from "../components/site/ParallaxMetrics";
import ServiceCard from "../components/site/ServiceCard";
import { getPublicConfig, getSiteMedia, getGalleryItems, getApprovedReviews } from "../lib/booking/server";
import { formatEventDate, whatsappLink } from "../lib/booking/types";

export const dynamic = "force-dynamic";

const STEPS = [
  { title: "Pick your service & date", text: "Choose a package and see which dates are free. We take one bride per day." },
  { title: "Pay a small deposit by UPI", text: "Scan the QR or open your UPI app, then upload the screenshot and UTR." },
  { title: "Get confirmed", text: "We verify the payment and confirm your booking. Track it online any time." },
];

export default async function HomePage() {
  const [{ services, settings }, siteMedia, gallery, reviews] = await Promise.all([
    getPublicConfig(),
    getSiteMedia(),
    getGalleryItems(),
    getApprovedReviews(6),
  ]);

  const featured = services.slice(0, 3);
  const wa = whatsappLink(settings.whatsappNumber, "Hi Prachi, I'd like to know more about bridal makeup.");

  return (
    <main>
      {/* ---------------- 1. Parallax Hero Section (with dynamic admin photos) ---------------- */}
      <ParallaxHero
        beforeImage={siteMedia.transformation.before}
        afterImage={siteMedia.transformation.after}
      />

      {/* ---------------- 2. Parallax Trust & Metrics Strip ---------------- */}
      <ParallaxMetrics />

      {/* ---------------- 3. Featured Services ---------------- */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <div>
              <p className="eyebrow eyebrow-line">Services</p>
              <h2 className="h-display mt-3 text-4xl sm:text-5xl">Looks for every celebration</h2>
            </div>
            <Link href="/services" className="link-gold text-sm font-medium">
              All services &amp; prices <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((s, i) => (
                <ServiceCard key={s.id} service={s} delay={i * 80} />
              ))}
            </div>
          ) : (
            <p className="alert-info mt-10">
              Prices on request. Our service list is being updated, so please{" "}
              <Link href="/contact" className="font-semibold underline">
                contact us
              </Link>{" "}
              for a quote.
            </p>
          )}
        </div>
      </section>

      {/* ---------------- 4. Portfolio & Lookbook (Multi-photo carousels per look) ---------------- */}
      <section className="section bg-ivory/50 border-y border-sand/60">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <div>
              <p className="eyebrow eyebrow-line">Portfolio &amp; Lookbook</p>
              <h2 className="h-display mt-3 text-3xl sm:text-4xl text-plum">
                Swipe through real bride creations
              </h2>
              <p className="mt-2 text-sm text-muted max-w-xl">
                Each celebration features multi-photo carousels &mdash; explore HD base prep, eye sculpting, heirloom jewellery, and bridal poshak drapes.
              </p>
            </div>
            <Link href="/gallery" className="link-gold text-sm font-medium">
              Explore full gallery <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6" data-reveal>
            <GalleryGrid items={gallery.slice(0, 6)} />
          </div>
        </div>
      </section>

      {/* ---------------- 5. Verified Client Reviews (Customer Word of Mouth) ---------------- */}
      {reviews.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
              <div>
                <p className="eyebrow eyebrow-line">Reviews</p>
                <h2 className="h-display mt-3 text-4xl sm:text-5xl">Kind words from our brides</h2>
              </div>
              <Link href="/reviews" className="link-gold text-sm font-medium">
                Read all reviews <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 3).map((r, i) => (
                <article
                  key={r.id}
                  className="card p-6 sm:p-7 flex flex-col justify-between shadow-soft hover:shadow-lift transition-shadow"
                  data-reveal
                  data-reveal-delay={i * 80}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex gap-0.5 text-gold">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${s <= r.rating ? "fill-gold text-gold" : "fill-sand text-sand"}`}
                          />
                        ))}
                      </span>
                      <Quote className="h-6 w-6 text-gold/30" />
                    </div>
                    <blockquote className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-plum">
                      &ldquo;{r.text}&rdquo;
                    </blockquote>
                  </div>
                  <footer className="mt-5 flex items-center gap-3 border-t border-sand/70 pt-4 text-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush font-serif text-base font-semibold text-gold-dark">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <span className="block font-semibold text-plum">{r.name}</span>
                      <span className="block text-xs text-muted">
                        {[r.eventType, r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date) ? formatEventDate(r.date) : r.date]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 6. Sticky Scrollytelling Approach ---------------- */}
      <ParallaxApproach />

      {/* ---------------- 7. How booking works ---------------- */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="eyebrow">How booking works</p>
            <h2 className="h-display mt-3 text-4xl sm:text-5xl">Secure your date in minutes</h2>
          </div>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8 md:before:absolute md:before:left-[16%] md:before:right-[16%] md:before:top-7 md:before:h-px md:before:bg-gradient-to-r md:before:from-transparent md:before:via-gold/50 md:before:to-transparent md:before:content-['']">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative text-center" data-reveal data-reveal-delay={i * 100}>
                <span className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-ivory font-serif text-xl font-semibold text-gold-dark shadow-soft">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted" data-reveal>
            A {settings.depositPercent}% deposit reserves your date. It&apos;s held for {settings.holdMinutes} minutes while
            you complete the UPI payment.
          </p>
          <div className="mt-8 text-center" data-reveal>
            <Link href="/book" className="btn-dark px-7 shadow-luxury transition-transform duration-300 hover:scale-[1.02]">
              Start booking <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 8. Parallax Cities & Destinations ---------------- */}
      <ParallaxCities />

      {/* ---------------- 9. CTA ---------------- */}
      <section className="container-page pb-20">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-plum px-6 py-14 text-center text-white sm:px-12 sm:py-20 shadow-2xl" data-reveal>
          <FadeImg src={siteMedia.mehendi} alt="" sizes="1100px" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-plum-dark/95 via-plum/85 to-plum-light/75" />
          <p className="eyebrow text-gold-light">Questions first?</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-4xl font-medium sm:text-5xl">Let&apos;s talk about your day</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Message us about looks, trials, timings or destination travel and we&apos;ll get back to you immediately.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary px-7 shadow-luxury transition-transform duration-300 hover:scale-[1.02]">
                Chat on WhatsApp
              </a>
            )}
            <Link href="/contact" className="btn-light px-7 transition-transform duration-300 hover:scale-[1.02]">
              Contact details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
