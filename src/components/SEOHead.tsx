import { useEffect } from 'react';

interface SEOHeadProps {
  /** Page title (will be appended with " | Scott Kunian") */
  title: string;
  /** Page description for meta tags and OpenGraph */
  description: string;
  /** Page type for OpenGraph (default: 'website') */
  type?: 'website' | 'article' | 'profile';
  /** Canonical URL (defaults to current page URL) */
  url?: string;
  /** Image URL for OpenGraph and Twitter cards */
  image?: string;
  /** Article-specific: published date */
  publishedTime?: string;
  /** Article-specific: modified date */
  modifiedTime?: string;
  /** Article-specific: author name */
  author?: string;
  /** Article-specific: tags/keywords */
  keywords?: string[];
}

/**
 * SEO and Meta Tags Component
 *
 * Manages document title, meta descriptions, OpenGraph, and Twitter Card tags
 * for improved SEO and social media sharing.
 *
 * @example
 * <SEOHead
 *   title="About Me"
 *   description="Learn about Scott Kunian's experience in IT and software development"
 *   type="profile"
 * />
 */
export function SEOHead({
  title,
  description,
  type = 'website',
  url,
  image,
  publishedTime,
  modifiedTime,
  author = 'Scott Kunian',
  keywords = [],
}: SEOHeadProps) {
  useEffect(() => {
    const appName = 'Scott Kunian';
    const fullTitle = `${title} | ${appName}`;
    const currentUrl = url || window.location.href;
    const defaultImage = image || `${window.location.origin}/og-image.png`;

    // Set document title
    document.title = fullTitle;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    if (keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }
    setMetaTag('author', author);

    // OpenGraph tags
    setMetaTag('og:title', fullTitle, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:type', type, 'property');
    setMetaTag('og:url', currentUrl, 'property');
    setMetaTag('og:image', defaultImage, 'property');
    setMetaTag('og:site_name', appName, 'property');

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', defaultImage);

    // Article-specific tags
    if (type === 'article') {
      setMetaTag('og:type', 'article', 'property');
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, 'property');
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime, 'property');
      }
      if (author) {
        setMetaTag('article:author', author, 'property');
      }
      if (keywords.length > 0) {
        keywords.forEach(tag => {
          const tagElement = document.createElement('meta');
          tagElement.setAttribute('property', 'article:tag');
          tagElement.setAttribute('content', tag);
          document.head.appendChild(tagElement);
        });
      }
    }

    // Cleanup function
    return () => {
      // Restore default title
      document.title = `${appName} - IT Professional`;
    };
  }, [title, description, type, url, image, publishedTime, modifiedTime, author, keywords]);

  // This component doesn't render anything
  return null;
}
