import {
  Activity,
  Baby,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from 'lucide-react';

export const clinic = {
  name: 'Eva Fertility & Laparoscopy',
  tagline: 'Fertility, women care, and advanced laparoscopy',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'care@evafertility.in',
  address: 'Eva Fertility & Laparoscopy, Silver Birch Multispeciality Hospital, Datta Mandir Road, Thergaon, Pimpri-Chinchwad, Pune 411033',
  hours: 'Mon-Sat, 8:00 AM - 8:00 PM',
  emergency: 'Compassionate fertility and gynecology care',
  socials: [
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
};

export const services = [
  {
    title: 'Fertility Consultation',
    description: 'Personalized evaluation, ovulation tracking, fertility planning, and couple counseling.',
    icon: Stethoscope,
  },
  {
    title: 'IVF and IUI Guidance',
    description: 'Step-by-step support for assisted conception options, investigations, and treatment cycles.',
    icon: HeartPulse,
  },
  {
    title: 'Fertility Diagnostics',
    description: 'Hormonal workup, ultrasound coordination, semen analysis guidance, and report review.',
    icon: Microscope,
  },
  {
    title: 'Laparoscopic Surgery',
    description: 'Minimally invasive care for cysts, fibroids, endometriosis, and gynecological conditions.',
    icon: Activity,
  },
  {
    title: 'Pregnancy Planning',
    description: 'Preconception care, early pregnancy advice, risk review, and continued guidance.',
    icon: Baby,
  },
  {
    title: 'Women Wellness',
    description: 'Menstrual health, PCOS care, menopause counseling, and routine gynecology visits.',
    icon: ShieldCheck,
  },
];

export const highlights = [
  { label: 'Years of focused care', value: '10+' },
  { label: 'Families guided', value: '8k+' },
  { label: 'Care pathways', value: '12+' },
  { label: 'Average rating', value: '4.8/5' },
];

export const carePromises = [
  { title: 'Sensitive counseling', icon: HeartPulse, text: 'Private, respectful conversations for couples and women at every stage.' },
  { title: 'Clear treatment steps', icon: Activity, text: 'Structured plans for investigations, cycles, procedures, and follow-up care.' },
  { title: 'Safe procedures', icon: Syringe, text: 'Sterile clinical workflows and careful guidance before and after treatment.' },
];

export const articles = [
  {
    slug: 'prepare-for-your-first-fertility-consultation',
    title: 'How to prepare for your first fertility consultation',
    category: 'Fertility Guide',
    date: 'July 02, 2026',
    readTime: '4 min read',
    excerpt: 'A simple checklist of cycle history, reports, medicines, and questions to bring to your visit.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'ovulation-cycle-tracking',
    title: 'Understanding ovulation windows and cycle tracking',
    category: 'Fertility Basics',
    date: 'June 18, 2026',
    readTime: '5 min read',
    excerpt: 'Learn how cycle patterns, symptoms, and testing can help plan your next consultation.',
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'laparoscopy-in-gynecology-care',
    title: 'When laparoscopy is advised in gynecology care',
    category: 'Laparoscopy',
    date: 'May 27, 2026',
    readTime: '3 min read',
    excerpt: 'Understand how minimally invasive evaluation can support diagnosis and treatment planning.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
  },
];

export const galleryItems = [
  {
    type: 'image',
    title: 'Warm reception and patient help desk',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    type: 'image',
    title: 'Private consultation room',
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
  },
  {
    type: 'image',
    title: 'Fertility diagnostics support',
    src: 'https://images.unsplash.com/photo-1581093458791-9d42f4c761cf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    type: 'video',
    title: 'Eva clinic care walkthrough',
    src: 'https://www.youtube.com/embed/1APwq1df6Mw',
  },
];
