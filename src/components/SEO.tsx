import { Helmet } from "react-helmet-async";
import { ReactNode } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  children?: ReactNode;
  keywords?: string;
  author?: string;
}

/**
 * SEO Component for managing document head metadata
 * Automatically adds Open Graph and Twitter Card tags
 * Ensure HelmetProvider wraps your app in App.tsx
 */
export const SEO = ({
  title,
  description,
  canonical,
  ogImage = "https://www.madverse-ks.page/logo.png",
  ogType = "website",
  keywords = "madverse, Peja, Kosovo, urban art, street art, youth programs, culture, sports, exhibitions, Organzation, Spots, Arts, Culture, Volunteering",
  author = "madverse",
  children,
}: SEOProps) => {
  const fullTitle = /madverse/i.test(title)
    ? title
    : `${title} | MADVERSE`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Madverse logo" />
      <meta property="og:site_name" content="Madverse" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="sq_XK" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Madverse logo" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="theme-color" content="#000000" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {children}
    </Helmet>
  );
};

export default SEO;
