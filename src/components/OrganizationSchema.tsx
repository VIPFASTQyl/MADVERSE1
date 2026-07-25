import { Helmet } from "react-helmet-async";

/**
 * OrganizationSchema Component
 * Adds JSON-LD structured data for Organization/NGO schema
 * This helps search engines understand what MADVERSE is and improves rich snippet display
 */
export const OrganizationSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.madverse-ks.page/#website",
        "url": "https://www.madverse-ks.page/",
        "name": "Madverse",
        "alternateName": ["MADVERSE", "madverse-ks.page"],
        "publisher": { "@id": "https://www.madverse-ks.page/#organization" },
        "inLanguage": ["sq", "en"]
      },
      {
        "@type": "NGO",
        "@id": "https://www.madverse-ks.page/#organization",
        "name": "Madverse",
        "url": "https://www.madverse-ks.page/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.madverse-ks.page/logo.png",
          "width": 1232,
          "height": 1080
        },
        "description": "Madverse is a youth-led organization and creative platform in Peja, Kosovo, supporting arts, culture, sports, volunteering, and community engagement.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Peja",
          "addressCountry": "Kosovo"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Kosovo"
        },
        "sameAs": [
          "https://www.instagram.com/madverse.ks/",
          "https://www.facebook.com/profile.php?id=61586336113573",
          "https://www.youtube.com/channel/UCbowHpyDkY6y6lmtkBgjK7w"
        ],
        "knowsAbout": ["Youth Programs", "Urban Art", "Culture", "Sports", "Volunteering", "Community Events"]
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

/**
 * Event Schema for Exhibitions
 * Use this component on exhibition pages to markup upcoming events
 */
export const EventSchema = ({
  name,
  description,
  startDate,
  endDate,
  location = "Peja, Kosovo",
  url = "https://www.madverse-ks.page/activity/exhibition",
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  url?: string;
}) => {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    "endDate": endDate,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Peja",
        "addressCountry": "Kosovo"
      }
    },
    "url": url,
    "organizer": {
      "@type": "Organization",
      "name": "MADVERSE",
      "url": "https://www.madverse-ks.page"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(eventSchema)}
      </script>
    </Helmet>
  );
};

/**
 * BreadcrumbSchema for Navigation
 * Use this to help search engines understand the page hierarchy
 */
export const BreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
