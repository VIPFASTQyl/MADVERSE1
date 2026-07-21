import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Volunteering = () => (
  <ActivityFeaturePage
    activeHref="/activity/volunteering"
    titleKey="volunteeringTitle"
    seoDescription="Make a difference with MADVERSE. Join our volunteer community supporting youth, arts, and cultural programs in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/volunteering"
    ogImage="https://www.madverse-ks.page/og-volunteering.png"
    accentColor="#22C55E"
    sections={[
      {
        labelKey: "communityImpact",
        descriptionKey: "communityImpactDesc",
        image: "/volunteering-1.jpeg",
      },
      {
        labelKey: "volunteeringTitle",
        titleKey: "youthEmpowerment",
        descriptionKey: "youthEmpowermentDesc",
        image: "/volunteering-2.jpeg",
      },
      {
        labelKey: "volunteeringTitle",
        titleKey: "socialCause",
        descriptionKey: "socialCauseDesc",
        image: "/volunteering-3.jpeg",
      },
      {
        labelKey: "volunteeringTitle",
        titleKey: "publicArtAction",
        descriptionKey: "publicArtActionDesc",
        image: "/volunteering-6.jpeg",
      },
      {
        labelKey: "volunteeringTitle",
        titleKey: "volunteerLegacy",
        descriptionKey: "volunteerLegacyDesc",
        image: "/volunteering-7.jpeg",
      },
    ]}
  />
);

export default Volunteering;
