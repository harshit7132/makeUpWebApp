import type { Metadata } from "next";
import CityPage from "../../components/site/CityPage";
import { getSiteMedia } from "../../lib/booking/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bridal Makeup Artist for Jaipur Weddings",
  description: "Makeovers by Prachi travels from Jodhpur for bridal and party makeup in Jaipur. Transparent travel fee, book online.",
};

export default async function Page() {
  const siteMedia = await getSiteMedia();
  return (
    <CityPage
      path="/jaipur"
      eyebrow="Jaipur"
      title="Bridal makeup for your Jaipur wedding"
      intro="We travel from Jodhpur to Jaipur for weddings and events, with the same team and products we use at home."
      cityKey="jaipur" bookCity="Jaipur"
      heroImage={siteMedia.cities.jaipur}
      highlights={[
        "Bridal, engagement and family makeup at your venue or hotel in Jaipur.",
        "A fixed travel fee, shown upfront before you pay anything.",
        "Plan early in peak season: we take one bride per day.",
        "Share your outfit and jewellery photos on WhatsApp before the day.",
      ]}
    />
  );
}
