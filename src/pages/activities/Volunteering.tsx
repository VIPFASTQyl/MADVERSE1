import ActivityFeaturePage from "@/components/ActivityFeaturePage";

const Volunteering = () => (
  <ActivityFeaturePage
    activeHref="/activity/volunteering"
    titleKey="volunteeringTitle"
    seoDescription="Make a difference with MADVERSE. Join our volunteer community supporting youth, arts, and cultural programs in Peja, Kosovo."
    canonical="https://www.madverse-ks.page/activity/volunteering"
    ogImage="https://www.madverse-ks.page/og-volunteering.png"
    sections={[
      {
        labelKey: "communityImpact",
        descriptionKey: "communityImpactDesc",
        image: "/project-3.jpg",
      },
      {
        labelKey: "volunteeringTitle",
        titleKey: "youthEmpowerment",
        descriptionKey: "youthEmpowermentDesc",
        image: "/featured2nd.JPG",
      },
    ]}
  />
);

export default Volunteering;
