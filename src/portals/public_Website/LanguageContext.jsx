import React, { createContext, useContext, useMemo, useState } from 'react';

const dictionaries = {
  en: {
    languageLabel: 'Language',
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      articles: 'Articles',
      gallery: 'Gallery',
      contact: 'Contact',
    },
    common: {
      bookAppointment: 'Book Appointment',
      callClinic: 'Call Clinic',
      whatsapp: 'WhatsApp',
      contact: 'Contact',
      social: 'Social',
      readArticle: 'Read article',
      readArticles: 'Read articles',
      viewAllServices: 'View all services',
      submitAppointment: 'Submit Appointment Request',
      submitting: 'Submitting...',
    },
    clinic: {
      tagline: 'Fertility, women care, and advanced laparoscopy',
      emergency: 'Compassionate fertility and gynecology care',
      footer: 'Patient-first fertility, gynecology, and laparoscopy care with accessible appointments, clear counseling, and thoughtful follow-up.',
    },
    home: {
      title: 'Eva Fertility & Laparoscopy',
      subtitle: 'Warm, specialized care for fertility consultation, women wellness, pregnancy planning, and minimally invasive gynecology procedures.',
      programsEyebrow: 'Care programs',
      programsTitle: 'Fertility and women care services',
      articlesEyebrow: 'Articles',
      articlesTitle: 'Fertility and women wellness notes',
    },
    about: {
      eyebrow: 'About us',
      title: 'Gentle fertility and gynecology care shaped around trust',
      body: 'Eva Fertility & Laparoscopy brings fertility consultation, women wellness, diagnostics, specialist follow-up, and laparoscopy care into one coordinated experience. Our team focuses on careful listening, privacy, and treatment plans patients can understand.',
      cards: ['Patient-first', 'Qualified team', 'Quality care'],
    },
    servicesPage: {
      eyebrow: 'Services',
      title: 'Fertility, gynecology, and laparoscopy support',
      body: 'Choose a care pathway and book an appointment for consultation, diagnosis, treatment planning, or follow-up review.',
      ctaTitle: 'Need help choosing the right care pathway?',
      ctaBody: 'Our front desk can guide you to the right consultation and appointment slot.',
    },
    articlesPage: {
      eyebrow: 'Articles and blogs',
      title: 'Fertility and women wellness notes',
      body: 'Patient education, fertility guidance, laparoscopy explainers, clinic news, and preventive women health guides.',
    },
    galleryPage: {
      eyebrow: 'Gallery',
      title: 'Eva clinic spaces and care moments',
      body: 'View our clinic environment and a short video walkthrough before you visit.',
    },
    contactPage: {
      eyebrow: 'Contact',
      title: 'Book an appointment or speak with our front desk',
      body: 'Send your details and preferred department. The clinic team can confirm available time slots and guide you through the next step.',
      formTitle: 'Appointment request',
      fullName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      age: 'Age',
      category: 'Patient category',
      department: 'Department',
      location: 'Visit location',
      loadingLocations: 'Loading locations...',
      assignLocation: 'Front desk can assign location',
      date: 'Preferred date',
      time: 'Preferred time',
      message: 'Message',
      portalNote: 'Use the same email in the patient portal to receive OTP access to your records and appointments.',
      placeholders: {
        name: 'Patient name',
        phone: '+91...',
        email: 'name@email.com',
        age: 'Age',
        message: 'Symptoms, notes, or preferred doctor',
      },
    },
    services: [
      ['Fertility Consultation', 'Personalized evaluation, ovulation tracking, fertility planning, and couple counseling.'],
      ['IVF and IUI Guidance', 'Step-by-step support for assisted conception options, investigations, and treatment cycles.'],
      ['Fertility Diagnostics', 'Hormonal workup, ultrasound coordination, semen analysis guidance, and report review.'],
      ['Laparoscopic Surgery', 'Minimally invasive care for cysts, fibroids, endometriosis, and gynecological conditions.'],
      ['Pregnancy Planning', 'Preconception care, early pregnancy advice, risk review, and continued guidance.'],
      ['Women Wellness', 'Menstrual health, PCOS care, menopause counseling, and routine gynecology visits.'],
    ],
    highlights: ['Years of focused care', 'Families guided', 'Care pathways', 'Average rating'],
    promises: [
      ['Sensitive counseling', 'Private, respectful conversations for couples and women at every stage.'],
      ['Clear treatment steps', 'Structured plans for investigations, cycles, procedures, and follow-up care.'],
      ['Safe procedures', 'Sterile clinical workflows and careful guidance before and after treatment.'],
    ],
    articles: [
      ['How to prepare for your first fertility consultation', 'Fertility Guide', 'A simple checklist of cycle history, reports, medicines, and questions to bring to your visit.'],
      ['Understanding ovulation windows and cycle tracking', 'Fertility Basics', 'Learn how cycle patterns, symptoms, and testing can help plan your next consultation.'],
      ['When laparoscopy is advised in gynecology care', 'Laparoscopy', 'Understand how minimally invasive evaluation can support diagnosis and treatment planning.'],
    ],
    gallery: ['Warm reception and patient help desk', 'Private consultation room', 'Fertility diagnostics support', 'Eva clinic care walkthrough'],
  },
  hi: {
    languageLabel: 'भाषा',
    nav: { home: 'होम', about: 'हमारे बारे में', services: 'सेवाएं', articles: 'लेख', gallery: 'गैलरी', contact: 'संपर्क' },
    common: {
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      callClinic: 'क्लिनिक कॉल करें',
      whatsapp: 'व्हाट्सऐप',
      contact: 'संपर्क',
      social: 'सोशल',
      readArticle: 'लेख पढ़ें',
      readArticles: 'लेख पढ़ें',
      viewAllServices: 'सभी सेवाएं देखें',
      submitAppointment: 'अपॉइंटमेंट अनुरोध भेजें',
      submitting: 'भेजा जा रहा है...',
    },
    clinic: {
      tagline: 'फर्टिलिटी, महिला स्वास्थ्य और एडवांस लैप्रोस्कोपी',
      emergency: 'सहानुभूतिपूर्ण फर्टिलिटी और स्त्री रोग देखभाल',
      footer: 'फर्टिलिटी, स्त्री रोग और लैप्रोस्कोपी के लिए भरोसेमंद देखभाल, स्पष्ट सलाह और व्यवस्थित फॉलो-अप.',
    },
    home: {
      title: 'ईवा फर्टिलिटी एंड लैप्रोस्कोपी',
      subtitle: 'फर्टिलिटी कंसल्टेशन, महिला स्वास्थ्य, गर्भधारण योजना और मिनिमली इनवेसिव स्त्री रोग प्रक्रियाओं के लिए संवेदनशील विशेषज्ञ देखभाल.',
      programsEyebrow: 'केयर प्रोग्राम',
      programsTitle: 'फर्टिलिटी और महिला स्वास्थ्य सेवाएं',
      articlesEyebrow: 'लेख',
      articlesTitle: 'फर्टिलिटी और महिला स्वास्थ्य जानकारी',
    },
    about: {
      eyebrow: 'हमारे बारे में',
      title: 'भरोसे पर आधारित कोमल फर्टिलिटी और स्त्री रोग देखभाल',
      body: 'ईवा फर्टिलिटी एंड लैप्रोस्कोपी में फर्टिलिटी कंसल्टेशन, महिला स्वास्थ्य, डायग्नोस्टिक्स, विशेषज्ञ फॉलो-अप और लैप्रोस्कोपी देखभाल एक ही जगह मिलती है.',
      cards: ['मरीज पहले', 'योग्य टीम', 'गुणवत्तापूर्ण देखभाल'],
    },
    servicesPage: {
      eyebrow: 'सेवाएं',
      title: 'फर्टिलिटी, स्त्री रोग और लैप्रोस्कोपी सहायता',
      body: 'कंसल्टेशन, जांच, उपचार योजना या फॉलो-अप के लिए सही सेवा चुनें और अपॉइंटमेंट बुक करें.',
      ctaTitle: 'सही सेवा चुनने में मदद चाहिए?',
      ctaBody: 'हमारी फ्रंट डेस्क आपको सही कंसल्टेशन और समय स्लॉट चुनने में मदद करेगी.',
    },
    articlesPage: {
      eyebrow: 'लेख और ब्लॉग',
      title: 'फर्टिलिटी और महिला स्वास्थ्य नोट्स',
      body: 'मरीज शिक्षा, फर्टिलिटी गाइडेंस, लैप्रोस्कोपी जानकारी, क्लिनिक अपडेट और महिला स्वास्थ्य लेख.',
    },
    galleryPage: {
      eyebrow: 'गैलरी',
      title: 'ईवा क्लिनिक और देखभाल की झलक',
      body: 'क्लिनिक का वातावरण और छोटी वीडियो वॉकथ्रू देखें.',
    },
    contactPage: {
      eyebrow: 'संपर्क',
      title: 'अपॉइंटमेंट बुक करें या फ्रंट डेस्क से बात करें',
      body: 'अपनी जानकारी और पसंदीदा सेवा भेजें. हमारी टीम उपलब्ध समय स्लॉट की पुष्टि करेगी.',
      formTitle: 'अपॉइंटमेंट अनुरोध',
      fullName: 'पूरा नाम',
      phone: 'फोन',
      email: 'ईमेल',
      age: 'उम्र',
      category: 'मरीज श्रेणी',
      department: 'विभाग',
      location: 'विजिट लोकेशन',
      loadingLocations: 'लोकेशन लोड हो रही है...',
      assignLocation: 'फ्रंट डेस्क लोकेशन असाइन करेगी',
      date: 'पसंदीदा तारीख',
      time: 'पसंदीदा समय',
      message: 'संदेश',
      portalNote: 'रिकॉर्ड और अपॉइंटमेंट देखने के लिए मरीज पोर्टल में यही ईमेल इस्तेमाल करें.',
      placeholders: { name: 'मरीज का नाम', phone: '+91...', email: 'name@email.com', age: 'उम्र', message: 'लक्षण, नोट्स या पसंदीदा डॉक्टर' },
    },
    services: [
      ['फर्टिलिटी कंसल्टेशन', 'व्यक्तिगत मूल्यांकन, ओव्यूलेशन ट्रैकिंग, फर्टिलिटी योजना और कपल काउंसलिंग.'],
      ['IVF और IUI मार्गदर्शन', 'असिस्टेड कंसेप्शन विकल्पों, जांच और उपचार चक्रों के लिए चरणबद्ध सहायता.'],
      ['फर्टिलिटी डायग्नोस्टिक्स', 'हार्मोनल जांच, अल्ट्रासाउंड समन्वय, सीमेन एनालिसिस मार्गदर्शन और रिपोर्ट समीक्षा.'],
      ['लैप्रोस्कोपिक सर्जरी', 'सिस्ट, फाइब्रॉइड, एंडोमेट्रियोसिस और स्त्री रोग स्थितियों के लिए मिनिमली इनवेसिव देखभाल.'],
      ['गर्भधारण योजना', 'प्रीकंसेप्शन केयर, शुरुआती गर्भावस्था सलाह, रिस्क रिव्यू और सतत मार्गदर्शन.'],
      ['महिला वेलनेस', 'मासिक धर्म स्वास्थ्य, PCOS केयर, मेनोपॉज काउंसलिंग और नियमित स्त्री रोग विजिट.'],
    ],
    highlights: ['विशेष देखभाल के वर्ष', 'मार्गदर्शित परिवार', 'केयर पाथवे', 'औसत रेटिंग'],
    promises: [
      ['संवेदनशील काउंसलिंग', 'हर चरण में कपल्स और महिलाओं के लिए निजी, सम्मानजनक बातचीत.'],
      ['स्पष्ट उपचार चरण', 'जांच, उपचार चक्र, प्रक्रियाओं और फॉलो-अप के लिए व्यवस्थित योजना.'],
      ['सुरक्षित प्रक्रियाएं', 'उपचार से पहले और बाद में सुरक्षित क्लिनिकल प्रक्रिया और मार्गदर्शन.'],
    ],
    articles: [
      ['पहले फर्टिलिटी कंसल्टेशन की तैयारी कैसे करें', 'फर्टिलिटी गाइड', 'साइकिल हिस्ट्री, रिपोर्ट, दवाइयां और सवालों की सरल चेकलिस्ट.'],
      ['ओव्यूलेशन विंडो और साइकिल ट्रैकिंग समझें', 'फर्टिलिटी बेसिक्स', 'साइकिल पैटर्न, लक्षण और टेस्टिंग अगली सलाह में कैसे मदद करते हैं.'],
      ['स्त्री रोग देखभाल में लैप्रोस्कोपी कब सलाह दी जाती है', 'लैप्रोस्कोपी', 'मिनिमली इनवेसिव जांच उपचार योजना में कैसे मदद करती है.'],
    ],
    gallery: ['स्वागत कक्ष और हेल्प डेस्क', 'निजी कंसल्टेशन रूम', 'फर्टिलिटी डायग्नोस्टिक्स सहायता', 'ईवा क्लिनिक वॉकथ्रू'],
  },
  mr: {
    languageLabel: 'भाषा',
    nav: { home: 'मुख्यपृष्ठ', about: 'आमच्याबद्दल', services: 'सेवा', articles: 'लेख', gallery: 'गॅलरी', contact: 'संपर्क' },
    common: {
      bookAppointment: 'अपॉइंटमेंट बुक करा',
      callClinic: 'क्लिनिकला कॉल करा',
      whatsapp: 'व्हॉट्सअॅप',
      contact: 'संपर्क',
      social: 'सोशल',
      readArticle: 'लेख वाचा',
      readArticles: 'लेख वाचा',
      viewAllServices: 'सर्व सेवा पहा',
      submitAppointment: 'अपॉइंटमेंट विनंती पाठवा',
      submitting: 'पाठवत आहे...',
    },
    clinic: {
      tagline: 'फर्टिलिटी, महिला आरोग्य आणि प्रगत लॅप्रोस्कोपी',
      emergency: 'संवेदनशील फर्टिलिटी आणि स्त्रीरोग सेवा',
      footer: 'फर्टिलिटी, स्त्रीरोग आणि लॅप्रोस्कोपीसाठी रुग्णकेंद्रित सेवा, स्पष्ट समुपदेशन आणि व्यवस्थित फॉलो-अप.',
    },
    home: {
      title: 'ईवा फर्टिलिटी अँड लॅप्रोस्कोपी',
      subtitle: 'फर्टिलिटी सल्ला, महिला आरोग्य, गर्भधारणा नियोजन आणि मिनिमली इनवेसिव्ह स्त्रीरोग प्रक्रियांसाठी उबदार तज्ज्ञ सेवा.',
      programsEyebrow: 'केअर प्रोग्राम',
      programsTitle: 'फर्टिलिटी आणि महिला आरोग्य सेवा',
      articlesEyebrow: 'लेख',
      articlesTitle: 'फर्टिलिटी आणि महिला आरोग्य मार्गदर्शन',
    },
    about: {
      eyebrow: 'आमच्याबद्दल',
      title: 'विश्वासावर आधारित कोमल फर्टिलिटी आणि स्त्रीरोग सेवा',
      body: 'ईवा फर्टिलिटी अँड लॅप्रोस्कोपीमध्ये फर्टिलिटी सल्ला, महिला आरोग्य, तपासण्या, तज्ज्ञ फॉलो-अप आणि लॅप्रोस्कोपी सेवा एकत्रितपणे मिळतात.',
      cards: ['रुग्ण प्रथम', 'तज्ज्ञ टीम', 'गुणवत्तापूर्ण सेवा'],
    },
    servicesPage: {
      eyebrow: 'सेवा',
      title: 'फर्टिलिटी, स्त्रीरोग आणि लॅप्रोस्कोपी सहाय्य',
      body: 'सल्ला, निदान, उपचार योजना किंवा फॉलो-अपसाठी योग्य सेवा निवडा आणि अपॉइंटमेंट बुक करा.',
      ctaTitle: 'योग्य सेवा निवडण्यासाठी मदत हवी आहे?',
      ctaBody: 'आमची फ्रंट डेस्क तुम्हाला योग्य सल्ला आणि अपॉइंटमेंट स्लॉट निवडण्यास मदत करेल.',
    },
    articlesPage: {
      eyebrow: 'लेख आणि ब्लॉग',
      title: 'फर्टिलिटी आणि महिला आरोग्य नोट्स',
      body: 'रुग्ण शिक्षण, फर्टिलिटी मार्गदर्शन, लॅप्रोस्कोपी माहिती, क्लिनिक अपडेट्स आणि महिला आरोग्य लेख.',
    },
    galleryPage: {
      eyebrow: 'गॅलरी',
      title: 'ईवा क्लिनिक आणि काळजीचे क्षण',
      body: 'भेटीपूर्वी आमचे क्लिनिक वातावरण आणि लहान व्हिडिओ वॉकथ्रू पहा.',
    },
    contactPage: {
      eyebrow: 'संपर्क',
      title: 'अपॉइंटमेंट बुक करा किंवा फ्रंट डेस्कशी बोला',
      body: 'तुमची माहिती आणि पसंतीची सेवा पाठवा. आमची टीम उपलब्ध स्लॉटची पुष्टी करेल.',
      formTitle: 'अपॉइंटमेंट विनंती',
      fullName: 'पूर्ण नाव',
      phone: 'फोन',
      email: 'ईमेल',
      age: 'वय',
      category: 'रुग्ण श्रेणी',
      department: 'विभाग',
      location: 'भेट स्थान',
      loadingLocations: 'स्थान लोड होत आहे...',
      assignLocation: 'फ्रंट डेस्क स्थान देईल',
      date: 'पसंतीची तारीख',
      time: 'पसंतीचा वेळ',
      message: 'संदेश',
      portalNote: 'रेकॉर्ड आणि अपॉइंटमेंट पाहण्यासाठी रुग्ण पोर्टलमध्ये हाच ईमेल वापरा.',
      placeholders: { name: 'रुग्णाचे नाव', phone: '+91...', email: 'name@email.com', age: 'वय', message: 'लक्षणे, नोट्स किंवा पसंतीचा डॉक्टर' },
    },
    services: [
      ['फर्टिलिटी कन्सल्टेशन', 'वैयक्तिक मूल्यांकन, ओव्यूलेशन ट्रॅकिंग, फर्टिलिटी नियोजन आणि कपल काउंसलिंग.'],
      ['IVF आणि IUI मार्गदर्शन', 'असिस्टेड कन्सेप्शन पर्याय, तपासण्या आणि उपचार चक्रांसाठी टप्प्याटप्प्याने मदत.'],
      ['फर्टिलिटी डायग्नोस्टिक्स', 'हार्मोनल तपासणी, अल्ट्रासाउंड समन्वय, सीमेन अॅनालिसिस मार्गदर्शन आणि रिपोर्ट रिव्यू.'],
      ['लॅप्रोस्कोपिक सर्जरी', 'सिस्ट, फायब्रॉइड, एंडोमेट्रियोसिस आणि स्त्रीरोग स्थितींसाठी मिनिमली इनवेसिव्ह सेवा.'],
      ['गर्भधारणा नियोजन', 'प्रीकंसेप्शन केअर, सुरुवातीच्या गर्भधारणेचा सल्ला, रिस्क रिव्यू आणि सातत्यपूर्ण मार्गदर्शन.'],
      ['महिला वेलनेस', 'मासिक पाळी आरोग्य, PCOS केअर, मेनोपॉज काउंसलिंग आणि नियमित स्त्रीरोग भेटी.'],
    ],
    highlights: ['विशेष सेवेची वर्षे', 'मार्गदर्शित कुटुंबे', 'केअर पाथवे', 'सरासरी रेटिंग'],
    promises: [
      ['संवेदनशील समुपदेशन', 'प्रत्येक टप्प्यावर कपल्स आणि महिलांसाठी खाजगी, आदरयुक्त संवाद.'],
      ['स्पष्ट उपचार टप्पे', 'तपासण्या, उपचार चक्र, प्रक्रिया आणि फॉलो-अपसाठी व्यवस्थित योजना.'],
      ['सुरक्षित प्रक्रिया', 'उपचारापूर्वी आणि नंतर सुरक्षित क्लिनिकल प्रक्रिया आणि मार्गदर्शन.'],
    ],
    articles: [
      ['पहिल्या फर्टिलिटी कन्सल्टेशनची तयारी कशी करावी', 'फर्टिलिटी गाइड', 'सायकल हिस्ट्री, रिपोर्ट, औषधे आणि प्रश्नांची सोपी चेकलिस्ट.'],
      ['ओव्यूलेशन विंडो आणि सायकल ट्रॅकिंग समजून घ्या', 'फर्टिलिटी बेसिक्स', 'सायकल पॅटर्न, लक्षणे आणि टेस्टिंग पुढील सल्ल्यात कशी मदत करतात.'],
      ['स्त्रीरोग सेवेत लॅप्रोस्कोपी कधी सुचवली जाते', 'लॅप्रोस्कोपी', 'मिनिमली इनवेसिव्ह तपासणी उपचार नियोजनात कशी मदत करते.'],
    ],
    gallery: ['स्वागत कक्ष आणि हेल्प डेस्क', 'खाजगी कन्सल्टेशन रूम', 'फर्टिलिटी डायग्नोस्टिक्स सहाय्य', 'ईवा क्लिनिक वॉकथ्रू'],
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('public_site_language') || 'en');
  const value = useMemo(() => {
    const dictionary = dictionaries[language] || dictionaries.en;
    const setAndStoreLanguage = (nextLanguage) => {
      setLanguage(nextLanguage);
      localStorage.setItem('public_site_language', nextLanguage);
    };
    return { language, setLanguage: setAndStoreLanguage, dictionary };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}

export const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];
