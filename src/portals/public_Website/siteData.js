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
  name: 'Eva Fertility & Laparoscopy (स्त्री क्लिनिक)',
  tagline: 'Family healthcare with specialist support',
  phone: '+91 7066104777',
  email: 'evafertilitypune@gmail.com',
  address: 'Eva Fertility & Laparoscopy (स्त्री क्लिनिक),Silver Birch Multispeciality Hospital, Datta Mandir Road, Thergaon, Pimpri-Chinchwad, Pune  411033',
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

export const successStories = [
  {
    initials: 'A.P.',
    location: 'Thergaon',
    careType: 'Fertility guidance',
    rating: 5,
    title: 'Clear counseling from the first visit',
    quote: 'The consultation felt private and calm. Reports were explained clearly, and we understood the next steps without confusion.',
    result: 'Structured fertility evaluation and follow-up plan',
  },
  {
    initials: 'S.K.',
    location: 'Pimpri-Chinchwad',
    careType: 'Laparoscopy care',
    rating: 5,
    title: 'Confidence before procedure planning',
    quote: 'The doctor explained why laparoscopy was advised, what to expect, and how recovery would be monitored.',
    result: 'Procedure counseling with careful recovery guidance',
  },
  {
    initials: 'M.R.',
    location: 'Wakad',
    careType: 'Pregnancy planning',
    rating: 5,
    title: 'Supportive follow-up care',
    quote: 'Appointments, medicines, and review dates were explained in simple language. It helped us feel more prepared.',
    result: 'Personalized care plan and review schedule',
  },
];

export const articles = [
  {
    slug: 'prepare-for-your-first-consultation',
    title: 'How to prepare for your first clinic consultation',
    category: 'Patient Guide',
    date: 'July 02, 2026',
    readTime: '4 min read',
    excerpt: 'A simple checklist of records, questions, medicines, and symptoms to bring to your doctor visit.',
    image: '/images/seo/DrRaveendraGondhali.jpeg',
  },
  {
    slug: 'blood-pressure-basics',
    title: 'Blood pressure basics every family should know',
    category: 'Heart Health',
    date: 'June 18, 2026',
    readTime: '5 min read',
    excerpt: 'Understand healthy ranges, warning signs, lifestyle habits, and when to book a medical review.',
    image: '/images/seo/BeforeIVF_why_uterine_cavity_assessment.png',
  },
  {
    slug: 'seasonal-fever-care',
    title: 'Seasonal fever care: when home care is not enough',
    category: 'General Health',
    date: 'May 27, 2026',
    readTime: '3 min read',
    excerpt: 'Learn which symptoms need clinical attention and how diagnostics help guide treatment safely.',
    image: '/images/seo/Endometriosis_and_intimate_health.png',
  },
];

export const galleryItems = [
  {
    type: 'image',
    title: 'Warm reception and patient help desk',
    src: '/images/seo/warm-reception-patient-help-desk.jpg',
  },
  {
    type: 'image',
    title: 'Fertility diagnostics support',
    src: '/images/seo/fertility-diagnostics-support.jpg',
  },
  {
    type: 'image',
    title: 'Private consultation room',
    src: '/images/seo/private-consultation-room.jpg',
  },
  {
    type: 'walkthrough',
    title: 'Eva Fertility & Laparoscopy (स्त्री क्लिनिक) walkthrough',
    src: '/images/logo-optimized.jpg',
  },
];

export const doctor = {
  name: 'Dr. Raveendra Gondhali',
  role: 'Consultant Obstetrician, Gynaecologist & IVF Specialist',
  qualifications: 'MBBS, MS (OBGY), F. MAS',
  experience: '25+ years',
  photoUrl: '/images/seo/DrRaveendraGondhali.jpeg',
  note: 'Patient-first consultation with clear counseling, privacy, and structured follow-up.',
  conferencesAttended: [
    {
      title: 'Fertility Carnival',
      location: 'Goa',
      year: 'Oct 2025',
      role: 'Attended',
    },
    {
      title: 'Urogynaec',
      location: 'Ahmedabad, Gujarat',
      year: '2015, 2016, 2017',
      role: 'Organising committee, speaker and panellist',
    },
    {
      title: 'STAR',
      location: 'Pune, Maharashtra',
      year: '2018',
      role: 'Speaker and chairperson',
    },
    {
      title: 'Yuva FOGSI East Zone',
      location: 'Gangtok, Sikkim',
      year: '2018',
      role: 'Visiting faculty',
    },
  ],
  expertise: [
    'Fertility evaluation and infertility treatment',
    'IVF and IUI guidance',
    'Ovulation induction and monitoring',
    'PCOS and menstrual health care',
    'Diagnostic and operative laparoscopy',
    'Hysteroscopy diagnosis and treatment',
    'Pregnancy care and antenatal support',
  ],
};

Object.assign(clinic, {
  name: 'Eva Fertility & Laparoscopy',
  localName: '(स्त्री क्लिनिक)',
  tagline: 'Fertility, women care, and advanced laparoscopy',
  whatsapp: '918605470491',
  email: 'evafertilitypune@gmail.com',
  address: 'Eva Fertility & Laparoscopy, Silver Birch Multispeciality Hospital, Datta Mandir Road, Thergaon, Pimpri-Chinchwad, Pune 411033',
  mapsUrl: 'https://maps.app.goo.gl/UyErkwtNR8UaDQCC6',
  hours: 'Mon-Sat by appointment and evening OPD; Sunday by appointment',
  emergency: 'Compassionate fertility and gynecology care',
  website: 'https://evafertilitypune.com',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/evafertilitypune' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/18H2VYdFke/?mibextid=wwXIfr' },
    { label: 'YouTube', href: 'https://m.youtube.com/@evafertilitypune' },
    { label: 'Google', href: 'https://share.google/1zRkyyY6Q2zjwdlnD' },
  ],
});

services.splice(
  0,
  services.length,
  {
    title: 'Fertility Evaluation',
    description: 'Couple-focused assessment, cycle history review, report interpretation, and a clear treatment roadmap.',
    icon: Stethoscope,
  },
  {
    title: 'Ovulation Induction & Monitoring',
    description: 'Medication-guided ovulation support, follicular monitoring, timing guidance, and follow-up review.',
    icon: HeartPulse,
  },
  {
    title: 'IUI / IVF Guidance',
    description: 'Step-by-step counseling for assisted conception, investigations, cycle planning, and treatment support.',
    icon: Microscope,
  },
  {
    title: 'PCOS / PCOD Care',
    description: 'Personalized care for irregular periods, hormonal imbalance, fertility concerns, and lifestyle planning.',
    icon: Activity,
  },
  {
    title: 'Pregnancy & Antenatal Care',
    description: 'Preconception counseling, early pregnancy advice, antenatal visits, and risk review.',
    icon: Baby,
  },
  {
    title: 'Laparoscopy & Hysteroscopy',
    description: 'Minimally invasive evaluation and treatment for selected gynecological and fertility-related conditions.',
    icon: Syringe,
  }
);

highlights.splice(
  0,
  highlights.length,
  { label: 'Years of experience', value: doctor.experience },
  { label: 'Focused specialties', value: 'OBGYN + IVF' },
  { label: 'Care pathways', value: `${doctor.expertise.length}+` },
  { label: 'Location', value: 'Thergaon' }
);

carePromises.splice(
  0,
  carePromises.length,
  { title: 'Specialist-led care', icon: ShieldCheck, text: 'Consultation guided by obstetrics, gynecology, infertility, IVF, and minimally invasive surgery experience.' },
  { title: 'Clear treatment steps', icon: Activity, text: 'Structured plans for investigations, ovulation tracking, treatment cycles, procedures, and follow-up.' },
  { title: 'Sensitive counseling', icon: Syringe, text: 'Private, respectful conversations for fertility, women wellness, pregnancy planning, and procedure care.' }
);

articles.splice(
  0,
  articles.length,
  {
    slug: 'endometriosis-and-intimate-health',
    title: 'Endometriosis and intimate health: why symptoms deserve sensitive discussion',
    category: 'Published Research',
    date: 'Journal of Human Reproductive Sciences, 2016',
    readTime: '5 min read',
    excerpt: 'A patient-friendly summary of research on endometriosis, pain, and female sexual health in Indian women.',
    abstract: 'This study evaluated women with endometriosis diagnosed on laparoscopy and looked at how the condition can affect sexual wellbeing, including desire, arousal, lubrication, orgasm, satisfaction, and pain. The research found that sexual dysfunction was common among participants and increased with more severe endometriosis. For patients, the key message is simple: pain during periods, pelvic pain, painful intercourse, and fertility concerns should be discussed openly with a gynecologist. These symptoms are medical concerns, not something to silently tolerate.',
    patientTakeaway: 'If endometriosis symptoms affect comfort, relationships, or fertility planning, a private consultation can help connect pain control, fertility goals, and quality-of-life care.',
    sourceLabel: 'PubMed / PMC',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/28216913/',
    image: '/images/seo/Endometriosis_and_intimate_health.png',
  },
  {
    slug: 'unicornuate-uterus-and-pregnancy',
    title: 'Unicornuate uterus and pregnancy: careful monitoring can matter',
    category: 'Case Report',
    date: 'IJRCOG, 2016',
    readTime: '5 min read',
    excerpt: 'A case-report based explanation of a congenital uterine shape difference and pregnancy follow-up.',
    abstract: 'This case report discusses pregnancy in a patient with a unicornuate uterus, a congenital condition where the uterus develops from one side of the Mullerian ducts. Such uterine differences may be linked with infertility, miscarriage, preterm birth, breech presentation, growth restriction, or other pregnancy concerns. The report highlights that timely diagnosis, antenatal monitoring, and planned obstetric care can support safer decision-making during pregnancy.',
    patientTakeaway: 'If a scan or previous report mentions a uterine anomaly, bring that report to consultation so pregnancy planning and follow-up can be individualized.',
    sourceLabel: 'International Journal of Reproduction, Contraception, Obstetrics and Gynecology',
    sourceUrl: 'https://www.ijrcog.org/index.php/ijrcog/article/view/89',
    image: '/images/seo/Unicornuate_uterus_and_pregnancy.png',
  },
  {
    slug: 'uterine-cavity-assessment-before-ivf',
    title: 'Before IVF: why uterine cavity assessment may be advised',
    category: 'IVF Workup',
    date: 'Indian Journal of Obstetrics and Gynecology Research, 2016',
    readTime: '4 min read',
    excerpt: 'A research-based overview of checking the uterine cavity before IVF treatment planning.',
    abstract: 'This publication compared 3D transvaginal ultrasonography with office hysteroscopy for uterine cavity assessment before IVF. In patient terms, the uterine cavity is where an embryo needs to implant, so identifying polyps, septum, adhesions, fibroids, or other cavity concerns can be an important part of fertility planning. The right investigation depends on history, ultrasound findings, previous treatment, and doctor assessment.',
    patientTakeaway: 'Before IVF or fertility treatment, ask which reports are needed and whether uterine cavity evaluation is appropriate for your case.',
    sourceLabel: 'ResearchGate record',
    sourceUrl: 'https://www.researchgate.net/publication/308538606_Uterine_cavity_assessment_prior_to_in_vitro_fertilization_comparison_of_3D_transvaginal_ultrasonography_accuracy_versus_office_hysteroscopy',
    image: '/images/seo/BeforeIVF_why_uterine_cavity_assessment.png',
  },
  {
    slug: 'cystourethroscopy-in-gynecological-surgery',
    title: 'Safety checks in gynecological surgery: understanding cystourethroscopy',
    category: 'Surgical Safety',
    date: 'Journal of SAFOMS, 2018',
    readTime: '4 min read',
    excerpt: 'A simple patient explanation of why urinary tract checks may be used during selected gynecologic surgeries.',
    abstract: 'This research record focuses on universal cystourethroscopy to detect lower urinary tract injuries during gynecological surgery. For patients, cystourethroscopy is a small-camera evaluation of the bladder and urethra. In selected surgeries, it can help the surgical team check urinary tract safety before completing the procedure. Whether it is needed depends on the type of surgery, anatomy, risk factors, and surgeon judgment.',
    patientTakeaway: 'Before laparoscopy or gynecologic surgery, patients can ask what safety checks are planned and what recovery signs should be watched after discharge.',
    sourceLabel: 'ResearchGate record',
    sourceUrl: 'https://www.researchgate.net/publication/327794127_Role_of_Universal_Cystourethroscopy_to_detect_Lower_Urinary_Tract_Injuries_during_Gynecological_Surgery',
    image: '/images/seo/Safety%20checks%20in%20gynecological%20surgery.png',
  }
);
