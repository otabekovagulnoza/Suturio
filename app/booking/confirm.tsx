import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { specialists } from '@/data/specialists';
import { cards as mockCards, PaymentCard, CARD_THEMES } from '@/data/cards';

const { width } = Dimensions.get('window');

function CardVisual({ card }: { card: PaymentCard }) {
  const theme = CARD_THEMES[card.type];
  return (
    <View style={[styles.cardVisual, { backgroundColor: theme.bg[0] }]}>
      <View style={[styles.cardGradient, { backgroundColor: theme.bg[1] }]} />
      <View style={styles.cardTop}>
        <Text style={styles.cardLogo}>{theme.logo}</Text>
        <Text style={styles.cardLabel}>{theme.label}</Text>
      </View>
      <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardHolderLabel}>Karta egasi</Text>
          <Text style={styles.cardHolder}>{card.holderName}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.cardHolderLabel}>Muddati</Text>
          <Text style={styles.cardHolder}>{card.expiryMonth}/{card.expiryYear}</Text>
        </View>
      </View>
    </View>
  );
}

export default function BookingConfirm() {
  const { specialistId, day, time, price } = useLocalSearchParams<{
    specialistId: string;
    day: string;
    time: string;
    price: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const specialist = specialists.find((s) => s.id === specialistId);
  const [cards, setCards] = useState<PaymentCard[]>(mockCards);
  const [selectedCardId, setSelectedCardId] = useState(cards.find((c) => c.isDefault)?.id ?? cards[0]?.id);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNum, setNewCardNum] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId);
  const sessionPrice = Number(price ?? specialist?.price ?? 0);

  const handleAddCard = () => {
    if (newCardNum.length < 16 || newCardExpiry.length < 5) {
      Alert.alert('Xato', 'Karta raqami va muddatini to\'liq kiriting.');
      return;
    }
    const [month, year] = newCardExpiry.split('/');
    const newCard: PaymentCard = {
      id: `card_${Date.now()}`,
      type: newCardNum.startsWith('860') ? 'uzcard' : 'humo',
      lastFour: newCardNum.slice(-4),
      holderName: 'FOYDALANUVCHI',
      expiryMonth: month,
      expiryYear: year,
      isDefault: false,
    };
    setCards((prev) => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    setShowAddCard(false);
    setNewCardNum('');
    setNewCardExpiry('');
  };

  const handlePay = () => {
    if (!selectedCard) {
      Alert.alert('Karta tanlang', 'Iltimos, to\'lov kartasini tanlang.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '✅ Muvaffaqiyatli!',
        `${sessionPrice}K so'm to'landi.\n\n${specialist?.name} bilan ${day}, ${time} da uchrashuvingiz tasdiqlandi.`,
        [
          {
            text: 'Bosh sahifaga',
            onPress: () => router.replace({ pathname: '/(tabs)' } as any),
          },
        ]
      );
    }, 2000);
  };

  if (!specialist) {
    return (
      <View style={styles.center}>
        <Text>Mutaxassis topilmadi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Qabulni tasdiqlash</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Appointment summary */}
        <View style={styles.appointmentCard}>
          <View style={[styles.apptAvatar, { backgroundColor: specialist.avatarColor + '30' }]}>
            <Text style={styles.apptAvatarEmoji}>{specialist.avatar}</Text>
          </View>
          <View style={styles.apptInfo}>
            <Text style={styles.apptName}>{specialist.name}</Text>
            <Text style={styles.apptSpecialty}>{specialist.specialty}</Text>
          </View>
        </View>

        {/* Date/time info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Sana va vaqt</Text>
            <Text style={styles.infoValue}>{day}, {time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏱ Muddat</Text>
            <Text style={styles.infoValue}>50 daqiqa</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Format</Text>
            <Text style={styles.infoValue}>{specialist.isOnline ? '🟢 Onlayn' : '📍 Oflayn'}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>💰 Narxi</Text>
            <Text style={[styles.infoValue, styles.priceValue]}>{sessionPrice}K so'm</Text>
          </View>
        </View>

        {/* Payment section */}
        <Text style={styles.sectionTitle}>💳 To'lov usuli</Text>

        {/* Card list */}
        <View style={styles.cardsList}>
          {cards.map((card) => {
            const isSelected = card.id === selectedCardId;
            const theme = CARD_THEMES[card.type];
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardRow, isSelected && styles.cardRowSelected]}
                onPress={() => setSelectedCardId(card.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.cardMiniIcon, { backgroundColor: theme.bg[0] }]}>
                  <Text style={styles.cardMiniLabel}>{theme.label}</Text>
                </View>
                <View style={styles.cardMiniInfo}>
                  <Text style={styles.cardMiniNumber}>•••• {card.lastFour}</Text>
                  <Text style={styles.cardMiniBalance}>
                    {card.balance !== undefined ? `${card.balance}K so'm` : ''}
                    {card.isDefault ? ' · Asosiy' : ''}
                  </Text>
                </View>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Add card */}
          <TouchableOpacity
            style={styles.addCardBtn}
            onPress={() => setShowAddCard(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.addCardIcon}>＋</Text>
            <Text style={styles.addCardText}>Yangi karta qo'shish</Text>
          </TouchableOpacity>
        </View>

        {/* Selected card preview */}
        {selectedCard && (
          <View style={styles.cardPreview}>
            <CardVisual card={selectedCard} />
          </View>
        )}

        {/* Price summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Seans narxi</Text>
            <Text style={styles.summaryValue}>{sessionPrice}K so'm</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servis to'lovi</Text>
            <Text style={styles.summaryValue}>Bepul</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Jami</Text>
            <Text style={styles.summaryTotalValue}>{sessionPrice}K so'm</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePay} activeOpacity={0.85} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="card-outline" size={18} color={Colors.white} />
              <Text style={styles.payBtnText}>To'lash — {sessionPrice}K so'm</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Add card modal */}
      <Modal visible={showAddCard} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Karta qo'shish</Text>
            <Text style={styles.modalSubtitle}>UzCard yoki Humo kartangizni qo'shing</Text>

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
                  if (t.length === 2 && !t.includes('/')) {
                    setNewCardExpiry(t + '/');
                  } else {
                    setNewCardExpiry(t);
                  }
                }}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowAddCard(false)}
                activeOpacity={0.8}
              >
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: Colors.secondary,
    paddingTop: STATUS_HEIGHT + 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white + '25',
    alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { fontSize: 20, color: Colors.white, fontWeight: '700' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.white },

  content: { padding: 16, gap: 16 },

  appointmentCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  apptAvatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  apptAvatarEmoji: { fontSize: 32 },
  apptInfo: { gap: 4 },
  apptName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  apptSpecialty: { fontSize: 13, color: Colors.textSecondary },

  infoCard: {
    backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { fontSize: 13, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  priceValue: { fontSize: 15, fontWeight: '800', color: Colors.primary },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },

  cardsList: { gap: 10 },
  cardRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardRowSelected: { borderColor: Colors.secondary, backgroundColor: Colors.secondary + '08' },
  cardMiniIcon: {
    width: 52, height: 34, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  cardMiniLabel: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  cardMiniInfo: { flex: 1 },
  cardMiniNumber: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  cardMiniBalance: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: Colors.secondary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.secondary },

  addCardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: 14,
    padding: 14, borderWidth: 1.5, borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addCardIcon: { fontSize: 22, color: Colors.secondary, fontWeight: '300' },
  addCardText: { fontSize: 14, fontWeight: '600', color: Colors.secondary },

  cardPreview: { alignItems: 'center' },
  cardVisual: {
    width: width - 32, height: 190, borderRadius: 20, padding: 22,
    justifyContent: 'space-between', overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute', bottom: 0, right: 0,
    width: '70%', height: '70%', borderRadius: 200, opacity: 0.4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLogo: { fontSize: 24 },
  cardLabel: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  cardNumber: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardHolderLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  cardHolder: { fontSize: 13, fontWeight: '700', color: '#fff' },

  summaryCard: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 18,
    gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: Colors.border },
  summaryTotal: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.secondary },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 16,
  },
  payBtn: {
    height: 56, backgroundColor: Colors.secondary,
    borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
  },
  payBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: Platform.OS === 'ios' ? 48 : 24,
    gap: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: -8 },
  modalField: { gap: 8 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  modalInput: {
    height: 50, backgroundColor: Colors.inputBg,
    borderRadius: 14, paddingHorizontal: 16,
    fontSize: 16, color: Colors.textPrimary,
    borderWidth: 1.5, borderColor: Colors.border,
    fontWeight: '600', letterSpacing: 1,
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
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
