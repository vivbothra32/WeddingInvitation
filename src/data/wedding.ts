export interface Couple {
  brideFirstName: string;
  groomFirstName: string;
  displayName: string;
  hashtag: string;
  heroImage: string | null;
  portraitImage: string | null;
  bridePortraitImage: string | null;
  groomPortraitImage: string | null;
  shortIntroduction: string;
  brideIntroduction: string;
  groomIntroduction: string;
  closingLine: string;
  locationLabel: string;
}

export type EventIcon = "flower" | "hand" | "music" | "sun" | "flame";

export interface WeddingEvent {
  id: string;
  name: string;
  shortTitle: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  address: string | null;
  mapUrl: string | null;
  icon: EventIcon;
  accentColor: string;
  enabled: boolean;
  calendarStart: string | null;
  calendarEnd: string | null;
}

export interface TimelineEntry {
  title: string;
  dateLabel: string;
  description: string;
  image: string | null;
  alignment: "left" | "right";
  enabled: boolean;
}

export interface GalleryImage {
  src: string | null;
  alt: string;
  category: string;
  color: string;
  width: number;
  height: number;
}

export interface Venue {
  eventIds: string[];
  name: string | null;
  address: string | null;
  landmark: string | null;
  mapUrl: string | null;
  mapEmbedUrl: string | null;
  contactName: string | null;
  contactNumber: string | null;
  parkingNote: string | null;
  accessibilityNote: string | null;
}

export interface Contact {
  label: string;
  name: string;
  number: string;
}

export interface CorrespondenceContact {
  id: string;
  heading: string;
  name: string;
  phone: string;
  photo: string | null;
}

export interface WeddingConfig {
  seo: { title: string; description: string };
  couple: Couple;
  weddingDate: string | null;
  assets: { logo: string };
  invitation: { eyebrow: string; heading: string; message: string };
  families: {
    brideFamilyLabel: string;
    brideFamilyNames: string;
    groomFamilyLabel: string;
    groomFamilyNames: string;
  };
  events: WeddingEvent[];
  story: TimelineEntry[];
  gallery: GalleryImage[];
  venues: Venue[];
  contacts: Contact[];
  correspondence: {
    eyebrow: string;
    title: string;
    subtitle: string;
    brideSide: CorrespondenceContact;
    groomSide: CorrespondenceContact;
  };
  social: { whatsappShareText: string };
  privacy: { showContactNumbers: boolean; hideFullAddresses: boolean };
  theme: {
    showPetals: boolean;
    enableMusic: boolean;
    enableParallax: boolean;
    musicPath: string;
  };
}

const eventLocation = "Burdwan Road, Siliguri";

const mishraNiwas = {
  name: "Mishra Niwas",
  address: eventLocation,
};

const Silpanchal = {
  name: "4th Floor, Silpanchal Bhawan",
  address: eventLocation,
  mapUrl: "https://maps.app.goo.gl/ZJr6wL1YVcsWAd7d8",
};

const wedding: WeddingConfig = {
  seo: {
    title: "Sakshi & Vivek | Wedding Invitation",
    description: "Join Sakshi and Vivek as they celebrate love, family, and the beginning of their new journey.",
  },
  couple: {
    brideFirstName: "Sakshi",
    groomFirstName: "Vivek",
    displayName: "Sakshi & Vivek",
    hashtag: "#ViSaApproved",
    heroImage: "/images/Hero.png",
    portraitImage: "/images/story/Couple.jpeg",
    bridePortraitImage: "/images/story/Bride.jpeg",
    groomPortraitImage: "/images/story/Groom.jpeg",
    shortIntroduction: "Two hearts, one beautiful beginning.",
    brideIntroduction: "Warm, graceful, and full of joy, she brings love and light into every room. Bothra family welcomes her with open arms.",
    groomIntroduction: "With kindness in his heart and sincerity in all he does, he is lovingly welcomed and deeply cherished by the Mishra family.",
    closingLine: "Your presence, love, and blessings will make our celebration complete.",
    locationLabel: "Siliguri",
  },
  weddingDate: "2026-11-21T00:00:00+05:30",
  assets: { logo: "/images/logo.png" },
  invitation: {
    eyebrow: "Together with our families",
    heading: "We joyfully invite you",
    message:
      "Together with our families, we invite you to share in the joy of our wedding celebrations. Your presence, blessings, and love will make the beginning of our new journey truly special.",
  },
  families: {
    brideFamilyLabel: "Bride’s Family",
    brideFamilyNames: "Santosh Mishra & Suroo Mishra",
    groomFamilyLabel: "Groom’s Family",
    groomFamilyNames: "Sushila Bothra & Lt. Ranjeet Kumar Bothra",
  },
  events: [
    {
      id: "puja",
      name: "Satyanarayan Puja & Shagun",
      shortTitle: "Puja & Shagun",
      date: "2026-11-19T00:00:00+05:30",
      startTime: "10:00:00",
      endTime: null,
      venueName: mishraNiwas.name,
      address: mishraNiwas.address,
      mapUrl: null,
      icon: "flower",
      accentColor: "gold",
      enabled: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "mehendi",
      name: "Mehendi",
      shortTitle: "Mehendi",
      date: "2026-11-19T00:00:00+05:30",
      startTime: "16:00:00",
      endTime: null,
      venueName: mishraNiwas.name,
      address: mishraNiwas.address,
      mapUrl: null,
      icon: "hand",
      accentColor: "emerald",
      enabled: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "sangeet",
      name: "Tilak & Sangeet",
      shortTitle: "Tilak & Sangeet",
      date: "2026-11-20T00:00:00+05:30",
      startTime: "17:00:00",
      endTime: null,
      venueName: Silpanchal.name,
      address: Silpanchal.address,
      mapUrl: Silpanchal.mapUrl,
      icon: "music",
      accentColor: "plum",
      enabled: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "haldi",
      name: "Matikor & Haldi",
      shortTitle: "Matikor & Haldi",
      date: "2026-11-21T00:00:00+05:30",
      startTime: "10:00:00",
      endTime: null,
      venueName: Silpanchal.name,
      address: Silpanchal.address,
      mapUrl: Silpanchal.mapUrl,
      icon: "sun",
      accentColor: "saffron",
      enabled: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "wedding",
      name: "Baraat & Pheras",
      shortTitle: "Baraat & Pheras",
      date: "2026-11-21T00:00:00+05:30",
      startTime: "19:00:00",
      endTime: null,
      venueName: Silpanchal.name,
      address: Silpanchal.address,
      mapUrl: Silpanchal.mapUrl,
      icon: "flame",
      accentColor: "vermilion",
      enabled: true,
      calendarStart: null,
      calendarEnd: null,
    },
  ],
  story: [
    {
      title: "The First Hello 👋",
      dateLabel: "",
      description: "Every story has a beginning, and ours started with a simple hello. Nothing grand, nothing planned. Just two people, an easy conversation, and a feeling that this one was going to stay. Sakshi and Vivek didn’t know it then, but that small moment would become the first page of everything that followed.",
      image: "/images/story/OurStory1.jpeg",
      alignment: "left",
      enabled: true,
    },
    {
      title: "Jokes, Faces & Everything In Between 😄",
      dateLabel: "",
      description: "I crack the jokes, she makes the faces, and somehow it works perfectly. Annoying her became my favourite hobby, and her eye-rolls became my favourite compliment.",
      image: "/images/story/OurStory2.jpeg",
      alignment: "right",
      enabled: true,
    },
    {
      title: "The Moment We Just Knew 💛",
      dateLabel: "",
      description: "It never felt like an effort, and even the silences felt comfortable. Somewhere along the way, we made each other feel complete, and that was all the proof we needed.",
      image: "/images/story/OurStory3.jpeg",
      alignment: "left",
      enabled: true,
    },
  ],
  gallery: [
    { src: "/images/gallery/OurGallery1.jpeg", alt: "A warm, sunlit moment together", category: "Moments", color: "blush", width: 851, height: 1280 },
    { src: "/images/gallery/OurGallery2.jpeg", alt: "A celebration in soft evening light", category: "Celebrations", color: "sage", width: 1280, height: 851 },
    { src: "/images/gallery/OurGallery3.jpeg", alt: "A quiet moment shared together", category: "Moments", color: "ochre", width: 1280, height: 851 },
    { src: "/images/gallery/OurGallery4.jpeg", alt: "A joyful memory with family", category: "Celebrations", color: "rose", width: 1280, height: 851 },
    { src: "/images/gallery/OurGallery5.jpeg", alt: "A glimpse of the journey so far", category: "Moments", color: "plum", width: 851, height: 1280 },
    { src: "/images/gallery/OurGallery6.jpeg", alt: "A little joy, saved for always", category: "Celebrations", color: "cream", width: 851, height: 1280 },
  ],
  venues: [
    {
      eventIds: ["puja", "mehendi"],
      name: mishraNiwas.name,
      address: mishraNiwas.address,
      landmark: null,
      mapUrl: null,
      mapEmbedUrl: null,
      contactName: null,
      contactNumber: null,
      parkingNote: null,
      accessibilityNote: null,
    },
    {
      eventIds: ["sangeet", "haldi", "wedding"],
      name: "Silpanchal Bhawan",
      address: "Ward 5, Mahananda Para, Burdwan Road, Siliguri - 734005",
      landmark: "4th Floor",
      mapUrl: Silpanchal.mapUrl,
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7128.418427587506!2d88.4160469!3d26.7057625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e44144aa389719%3A0x71b51356be4a02c7!2sSilpanchal%20Bhawan!5e0!3m2!1sen!2sin!4v1791887837995!5m2!1sen!2sin",
      contactName: null,
      contactNumber: null,
      parkingNote: null,
      accessibilityNote: null,
    },
  ],
  contacts: [],
  correspondence: {
    eyebrow: "We’re just a call away",
    title: "Correspondence",
    subtitle: "For any assistance, coordination, or communication during the wedding celebrations.",
    groomSide: {
      id: "groom-side",
      heading: "Dulhan ke Pita Ji",
      name: "Suroo Mishra",
      phone: "+91-9832012970",
      photo: "/images/story/SurooMishra.jpeg",
    },
    brideSide: {
      id: "bride-side",
      heading: "Dulhan Ka Laadla Bhai",
      name: "Somesh Mishra",
      phone: "+91-7679236432",
      photo: "/images/story/Somesh.jpeg",
    },
  },
  social: {
    whatsappShareText:
      "We would love for you to join us as Sakshi and Vivek celebrate the beginning of their new journey.",
  },
  privacy: { showContactNumbers: false, hideFullAddresses: false },
  theme: {
    showPetals: true,
    enableMusic: true,
    enableParallax: true,
    musicPath: "/audio/wedding-theme-placeholder.mp3",
  },
};

export default wedding;
