export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  experience: number;
  price: number;
  location: string;
  photo: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  education: string;
  languages: string[];
  isOnline: boolean;
  isFeatured: boolean;
  timeSlots: TimeSlot[];
  reviews: Review[];
  tags: string[];
}

export const specialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Kamola Yusupova',
    specialty: 'Jarrohlik mutaxassisi',
    categoryId: 'surgery',
    rating: 4.9,
    reviewCount: 128,
    experience: 12,
    price: 150,
    location: 'Toshkent, Yunusobod',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    avatar: 'KY',
    avatarColor: '#00D4FF',
    bio: "Operatsiyadan keyingi tiklanish va chok parvarishida 12 yillik tajribaga ega mutaxassis. Bluetooth sensor ma'lumotlarini real vaqtda kuzatib, bemorlar bilan masofadan muloqot qiladi.",
    education: 'Toshkent Davlat Tibbiyot Universiteti, Umumiy jarrohlik',
    languages: ["O'zbek", 'Rus', 'Ingliz'],
    isOnline: true,
    isFeatured: true,
    tags: ['Post-op', 'Chok parvarishi', 'Tiklanish', 'Monitoring'],
    timeSlots: [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: false },
      { time: '16:00', available: true },
    ],
    reviews: [
      { id: 'r1', author: 'Aziz T.', rating: 5, comment: 'Operatsiyadan keyin juda yaxshi nazorat qildi.', date: '2026-04-10' },
      { id: 'r2', author: 'Malika U.', rating: 5, comment: 'Masofaviy konsultatsiya juda qulay!', date: '2026-04-01' },
    ],
  },
  {
    id: '2',
    name: 'Dr. Bobur Rashidov',
    specialty: 'Chok parvarishi',
    categoryId: 'wound',
    rating: 4.8,
    reviewCount: 95,
    experience: 9,
    price: 120,
    location: 'Toshkent, Chilonzor',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    avatar: 'BR',
    avatarColor: '#00C48C',
    bio: "Yarani davolash va infeksiyalarni oldini olish bo'yicha mutaxassis. Sensor ma'lumotlari asosida chok holatini baholaydi.",
    education: 'ToshTTI, Jarrohlik',
    languages: ["O'zbek", 'Rus'],
    isOnline: true,
    isFeatured: true,
    tags: ['Yara davolash', 'Infeksiya', 'Chok', "Bog'lam"],
    timeSlots: [
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '13:00', available: false },
      { time: '15:00', available: true },
    ],
    reviews: [
      { id: 'r3', author: 'Sardor B.', rating: 5, comment: 'Harorat ko\'tarilganda darhol xabar berdi.', date: '2026-03-20' },
    ],
  },
  {
    id: '3',
    name: 'Dr. Nilufar Rashidova',
    specialty: 'Terapevt',
    categoryId: 'therapy',
    rating: 4.7,
    reviewCount: 67,
    experience: 7,
    price: 100,
    location: "Toshkent, Mirzo Ulug'bek",
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    avatar: 'NR',
    avatarColor: '#9B59B6',
    bio: "Operatsiyadan keyingi umumiy sog'liq holatini kuzatib boruvchi terapevt.",
    education: 'NUUz, Ichki kasalliklar',
    languages: ["O'zbek", 'Rus'],
    isOnline: false,
    isFeatured: false,
    tags: ["Umumiy sog'liq", 'Harorat', 'Qon bosimi', 'Maslahat'],
    timeSlots: [
      { time: '10:00', available: true },
      { time: '12:00', available: true },
      { time: '16:00', available: true },
    ],
    reviews: [
      { id: 'r4', author: 'Feruza N.', rating: 5, comment: 'Juda diqqatli shifokor.', date: '2026-03-10' },
    ],
  },
  {
    id: '4',
    name: 'Dr. Jasur Karimov',
    specialty: 'Ortoped',
    categoryId: 'ortho',
    rating: 4.9,
    reviewCount: 143,
    experience: 15,
    price: 180,
    location: 'Toshkent, Shayxontohur',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    avatar: 'JK',
    avatarColor: '#F39C12',
    bio: "Ortopedik operatsiyalardan keyin tiklanish bo'yicha yetakchi mutaxassis.",
    education: 'ToshTTI, Ortopediya va travmatologiya',
    languages: ["O'zbek", 'Rus', 'Ingliz'],
    isOnline: true,
    isFeatured: true,
    tags: ['Ortopediya', "Bo'g'im", 'Suyak', 'Reabilitatsiya'],
    timeSlots: [
      { time: '08:00', available: true },
      { time: '13:00', available: true },
      { time: '16:00', available: true },
    ],
    reviews: [
      { id: 'r5', author: 'Otabek M.', rating: 5, comment: 'Tiz operatsiyasidan keyin tez tiklandim!', date: '2026-02-05' },
    ],
  },
  {
    id: '5',
    name: 'Dr. Malika Azimova',
    specialty: 'Dermatolog',
    categoryId: 'derma',
    rating: 4.6,
    reviewCount: 52,
    experience: 6,
    price: 110,
    location: 'Toshkent, Bektemir',
    photo: 'https://randomuser.me/api/portraits/women/26.jpg',
    avatar: 'MA',
    avatarColor: '#E74C3C',
    bio: "Teri kasalliklari va chok atrofidagi teri muammolarini davolash bo'yicha mutaxassis.",
    education: 'ToshTTI, Dermatovenerologiya',
    languages: ["O'zbek"],
    isOnline: true,
    isFeatured: false,
    tags: ['Teri', 'Chandiq', 'Chok', 'Infeksiya'],
    timeSlots: [
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
    ],
    reviews: [
      { id: 'r6', author: 'Shahlo A.', rating: 4, comment: 'Chandiq muolajasi yaxshi natija berdi.', date: '2026-02-28' },
    ],
  },
  {
    id: '6',
    name: 'Dr. Ulugbek Sobirov',
    specialty: 'Anesteziolog',
    categoryId: 'anesthesia',
    rating: 4.7,
    reviewCount: 78,
    experience: 10,
    price: 140,
    location: 'Toshkent, Uchtepa',
    photo: 'https://randomuser.me/api/portraits/men/78.jpg',
    avatar: 'US',
    avatarColor: '#2980B9',
    bio: "Operatsiya va operatsiyadan keyingi og'riqni boshqarish bo'yicha mutaxassis.",
    education: 'ToshTTI, Anesteziologiya va reanimatologiya',
    languages: ["O'zbek", 'Rus'],
    isOnline: false,
    isFeatured: false,
    tags: ["Og'riq", 'Dori', 'Post-op', 'Narkoz'],
    timeSlots: [
      { time: '09:00', available: true },
      { time: '14:00', available: true },
      { time: '16:00', available: true },
    ],
    reviews: [
      { id: 'r7', author: 'Diyora S.', rating: 5, comment: "Og'riq nazorati masalasida yaxshi yordam berdi.", date: '2026-03-20' },
    ],
  },
  {
    id: '7',
    name: 'Dr. Mohira Alieva',
    specialty: 'Reabilitolog',
    categoryId: 'rehab',
    rating: 4.8,
    reviewCount: 89,
    experience: 8,
    price: 130,
    location: 'Toshkent, Yakkasaroy',
    photo: 'https://randomuser.me/api/portraits/women/55.jpg',
    avatar: 'MA2',
    avatarColor: '#27AE60',
    bio: "Operatsiyadan keyingi jismoniy reabilitatsiya va mashqlar bo'yicha mutaxassis.",
    education: 'TDPU, Jismoniy reabilitatsiya',
    languages: ["O'zbek"],
    isOnline: true,
    isFeatured: false,
    tags: ['Reabilitatsiya', 'Mashq', 'Tiklanish', 'Harakat'],
    timeSlots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '15:00', available: true },
    ],
    reviews: [
      { id: 'r8', author: 'Barno K.', rating: 5, comment: 'Reabilitatsiya dasturi juda samarali!', date: '2026-04-01' },
    ],
  },
  {
    id: '8',
    name: 'Dr. Sherzod Nishonov',
    specialty: 'Infektolog',
    categoryId: 'infection',
    rating: 4.5,
    reviewCount: 41,
    experience: 9,
    price: 120,
    location: 'Toshkent, Olmazor',
    photo: 'https://randomuser.me/api/portraits/men/61.jpg',
    avatar: 'SN',
    avatarColor: '#8B5CF6',
    bio: "Operatsiyadan keyingi infeksiyalarni oldini olish va davolash bo'yicha mutaxassis.",
    education: 'ToshTTI, Infektsion kasalliklar',
    languages: ["O'zbek", 'Rus'],
    isOnline: false,
    isFeatured: false,
    tags: ['Infeksiya', 'Antibiotik', 'Profilaktika', 'Isitma'],
    timeSlots: [
      { time: '10:00', available: true },
      { time: '13:00', available: true },
    ],
    reviews: [
      { id: 'r9', author: 'Anon', rating: 4, comment: 'Infeksiya muammosi tez hal bo\'ldi.', date: '2026-03-05' },
    ],
  },
];

export default specialists;
