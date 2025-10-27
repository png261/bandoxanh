import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  keywords?: string[];
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = '/og-image.png',
  ogType = 'website',
  noindex = false,
  keywords = [],
}: SEOProps) {
  const siteName = 'BandoXanh';
  const fullTitle = `${title} | ${siteName}`;
  const defaultKeywords = ['tái chế', 'môi trường', 'bảo vệ môi trường', 'Việt Nam'];
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="author" content="BandoXanh Team" />
      <meta name="language" content="Vietnamese" />
      <meta httpEquiv="content-language" content="vi" />
    </Head>
  );
}
