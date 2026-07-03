// Shared property data — used by both the frontend and ws-server channel list

export type BadgeType =
  | "furnished"
  | "near-campus"
  | "wifi"
  | "male-only"
  | "female-only"
  | "parking"
  | "laundry"
  | "ac";

export interface Property {
  id: string;
  channelId: string; // WebSocket channel for this property's chat
  title: string;
  location: string;
  price: number;
  priceUnit: "room" | "bed";
  type: "apartment" | "house" | "hostel";
  rooms: number;
  bathrooms: number;
  size: number; // sqft
  available: boolean;
  description: string;
  badges: BadgeType[];
  gender: "mixed" | "male" | "female";
  nearCampus: string[];
  utilities: {
    water: "included" | "split";
    electricity: "included" | "split";
    wifi: boolean;
    wifiSpeed?: string;
  };
  minLease: 6 | 12;
  landlord: {
    id: string;
    name: string;
    phone: string;
    responseTime: string;
    initials: string;
    color: string;
  };
  rating: number;
  reviews: number;
  gradient: string; // card hero gradient
}

export const PROPERTIES: Property[] = [
  {
    id: "prop_1",
    channelId: "chat_prop_1",
    title: "Bilik Selesa Dekat Politeknik Mersing",
    location: "Jalan Genuang, Mersing",
    price: 260,
    priceUnit: "bed",
    type: "hostel",
    rooms: 8,
    bathrooms: 3,
    size: 1200,
    available: true,
    description:
      "Hostel 2-tingkat yang sesuai untuk pelajar Politeknik Mersing. Hanya 5 minit berjalan kaki dari kampus. Dilengkapi WiFi pantas, dapur bersama, dan kawasan laundri. Persekitaran yang selamat dan kondusif untuk belajar.",
    badges: ["furnished", "near-campus", "wifi", "laundry", "male-only"],
    gender: "male",
    nearCampus: ["Politeknik Mersing", "UTHM Johor"],
    utilities: { water: "included", electricity: "split", wifi: true, wifiSpeed: "50Mbps" },
    minLease: 6,
    landlord: { id: "ll_1", name: "Encik Ahmad Razif", phone: "019-7654321", responseTime: "< 1 jam", initials: "AR", color: "hsl(215,80%,55%)" },
    rating: 4.7,
    reviews: 23,
    gradient: "linear-gradient(135deg, hsl(215,80%,40%) 0%, hsl(240,70%,30%) 100%)",
  },
  {
    id: "prop_2",
    channelId: "chat_prop_2",
    title: "Apartment Studio Wanita — Mersing Town",
    location: "Bandar Mersing, Johor",
    price: 480,
    priceUnit: "room",
    type: "apartment",
    rooms: 4,
    bathrooms: 2,
    size: 850,
    available: true,
    description:
      "Apartment moden khusus pelajar wanita. Lokasi strategik di tengah bandar Mersing, dekat pasar raya dan pengangkutan awam. Bilik air-cond, tilam queen, dan almari besar. Pemilik wanita, selamat dan terjaga.",
    badges: ["furnished", "near-campus", "wifi", "ac", "female-only"],
    gender: "female",
    nearCampus: ["Politeknik Mersing", "Kolej Komuniti Mersing"],
    utilities: { water: "included", electricity: "included", wifi: true, wifiSpeed: "100Mbps" },
    minLease: 6,
    landlord: { id: "ll_2", name: "Puan Siti Hajar", phone: "017-3456789", responseTime: "< 2 jam", initials: "SH", color: "hsl(330,75%,55%)" },
    rating: 4.9,
    reviews: 41,
    gradient: "linear-gradient(135deg, hsl(330,70%,40%) 0%, hsl(280,60%,30%) 100%)",
  },
  {
    id: "prop_3",
    channelId: "chat_prop_3",
    title: "Rumah Teres Pelajar — Dekat Kampus",
    location: "Taman Sri Mersing, Johor",
    price: 350,
    priceUnit: "room",
    type: "house",
    rooms: 5,
    bathrooms: 2,
    size: 1500,
    available: true,
    description:
      "Rumah teres 2-tingkat yang selesa untuk pelajar. Bilik berasingan dengan kunci, dapur lengkap, ruang tamu bersama, dan tempat letak kereta. Komuniti pelajar yang positif dan kondusif.",
    badges: ["furnished", "near-campus", "wifi", "parking", "laundry"],
    gender: "mixed",
    nearCampus: ["Politeknik Mersing", "UTM Skudai (bas)"],
    utilities: { water: "split", electricity: "split", wifi: true, wifiSpeed: "50Mbps" },
    minLease: 6,
    landlord: { id: "ll_3", name: "Encik Zulkifli Hamid", phone: "013-9876543", responseTime: "< 3 jam", initials: "ZH", color: "hsl(142,65%,40%)" },
    rating: 4.5,
    reviews: 18,
    gradient: "linear-gradient(135deg, hsl(142,65%,30%) 0%, hsl(160,55%,20%) 100%)",
  },
  {
    id: "prop_4",
    channelId: "chat_prop_4",
    title: "Kondominium Moden — Mersing Waterfront",
    location: "Jalan Abu Bakar, Mersing",
    price: 650,
    priceUnit: "room",
    type: "apartment",
    rooms: 3,
    bathrooms: 2,
    size: 1100,
    available: false,
    description:
      "Kondominium premium dengan pemandangan laut. Fully furnished termasuk TV, sofa, dan peralatan dapur lengkap. Internet serat optik 500Mbps. Sesuai untuk pelajar yang memerlukan persekitaran belajar yang tenang.",
    badges: ["furnished", "wifi", "ac", "parking"],
    gender: "mixed",
    nearCampus: ["Politeknik Mersing (10 min memandu)"],
    utilities: { water: "included", electricity: "included", wifi: true, wifiSpeed: "500Mbps" },
    minLease: 12,
    landlord: { id: "ll_4", name: "Mr. Jason Lim", phone: "012-5554433", responseTime: "< 1 jam", initials: "JL", color: "hsl(38,90%,50%)" },
    rating: 4.8,
    reviews: 12,
    gradient: "linear-gradient(135deg, hsl(200,80%,35%) 0%, hsl(215,75%,25%) 100%)",
  },
  {
    id: "prop_5",
    channelId: "chat_prop_5",
    title: "Bilik Bajet Wanita — 5 Min Ke Politeknik",
    location: "Kampung Tengah, Mersing",
    price: 280,
    priceUnit: "room",
    type: "house",
    rooms: 6,
    bathrooms: 2,
    size: 1300,
    available: true,
    description:
      "Pilihan bajet terbaik untuk pelajar wanita! Bilik dilengkapi katil single, meja belajar, dan kipas siling. Jarak 5 minit berjalan ke Politeknik Mersing. Pemilik tinggal berdekatan — selamat dan terjaga.",
    badges: ["furnished", "near-campus", "laundry", "female-only"],
    gender: "female",
    nearCampus: ["Politeknik Mersing", "Sekolah Menengah Mersing"],
    utilities: { water: "included", electricity: "split", wifi: false },
    minLease: 6,
    landlord: { id: "ll_5", name: "Puan Rohani Ismail", phone: "016-2233445", responseTime: "< 30 min", initials: "RI", color: "hsl(280,70%,55%)" },
    rating: 4.6,
    reviews: 35,
    gradient: "linear-gradient(135deg, hsl(280,65%,35%) 0%, hsl(300,55%,25%) 100%)",
  },
  {
    id: "prop_6",
    channelId: "chat_prop_6",
    title: "Master Room — Aircond & Bilik Air Sendiri",
    location: "Taman Mersing Jaya, Johor",
    price: 550,
    priceUnit: "room",
    type: "apartment",
    rooms: 3,
    bathrooms: 3,
    size: 950,
    available: true,
    description:
      "Master bedroom eksklusif dengan bilik air en-suite. Air-cond, katil queen, almari besar, dan meja kerja ergonomik. Perfect untuk pelajar yang memerlukan privasi penuh. Semua utiliti termasuk dalam harga sewa.",
    badges: ["furnished", "near-campus", "wifi", "ac", "parking"],
    gender: "mixed",
    nearCampus: ["Kolej Komuniti Mersing", "Politeknik Mersing"],
    utilities: { water: "included", electricity: "included", wifi: true, wifiSpeed: "100Mbps" },
    minLease: 6,
    landlord: { id: "ll_6", name: "Encik Faizal Rahman", phone: "011-88776655", responseTime: "< 2 jam", initials: "FR", color: "hsl(15,85%,55%)" },
    rating: 4.7,
    reviews: 29,
    gradient: "linear-gradient(135deg, hsl(15,80%,40%) 0%, hsl(38,70%,30%) 100%)",
  },
];

export const PROPERTY_CHANNEL_IDS = PROPERTIES.map((p) => ({
  id: p.channelId,
  name: p.title.slice(0, 30),
  icon: "🏠",
  description: p.location,
  pinned: false,
}));

export function getProperty(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}
