import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { cards as mockCards, PaymentCard, CARD_THEMES } from '@/data/cards';

const { width } = Dimensions.get('window');

const APPOINTMENTS = [
  { id: '1', name: 'Dilnoza Yusupova', specialty: 'Psixolog', date: '15-mart, 11:00', status: 'upcoming', avatar: '👩‍⚕️', avatarColor: '#DDA0DD' },
  { id: '2', name: 'Jahongir Karimov', specialty: 'Psixiatr', date: '22-mart, 10:00', status: 'upcoming', avatar: '👨‍⚕️', avatarColor: '#87CEEB' },
];

type SettingAction = 'language' | 'notifications' | 'privacy' | 'help' | 'rate';

const SETTINGS: { ionicon: React.ComponentProps<typeof Ionicons>['name']; title: string; subtitle: string; action: SettingAction }[] = [
  { ionicon: 'language-outline', title: 'Til', subtitle: "O'zbek tili", action: 'language' },
  { ionicon: 'notifications-outline', title: 'Bildirishnomalar', subtitle: 'Yoqilgan', action: 'notifications' },
  { ionicon: 'lock-closed-outline', title: 'Maxfiylik', subtitle: 'Sozlamalar', action: 'privacy' },
  { ionicon: 'help-circle-outline', title: 'Yordam', subtitle: "FAQ va qo'llab-quvvatlash", action: 'help' },
  { ionicon: 'star-outline', title: 'Ilovani baholang', subtitle: 'App Store / Play Store', action: 'rate' },
];

function CardItem({ card, onDelete }: { card: PaymentCard; onDelete: () => void }) {
  const theme = CARD_THEMES[card.type];
  return (
    <View style={[styles.cardItem, { backgroundColor: theme.bg[0] }]}>
      <View style={[styles.cardGradient, { backgroundColor: theme.bg[1] }]} />
      <View style={styles.cardItemTop}>
        <Text style={styles.cardItemLabel}>{theme.label} •••• {card.lastFour}</Text>
        {card.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Asosiy</Text>
          </View>
        )}
      </View>
      <View style={styles.cardItemBottom}>
        <Text style={styles.cardItemBalance}>
          {card.balance !== undefined ? `${card.balance}K so'm` : ''}
        </Text>
        <TouchableOpacity onPress={onDelete} style={styles.cardDeleteBtn}>
          <Ionicons name="trash-outline" size={14} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState<PaymentCard[]>(mockCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNum, setNewCardNum] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  const handleAddCard = () => {
    if (newCardNum.replace(/\s/g, '').length < 16 || newCardExpiry.length < 5) {
      Alert.alert('Xato', 'Karta raqami va muddatini to\'liq kiriting.');
      return;
    }
    const [month, year] = newCardExpiry.split('/');
    const rawNum = newCardNum.replace(/\s/g, '');
    const newCard: PaymentCard = {
      id: `card_${Date.now()}`,
      type: rawNum.startsWith('860') ? 'uzcard' : 'humo',
      lastFour: rawNum.slice(-4),
      holderName: 'FOYDALANUVCHI',
      expiryMonth: month ?? '01',
      expiryYear: year ?? '29',
      isDefault: cards.length === 0,
    };
    setCards((prev) => [...prev, newCard]);
    setShowAddCard(false);
    setNewCardNum('');
    setNewCardExpiry('');
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert('Kartani o\'chirish', 'Haqiqatan ham bu kartani o\'chirmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'O\'chirish', style: 'destructive', onPress: () => setCards((prev) => prev.filter((c) => c.id !== id)) },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Chiqish', 'Haqiqatan ham chiqmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'Ha, chiqish', style: 'destructive', onPress: () => router.replace({ pathname: '/(auth)/login' } as any) },
    ]);
  };

  const handleEditAvatar = () => {
    Alert.alert('Avatar o\'zgartirish', 'Rasm tanlash funksiyasi tez orada qo\'shiladi', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerCircle} />
          <TouchableOpacity style={styles.avatarContainer} onPress={handleEditAvatar} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <View style={styles.editAvatarBtn}>
              <Ionicons name="pencil" size={13} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>Foydalanuvchi</Text>
          <Text style={styles.profilePhone}>+998 90 123 45 67</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>✓ Tasdiqlangan</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Qabullar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Izohlar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{cards.length}</Text>
            <Text style={styles.statLabel}>Kartalar</Text>
          </View>
        </View>

        {/* Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Kelgusi qabullar</Text>
          {APPOINTMENTS.map((appt) => (
              <View key={appt.id} style={styles.appointmentCard}>
                <View style={[styles.apptAvatar, { backgroundColor: appt.avatarColor + '33' }]}>
                  <Text style={styles.apptAvatarEmoji}>{appt.avatar}</Text>
                </View>
                <View style={styles.apptInfo}>
                  <Text style={styles.apptName}>{appt.name}</Text>
                  <Text style={styles.apptSpecialty}>{appt.specialty}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.secondary} />
                    <Text style={styles.apptDate}>{appt.date}</Text>
                  </View>
                </View>
                <View style={styles.apptBadge}>
                  <Text style={styles.apptBadgeText}>Kutilmoqda</Text>
                </View>
              </View>
          ))}
        </View>

        {/* === PAYMENT CARDS SECTION === */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💳 Mening kartalarim</Text>
            <TouchableOpacity onPress={() => setShowAddCard(true)} style={styles.addBtn} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>＋ Qo'shish</Text>
            </TouchableOpacity>
          </View>

          {cards.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyCard}
              onPress={() => setShowAddCard(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyCardIcon}>💳</Text>
              <Text style={styles.emptyCardText}>Karta qo'shing</Text>
              <Text style={styles.emptyCardSub}>To'lov uchun karta qo'shing</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
              {cards.map((card) => (
                <CardItem key={card.id} card={card} onDelete={() => handleDeleteCard(card.id)} />
              ))}
              <TouchableOpacity
                style={styles.addCardPlaceholder}
                onPress={() => setShowAddCard(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.addCardPlusIcon}>＋</Text>
                <Text style={styles.addCardPlusText}>Yangi karta</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Sozlamalar</Text>
          <View style={styles.settingsCard}>
            {SETTINGS.map((setting, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.settingRow, idx < SETTINGS.length - 1 && styles.settingRowBorder]}
                onPress={() => {
                  const messages: Record<SettingAction, string> = {
                    language: "Til: O'zbek tili sozlangan",
                    notifications: 'Barcha bildirishnomalar yoqilgan',
                    privacy: 'Maxfiylik sozlamalari tez orada qo\'shiladi',
                    help: 'Yordam markazi:\n+998 90 000 00 00\nsupport@terapiya.uz',
                    rate: 'Ilovangizni baholang! 🌟\n(Bu funksiya tez orada ishga tushadi)',
                  };
                  Alert.alert(setting.title, messages[setting.action], [{ text: 'OK' }]);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.settingIconBg}>
                  <Ionicons name={setting.ionicon} size={20} color={Colors.secondary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Terapiya v1.0.0</Text>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add card modal */}
      <Modal visible={showAddCard} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <Text style={styles.modalTitle}>💳 Karta qo'shish</Text>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Karta raqami</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="8600 XXXX XXXX XXXX"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
                maxLength={16}
                value={newCardNum}
                onChangeText={setNewCardNum}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Amal qilish muddati</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="MM/YY"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
                maxLength={5}
                value={newCardExpiry}
                onChangeText={(t) => {
                  if (t.length === 2 && !t.includes('/') && newCardExpiry.length < 3) {
                    setNewCardExpiry(t + '/');
                  } else {
                    setNewCardExpiry(t);
                  }
                }}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowAddCard(false)} activeOpacity={0.8}>
                <Text style={styles.modalCancelText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleAddCard} activeOpacity={0.85}>
                <Text style={styles.modalSaveText}>Saqlash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const STATUS_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 50;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { gap: 0 },

  header: {
    backgroundColor: Colors.secondary,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 8, overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute',
    width: width * 1.5, height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: Colors.secondaryDark + '35',
    top: -width * 0.8, left: -width * 0.25,
  },
  avatarContainer: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.white + '30',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.white,
  },
  avatarEmoji: { fontSize: 46 },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  editAvatarIcon: { fontSize: 13 },
  profileName: { fontSize: 22, fontWeight: '800', color: Colors.white },
  profilePhone: { fontSize: 14, color: Colors.white + 'CC', fontWeight: '500' },
  profileBadge: {
    backgroundColor: Colors.white + '25', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5, marginTop: 2,
  },
  profileBadgeText: { fontSize: 12, color: Colors.white, fontWeight: '600' },

  statsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20, marginTop: -20,
    borderRadius: 20, flexDirection: 'row',
    padding: 18, alignItems: 'center', justifyContent: 'space-around',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15,
    shadowRadius: 20, elevation: 10, marginBottom: 20,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.secondary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },

  section: { paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  addBtn: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.primary + '40',
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },

  appointmentCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 4, marginBottom: 8,
  },
  apptAvatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  apptAvatarEmoji: { fontSize: 28 },
  apptInfo: { flex: 1, gap: 3 },
  apptName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  apptSpecialty: { fontSize: 12, color: Colors.textSecondary },
  apptDate: { fontSize: 12, color: Colors.secondary, fontWeight: '600', marginTop: 2 },
  apptBadge: {
    backgroundColor: Colors.secondary + '18',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  apptBadgeText: { fontSize: 11, color: Colors.secondary, fontWeight: '700' },

  // Cards section
  cardsRow: { gap: 12, paddingRight: 4 },
  cardItem: {
    width: width * 0.65, height: 110, borderRadius: 18,
    padding: 16, overflow: 'hidden', justifyContent: 'space-between',
  },
  cardGradient: {
    position: 'absolute', bottom: -20, right: -20,
    width: 130, height: 130, borderRadius: 65, opacity: 0.35,
  },
  cardItemTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardItemLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },
  defaultBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  cardItemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardItemBalance: { fontSize: 18, fontWeight: '800', color: '#fff' },
  cardDeleteBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardDeleteIcon: { fontSize: 14 },

  addCardPlaceholder: {
    width: 120, height: 110, borderRadius: 18,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  addCardPlusIcon: { fontSize: 24, color: Colors.secondary },
  addCardPlusText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  emptyCard: {
    height: 110, borderRadius: 18,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  emptyCardIcon: { fontSize: 28 },
  emptyCardText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  emptyCardSub: { fontSize: 12, color: Colors.textLight },

  settingsCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 4,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIconBg: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  settingIcon: { fontSize: 20 },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  settingSubtitle: { fontSize: 12, color: Colors.textLight, marginTop: 1 },
  settingArrow: { fontSize: 22, color: Colors.textLight, fontWeight: '300' },

  logoutBtn: {
    marginHorizontal: 20, height: 52,
    backgroundColor: Colors.error + '15', borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderWidth: 1.5, borderColor: Colors.error + '30', marginBottom: 16,
  },
  logoutIcon: { fontSize: 20 },
  logoutText: { fontSize: 16, fontWeight: '700', color: Colors.error },
  versionText: { fontSize: 12, color: Colors.textLight, textAlign: 'center', marginBottom: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, gap: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalField: { gap: 8 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  modalInput: {
    height: 50, backgroundColor: Colors.inputBg, borderRadius: 14,
    paddingHorizontal: 16, fontSize: 16, color: Colors.textPrimary,
    borderWidth: 1.5, borderColor: Colors.border, fontWeight: '600', letterSpacing: 1,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalCancel: {
    flex: 1, height: 50, borderRadius: 14,
    backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  modalSave: {
    flex: 1, height: 50, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
