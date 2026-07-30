const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://evafertilitypune.com';
const lastmod = new Date().toISOString().slice(0, 10);

const routes = [
  ['/', 'weekly', '1.0'],
  ['/about', 'monthly', '0.8'],
  ['/services', 'monthly', '0.9'],
  ['/articles', 'weekly', '0.8'],
  ['/blog', 'weekly', '0.8'],
  ['/blog/endometriosis-and-intimate-health', 'monthly', '0.7'],
  ['/blog/unicornuate-uterus-and-pregnancy', 'monthly', '0.7'],
  ['/blog/uterine-cavity-assessment-before-ivf', 'monthly', '0.7'],
  ['/blog/cystourethroscopy-in-gynecological-surgery', 'monthly', '0.7'],
  ['/gallery', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.9'],
  ['/DrRaveendraGondhali', 'monthly', '0.9'],
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([route, changefreq, priority]) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${routes.length} URLs`);
