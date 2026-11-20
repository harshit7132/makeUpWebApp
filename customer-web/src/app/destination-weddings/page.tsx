import type { Metadata } from "next";
import CityPage from "../../components/site/CityPage";
import { getSiteMedia } from "../../lib/booking/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Destination Wedding Makeup",
  description: "Destination wedding makeup by Makeovers by Prachi across Rajasthan and India. Tell us your venue and dates for a quote.",
};

export default async function Page() {
  const siteMedia = await getSiteMedia();
  return (
    <CityPage
      path="/destination-weddings"
      eyebrow="Destination weddings"
      title="Makeup for destination weddings, wherever you celebrate"
      intro="Planning a wedding away from home? Tell us your venue, dates and functions and we will plan travel and timings with you."
      cityKey="other" bookCity="Other"
      heroImage={siteMedia.cities.destination}
      highlights={[
        "Coverage for multiple functions: mehendi, sangeet, wedding and reception.",
        "Travel and stay planned around your schedule.",
        "Book online with the Other city option, or message us first for a custom quote.",
        "We serve Jodhpur, Jaipur and Udaipur too.",
      ]}
    />
  );
}
