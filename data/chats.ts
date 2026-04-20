export interface Message {
  id: string;
  senderId: 'user' | 'specialist';
  text: string;
  time: string;
  read: boolean;
}

export interface Chat {
  id: string;
  specialistId: string;
  specialistName: string;
  specialistAvatar: string;
  specialistAvatarColor: string;
  specialistSpecialty: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export const chats: Chat[] = [
  {
    id: 'c1',
    specialistId: '1',
    specialistName: 'Dr. Kamola Yusupova',
    specialistAvatar: '👩‍⚕️',
    specialistAvatarColor: '#00D4FF',
    specialistSpecialty: 'Jarrohlik mutaxassisi',
    isOnline: true,
    lastMessage: "Sensor ma'lumotlari normal. Ertaga 10:00 ga keling.",
    lastMessageTime: '21:45',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'user', text: "Assalomu alaykum doktor! Chok atrofida biroz achishish bor.", time: '09:10', read: true },
      { id: 'm2', senderId: 'specialist', text: "Vaalaykum assalom! Sensor ko'rsatkichlarini ko'rdim — namlik biroz yuqori. Bog'lamni almashtiring.", time: '09:15', read: true },
      { id: 'm3', senderId: 'user', text: 'Xop, hozir almashtiraman. Rasm yuboraymi?', time: '09:20', read: true },
      { id: 'm4', senderId: 'specialist', text: "Ha, iltimos yuborib ko'ring. Shunda yaxshiroq baholay olaman.", time: '09:25', read: true },
      { id: 'm5', senderId: 'specialist', text: "Sensor ma'lumotlari normal. Ertaga 10:00 ga keling.", time: '21:45', read: false },
      { id: 'm6', senderId: 'specialist', text: 'Yoki boshqa qulay vaqt tanlang 😊', time: '21:46', read: false },
    ],
  },
  {
    id: 'c2',
    specialistId: '8',
    specialistName: 'Dr. Sherzod Nishonov',
    specialistAvatar: '👨‍⚕️',
    specialistAvatarColor: '#8B5CF6',
    specialistSpecialty: 'Infektolog',
    isOnline: false,
    lastMessage: 'Antibiotik kursini tugatmang, davom eting.',
    lastMessageTime: 'Kecha',
    unreadCount: 0,
    messages: [
      { id: 'n1', senderId: 'user', text: "Doktor, sensor haroratni 37.5 ko'rsatyapti.", time: '14:00', read: true },
      { id: 'n2', senderId: 'specialist', text: "Bu biroz yuqori. Chok atrofida qizarish bormi?", time: '14:10', read: true },
      { id: 'n3', senderId: 'user', text: "Ha, ozgina qizarish bor.", time: '14:12', read: true },
      { id: 'n4', senderId: 'specialist', text: 'Antibiotik kursini tugatmang, davom eting. Ertaga dinamikasini ko\'ramiz.', time: '14:20', read: true },
    ],
  },
];

export default chats;
