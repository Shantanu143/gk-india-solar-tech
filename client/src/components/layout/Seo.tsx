import { SITE_NAME, SITE_URL } from "@/config/seo";

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/residential-solar" — combined with SITE_URL for the canonical + og:url tags. */
  path: string;
  /** Set for pages with no standalone value to search (e.g. a post-submission success page). */
  noindex?: boolean;
}

/**
 * React 19 hoists <title>/<meta>/<link> tags rendered anywhere in the tree into <head> automatically,
 * so no head-management library is needed for this.
 */
export function Seo({ title, description, path, noindex }: SeoProps) {
  const url = `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
