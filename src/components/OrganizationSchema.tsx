import { Helmet } from "react-helmet-async";

/**
 * OrganizationSchema Component
 * Adds JSON-LD structured data for Organization/NGO schema
 * This helps search engines understand what MADVERSE is and improves rich snippet display
 */
export const OrganizationSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "MADVERSE",
    "url": "https://www.madverse-ks.page",
    "logo": "https://www.madverse-ks.page/MADVESERlong.png",
    "description": "MADVERSE is a dynamic organization in Peja, Kosovo dedicated to youth empowerment, urban art, culture, sports, and community exhibitions.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Peja",
      "addressLocality": "Peja",
      "addressCountry": "Kosovo",
      "postalCode": "30000"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "General Inquiries",
      "url": "https://www.madverse-ks.page/contact"
    },
    "sameAs": [
      "https://www.facebook.com/madverse",
      "https://www.instagram.com/madverse"
    ],
    "founder": {
      "@type": "Organization",
      "name": "MADVERSE Team"
    },
    "knowsAbout": [
      "Youth Programs",
      "Urban Art",
      "Street Art",
      "Culture",
      "Sports",
      "Community Exhibitions",
      "Arts and Entertainment"
    ],
    "awards": "Community Organization of Peja, Kosovo"
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
