import {
  Activity,
  Baby,
  Bone,
  Brain,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from 'lucide-react';

export const clinic = {
  name: 'Aarogya Care Hospital',
  tagline: 'Family healthcare with specialist support',
  phone: '+91 98765 43210',
  email: 'care@aarogyahospital.in',
  address: '12 Wellness Avenue, Hyderabad, Telangana',
  hours: 'Mon-Sat, 8:00 AM - 8:00 PM',
  emergency: '24/7 emergency support',
  socials: [
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
};

export const services = [
  {
    title: 'General Medicine',
    description: 'Everyday consultations, fever care, chronic disease reviews, and preventive health checks.',
    icon: Stethoscope,
  },
  {
    title: 'Cardiology',
    description: 'Heart risk evaluation, ECG review, blood pressure management, and follow-up care.',
    icon: HeartPulse,
  },
  {
    title: 'Diagnostics',
    description: 'Lab tests, imaging coordination, and fast reporting for informed treatment plans.',
    icon: Microscope,
  },
  {
    title: 'Orthopedics',
    description: 'Joint pain, fracture follow-up, physiotherapy planning, and mobility care.',
    icon: Bone,
  },
  {
    title: 'Pediatrics',
    description: 'Child wellness visits, vaccination guidance, growth tracking, and acute illness care.',
    icon: Baby,
  },
  {
    title: 'Neurology Care',
    description: 'Headache, nerve pain, seizure follow-up, and referral-based neurological support.',
    icon: Brain,
  },
];

export const highlights = [
  { label: 'Experienced doctors', value: '25+' },
  { label: 'Patients served', value: '18k+' },
  { label: 'Diagnostics available', value: '40+' },
  { label: 'Average rating', value: '4.8/5' },
];

export const carePromises = [
  { title: 'Transparent care', icon: ShieldCheck, text: 'Clear diagnosis notes, treatment steps, and billing communication.' },
  { title: 'Fast appointments', icon: Activity, text: 'Same-day and next-day consultation slots for most specialties.' },
  { title: 'Safe procedures', icon: Syringe, text: 'Sterile clinical workflows and careful medication guidance.' },
];

export const articles = [
  {
    slug: 'prepare-for-your-first-consultation',
    title: 'How to prepare for your first clinic consultation',
    category: 'Patient Guide',
    date: 'July 02, 2026',
    readTime: '4 min read',
    excerpt: 'A simple checklist of records, questions, medicines, and symptoms to bring to your doctor visit.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'blood-pressure-basics',
    title: 'Blood pressure basics every family should know',
    category: 'Heart Health',
    date: 'June 18, 2026',
    readTime: '5 min read',
    excerpt: 'Understand healthy ranges, warning signs, lifestyle habits, and when to book a medical review.',
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'seasonal-fever-care',
    title: 'Seasonal fever care: when home care is not enough',
    category: 'General Health',
    date: 'May 27, 2026',
    readTime: '3 min read',
    excerpt: 'Learn which symptoms need clinical attention and how diagnostics help guide treatment safely.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
  },
];

export const galleryItems = [
  {
    type: 'image',
    title: 'Reception and patient help desk',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    type: 'image',
    title: 'Consultation room',
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
  },
  {
    type: 'image',
    title: 'Diagnostics area',
    src: 'https://images.unsplash.com/photo-1581093458791-9d42f4c761cf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    type: 'video',
    title: 'Clinic care walkthrough',
    src: 'https://www.youtube.com/embed/1APwq1df6Mw',
  },
];
