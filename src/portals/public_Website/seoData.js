import { clinic, doctor, services } from './siteData';

export const siteUrl = process.env.REACT_APP_SITE_URL || 'https://evafertilitypune.com';
export const defaultImage = '/images/logo-optimized.jpg';

export const publicPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/articles', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/gallery', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/DrRaveendraGondhali', priority: '0.9', changefreq: 'monthly' },
];

const brandKeywords = [
  'Eva Fertility and Laparoscopy',
  'Eva Fertility & Laparoscopy',
  'Eva Fertility Pune',
  'Eva Fertility Thergaon',
  'Eva Fertility Pimpri Chinchwad',
  'Eva Fertility Maharashtra',
  'Eva Fertility India',
  'स्त्री क्लिनिक',
  'Stree Clinic Thergaon',
  'Silver Birch Hospital Thergaon gynecologist',
  'fertility clinic near me',
  'gynecologist near me',
  'best fertility clinic near me',
  'top fertility clinic near me',
  'best gynecology clinic near me',
];

const doctorKeywords = [
  'Dr Raveendra Gondhali',
  'Dr Ravendra Gondhali',
  'Dr Raveendra Gondhali Pune',
  'Dr Raveendra Gondhali Thergaon',
  'Dr Raveendra Gondhali gynecologist',
  'Dr Raveendra Gondhali IVF specialist',
  'best gynecologist in Thergaon',
  'top gynecologist in Thergaon',
  'best gynecologist in Pimpri Chinchwad',
  'top gynecologist in Pimpri Chinchwad',
  'best gynecologist in Pune',
  'top gynecologist in Pune',
  'best gynecologist in Maharashtra',
  'IVF specialist in Thergaon',
  'best IVF specialist in Thergaon',
  'top IVF specialist in Pune',
  'best IVF doctor in Pune',
  'best infertility specialist in Pune',
  'top infertility specialist in Maharashtra',
  'fertility doctor in Pune',
  'best fertility doctor in Pune',
  'top fertility doctor near me',
  'obstetrician in Thergaon',
  'best obstetrician in Pune',
];

const locationKeywords = [
  'fertility clinic in Thergaon',
  'fertility clinic in Pune',
  'fertility clinic in Maharashtra',
  'fertility clinic in India',
  'fertility clinic in Pimpri Chinchwad',
  'fertility clinic near Wakad',
  'fertility clinic near Hinjewadi',
  'fertility clinic near Chinchwad',
  'IVF clinic in Thergaon',
  'IVF clinic in Pune',
  'IVF clinic in Maharashtra',
  'IVF clinic in India',
  'best IVF clinic in Pune',
  'top IVF clinic in Pune',
  'best IVF clinic in Maharashtra',
  'top IVF clinic in Maharashtra',
  'best IVF centre in Pune',
  'top IVF centre in Pune',
  'gynecology clinic in Thergaon',
  'gynecology clinic in Wakad',
  'gynecology clinic in Pune',
  'gynecology clinic in Maharashtra',
  'gynecologist in Thergaon Pune',
  'gynecologist in Pimpri Chinchwad',
  'gynecologist in Wakad',
  'gynecologist in Pune Maharashtra',
  'gynecologist in Maharashtra India',
  'women clinic in Thergaon',
  'women clinic in Pune',
  'women clinic in Maharashtra',
  'ladies doctor in Thergaon',
  'ladies doctor in Pune',
  'ladies doctor near Wakad',
  'best ladies doctor in Pune',
  'top ladies doctor in Pimpri Chinchwad',
  'female health clinic Pune',
  'female health clinic Maharashtra',
  'best women health clinic in Pune',
  'top women health clinic in Thergaon',
];

const serviceKeywords = [
  'fertility evaluation',
  'best fertility evaluation clinic',
  'infertility treatment',
  'best infertility treatment in Pune',
  'top infertility treatment in Pune',
  'infertility specialist',
  'best infertility specialist near me',
  'female infertility treatment',
  'male infertility guidance',
  'couple infertility consultation',
  'IVF consultation',
  'best IVF consultation in Pune',
  'top IVF consultation near me',
  'IUI treatment guidance',
  'best IUI treatment guidance',
  'IVF treatment guidance',
  'ovulation induction',
  'follicular monitoring',
  'best follicular monitoring clinic',
  'ovulation tracking',
  'PCOS treatment',
  'best PCOS doctor in Pune',
  'top PCOS specialist near me',
  'PCOD treatment',
  'best PCOD treatment in Pune',
  'irregular periods treatment',
  'best doctor for irregular periods',
  'menstrual health doctor',
  'pregnancy planning',
  'best pregnancy planning doctor',
  'preconception counseling',
  'antenatal care',
  'best antenatal care in Pune',
  'high risk pregnancy consultation',
  'best high risk pregnancy doctor',
  'laparoscopy gynecology',
  'best laparoscopy gynecologist in Pune',
  'top laparoscopy doctor in Maharashtra',
  'hysteroscopy treatment',
  'best hysteroscopy doctor in Pune',
  'endometriosis treatment',
  'best endometriosis specialist in Pune',
  'fibroid treatment',
  'best fibroid treatment in Pune',
  'ovarian cyst treatment',
  'best ovarian cyst doctor in Pune',
  'uterine cavity assessment',
  'best uterine cavity assessment before IVF',
];

const articleKeywords = [
  'fertility articles',
  'IVF articles',
  'gynecology articles',
  'women health articles',
  'fertility research',
  'gynecology research',
  'endometriosis research',
  'endometriosis pain',
  'painful periods',
  'pelvic pain',
  'painful intercourse',
  'unicornuate uterus pregnancy',
  'uterine anomaly pregnancy',
  'uterine cavity assessment before IVF',
  '3D ultrasound before IVF',
  'office hysteroscopy before IVF',
  'cystourethroscopy gynecology surgery',
  'laparoscopy safety',
  'patient education fertility',
];

const appointmentKeywords = [
  'book gynecologist appointment',
  'book fertility appointment',
  'book IVF consultation',
  'book best gynecologist appointment Pune',
  'book top IVF doctor appointment Pune',
  'book fertility doctor appointment near me',
  'appointment with gynecologist Pune',
  'gynecology appointment Thergaon',
  'gynecology appointment Pimpri Chinchwad',
  'gynecology appointment Wakad',
  'fertility consultation appointment',
  'online appointment fertility clinic',
  'online appointment gynecologist Pune',
];

const uniqueKeywords = (...groups) => Array.from(new Set(groups.flat().filter(Boolean)));

export const seoPages = {
  '/': {
    title: 'Eva Fertility & Laparoscopy | IVF, Fertility & Gynecology Clinic in Thergaon Pune',
    description: 'Eva Fertility & Laparoscopy offers fertility evaluation, IVF/IUI guidance, PCOS care, pregnancy support, hysteroscopy, and laparoscopy care with Dr. Raveendra Gondhali in Thergaon, Pune.',
    keywords: uniqueKeywords(brandKeywords, doctorKeywords, locationKeywords, serviceKeywords.slice(0, 18)),
  },
  '/about': {
    title: 'About Eva Fertility & Laparoscopy | Dr. Raveendra Gondhali',
    description: 'Learn about Eva Fertility & Laparoscopy and specialist fertility, obstetrics, gynecology, IVF, and minimally invasive care led by Dr. Raveendra Gondhali.',
    keywords: uniqueKeywords(brandKeywords, doctorKeywords, ['OBGYN IVF specialist Pune', 'consultant obstetrician Pune', 'experienced gynecologist Pune']),
  },
  '/services': {
    title: 'Fertility, IVF, PCOS, Pregnancy & Laparoscopy Services | Eva Fertility Pune',
    description: 'Explore fertility evaluation, ovulation monitoring, IVF/IUI guidance, PCOS/PCOD care, antenatal care, laparoscopy, and hysteroscopy services.',
    keywords: uniqueKeywords(services.map((service) => service.title), serviceKeywords, locationKeywords, doctorKeywords.slice(0, 5)),
  },
  '/articles': {
    title: 'Fertility & Gynecology Articles | Eva Fertility & Laparoscopy',
    description: 'Patient-friendly fertility, gynecology, IVF, laparoscopy, and research-based women health articles from Eva Fertility & Laparoscopy.',
    keywords: uniqueKeywords(articleKeywords, serviceKeywords.slice(0, 12), ['IVF education', 'patient education', 'fertility awareness']),
  },
  '/blog': {
    title: 'Fertility Blog | Eva Fertility & Laparoscopy',
    description: 'Read patient-friendly fertility, IVF, pregnancy, gynecology, and laparoscopy blog articles.',
    keywords: uniqueKeywords(['fertility blog', 'IVF blog Pune', 'gynecology blog', 'women health blog Pune'], articleKeywords),
  },
  '/gallery': {
    title: 'Clinic Gallery | Eva Fertility & Laparoscopy Thergaon',
    description: 'View Eva Fertility & Laparoscopy clinic spaces, care areas, and video walkthrough before your visit.',
    keywords: uniqueKeywords(['Eva Fertility gallery', 'clinic Thergaon', 'fertility clinic photos', 'gynecology clinic photos', 'clinic video walkthrough'], brandKeywords, locationKeywords.slice(0, 6)),
  },
  '/contact': {
    title: 'Book Appointment | Eva Fertility & Laparoscopy Thergaon Pune',
    description: 'Book an appointment for fertility consultation, IVF/IUI guidance, gynecology, PCOS, pregnancy care, laparoscopy, or hysteroscopy.',
    keywords: uniqueKeywords(appointmentKeywords, brandKeywords, locationKeywords, serviceKeywords.slice(0, 12)),
  },
  '/DrRaveendraGondhali': {
    title: 'Dr. Raveendra Gondhali | IVF Specialist & Gynecologist in Thergaon Pune',
    description: 'Digital profile for Dr. Raveendra Gondhali, Consultant Obstetrician, Gynaecologist and IVF Specialist at Eva Fertility & Laparoscopy, Thergaon, Pune.',
    keywords: uniqueKeywords(doctorKeywords, brandKeywords, locationKeywords, serviceKeywords),
  },
};

export const getArticleSeo = (article) => ({
  title: `${article.title} | Eva Fertility & Laparoscopy`,
  description: article.excerpt,
  keywords: uniqueKeywords([article.category, article.title], articleKeywords, serviceKeywords.slice(0, 14), doctorKeywords.slice(0, 4)),
  type: 'article',
});

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: clinic.name,
  url: siteUrl,
  logo: `${siteUrl}/images/logo-optimized.jpg`,
  sameAs: clinic.socials.map((social) => social.href),
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: clinic.phone,
    contactType: 'appointments',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Marathi'],
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: clinic.name,
  url: siteUrl,
  publisher: organizationSchema,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/articles?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const medicalClinicSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: clinic.name,
  alternateName: clinic.localName,
  url: siteUrl,
  image: `${siteUrl}/images/logo-optimized.jpg`,
  telephone: clinic.phone,
  email: clinic.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Silver Birch Multispeciality Hospital, Datta Mandir Road, Thergaon',
    addressLocality: 'Pimpri-Chinchwad',
    addressRegion: 'Maharashtra',
    postalCode: '411033',
    addressCountry: 'IN',
  },
  medicalSpecialty: ['Gynecologic', 'Obstetric', 'ReproductiveMedicine'],
  openingHours: 'Mo-Sa 09:00-21:00',
};

export const doctorSchema = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: doctor.name,
  medicalSpecialty: ['Obstetrics', 'Gynecology', 'ReproductiveMedicine'],
  worksFor: medicalClinicSchema,
  affiliation: medicalClinicSchema,
  url: `${siteUrl}/DrRaveendraGondhali`,
};

export const webPageSchema = ({ path, title, description }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: `${siteUrl}${path}`,
  isPartOf: websiteSchema,
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`,
  })),
});

export const articleSchema = (article, path) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.image,
  author: {
    '@type': 'Person',
    name: doctor.name,
  },
  publisher: organizationSchema,
  mainEntityOfPage: `${siteUrl}${path}`,
});
