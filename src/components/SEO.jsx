import { useEffect } from 'react';

const DEFAULT_ORIGIN = 'https://evafertilitypune.com';
const DEFAULT_IMAGE = '/images/logo-optimized.jpg';

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
};

const setLink = (rel, href, extra = {}) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  Object.entries(extra).forEach(([key, value]) => element.setAttribute(key, value));
};

const absoluteUrl = (value, origin = DEFAULT_ORIGIN) => {
  if (!value) return origin;
  if (/^https?:\/\//i.test(value)) return value;
  return `${origin}${value.startsWith('/') ? value : `/${value}`}`;
};

function SEO({
  title,
  description,
  keywords = [],
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index, follow',
  locale = 'en_IN',
  siteName = 'Eva Fertility & Laparoscopy',
  author = 'Eva Fertility & Laparoscopy',
  publisher = 'Eva Fertility & Laparoscopy',
  twitterSite = '@evafertilitypune',
  schemas = [],
}) {
  useEffect(() => {
    const origin = process.env.REACT_APP_SITE_URL || DEFAULT_ORIGIN;
    const canonical = absoluteUrl(path, origin);
    const imageUrl = absoluteUrl(image, origin);
    const finalTitle = title || siteName;
    const finalDescription = description || 'Fertility, gynecology, IVF guidance, and advanced laparoscopy care in Thergaon, Pune.';

    document.title = finalTitle;
    document.documentElement.setAttribute('lang', locale.startsWith('hi') ? 'hi' : locale.startsWith('mr') ? 'mr' : 'en');

    setMeta('meta[charset]', { charset: 'utf-8' });
    setMeta('meta[name="viewport"]', { name: 'viewport', content: 'width=device-width, initial-scale=1' });
    setMeta('meta[name="description"]', { name: 'description', content: finalDescription });
    setMeta('meta[name="robots"]', { name: 'robots', content: robots });
    setMeta('meta[name="author"]', { name: 'author', content: author });
    setMeta('meta[name="publisher"]', { name: 'publisher', content: publisher });
    if (process.env.REACT_APP_GOOGLE_SITE_VERIFICATION) {
      setMeta('meta[name="google-site-verification"]', {
        name: 'google-site-verification',
        content: process.env.REACT_APP_GOOGLE_SITE_VERIFICATION,
      });
    }
    if (keywords.length) setMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });

    setLink('canonical', canonical);

    setMeta('meta[property="og:title"]', { property: 'og:title', content: finalTitle });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: finalDescription });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale });

    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: finalTitle });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: finalDescription });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
    setMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: twitterSite });

    document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());
    schemas.filter(Boolean).forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoJsonld = 'true';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [author, description, image, keywords, locale, path, publisher, robots, schemas, siteName, title, twitterSite, type]);

  return null;
}

export { DEFAULT_ORIGIN, DEFAULT_IMAGE, absoluteUrl };
export default SEO;
