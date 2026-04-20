import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { specialists } from '@/data/specialists';

const { width } = Dimensions.get('window');

const DAYS = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(rating) ? 'star' : 'star-outline'}
          size={14}
          color={star <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
    </View>
  );
}

export default function SpecialistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const specialist = specialists.find((s) => s.id === id);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  if (!specialist) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Mutaxassis topilmadi</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSimple}>
          <Text style={styles.backBtnSimpleText}>← Orqaga</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBook = () => {
    if (!selectedTime) {
      Alert.alert('Vaqt tanlang', 'Iltimos, qabul vaqtini tanlang.');
      return;
    }
    router.push({
      pathname: '/booking/confirm',
      params: {
        specialistId: specialist.id,
        day: DAYS[selectedDay],
        time: selectedTime,
        price: String(specialist.price),
      },
    } as any);
  };

  const handleMessage = () => {
    // Navigate to chat — find chat by specialistId or use specialistId directly
    router.push({ pathname: '/chat/[id]', params: { id: specialist.id } } as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[]}>
        {/* Hero Header with real photo */}
        <View style={styles.hero}>
          {/* Real photo background */}
          <Image source={{ uri: specialist.photo }} style={styles.heroBgPhoto} />
          {/* Dark gradient overlay */}
          <View style={styles.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>

          {/* Foreground portrait */}
          <View style={styles.heroAvatarWrap}>
            <Image source={{ uri: specialist.photo }} style={styles.heroPhoto} />
            {specialist.isOnline && (
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineBadgeText}>● Online</Text>
              </View>
            )}
          </View>

          <Text style={styles.heroName}>{specialist.name}</Text>
          <Text style={styles.heroSpecialty}>{specialist.specialty}</Text>

          {/* Rating row */}
          <View style={styles.heroRatingRow}>
            <StarRating rating={specialist.rating} />
            <Text style={styles.heroRating}>{specialist.rating}</Text>
            <Text style={styles.heroReviewCount}>({specialist.reviewCount} ta izoh)</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{specialist.experience}</Text>
            <Text style={styles.statLabel}>Yil tajriba</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{specialist.reviewCount}+</Text>
            <Text style={styles.statLabel}>Bemorlar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{specialist.price}K</Text>
            <Text style={styles.statLabel}>So'm/seans</Text>
          </View>
        </View>

        <View style={styles.infoChips}>
          <View style={styles.infoChip}>
            <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.chipText}>{specialist.location}</Text>
          </View>
          <View style={styles.infoChip}>
            <Ionicons name="globe-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.chipText}>{specialist.languages.join(', ')}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'about' && styles.tabItemActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>Haqida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'reviews' && styles.tabItemActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
              Izohlar ({specialist.reviewCount})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'about' ? (
          <View style={styles.content}>
            {/* Bio */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📋 Bio</Text>
              <Text style={styles.bioText}>{specialist.bio}</Text>
            </View>

            {/* Education */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎓 Ta'lim</Text>
              <Text style={styles.bioText}>{specialist.education}</Text>
            </View>

            {/* Tags */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏷️ Ixtisosliklar</Text>
              <View style={styles.tagsRow}>
                {specialist.tags.map((tag) => (
                  <View key={tag} style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Schedule */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📅 Qabul vaqtlari</Text>

              {/* Day selector */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                {DAYS.map((day, idx) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayBtn, selectedDay === idx && styles.dayBtnActive]}
                    onPress={() => { setSelectedDay(idx); setSelectedTime(null); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayText, selectedDay === idx && styles.dayTextActive]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Time slots */}
              <View style={styles.timeSlotsGrid}>
                {specialist.timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.timeSlotUnavailable,
                      selectedTime === slot.time && styles.timeSlotSelected,
                    ]}
                    onPress={() => slot.available && setSelectedTime(slot.time)}
                    activeOpacity={slot.available ? 0.8 : 1}
                    disabled={!slot.available}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        !slot.available && styles.timeSlotTextUnavailable,
                        selectedTime === slot.time && styles.timeSlotTextSelected,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedTime && (
                <View style={styles.selectedInfo}>
                  <Text style={styles.selectedInfoText}>
                    ✅ Tanlandi: {DAYS[selectedDay]}, {selectedTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {specialist.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.author[0]}</Text>
                  </View>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <View style={styles.reviewMeta}>
                      <StarRating rating={review.rating} />
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
            <View style={styles.reviewSummary}>
              <Text style={styles.reviewSummaryText}>
                Umumiy {specialist.reviewCount} ta izoh mavjud. Hozircha eng so'nggi 2 tasini ko'rsatmoqda.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.messageBtn} onPress={handleMessage} activeOpacity={0.8}>
          <Ionicons name="chatbubble-outline" size={22} color={Colors.secondary} />
          <Text style={styles.messageBtnText}>Xabar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook} activeOpacity={0.85}>
          <Ionicons name="calendar-outline" size={18} color={Colors.white} />
          <Text style={styles.bookBtnText}>Qabul olish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const STATUS_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 50;
const HERO_HEIGHT = 280 + STATUS_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  backBtnSimple: { padding: 8 },
  backBtnSimpleText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 28,
    overflow: 'hidden',
    gap: 6,
    position: 'relative',
  },
  heroBgPhoto: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroAvatarWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  heroPhoto: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  backBtn: {
    position: 'absolute',
    top: STATUS_HEIGHT + 12,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: '700',
    marginTop: -2,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    marginBottom: 4,
    position: 'relative',
  },
  heroAvatarEmoji: { fontSize: 54 },
  onlineBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  onlineBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  heroSpecialty: {
    fontSize: 14,
    color: Colors.white + 'CC',
    fontWeight: '500',
  },
  heroRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroRating: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  heroReviewCount: {
    fontSize: 13,
    color: Colors.white + 'BB',
  },
  statsRow: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.secondary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  infoChips: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipIcon: { fontSize: 14 },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.secondary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  tabTextActive: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bioText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: Colors.secondary + '15',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  tagBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryDark,
  },
  daysScroll: {
    marginHorizontal: -4,
  },
  dayBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 3,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayBtnActive: {
    backgroundColor: Colors.secondary + '20',
    borderColor: Colors.secondary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayTextActive: {
    color: Colors.secondary,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: (width - 32 - 36 - 20) / 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  timeSlotUnavailable: {
    backgroundColor: Colors.border + '60',
    borderColor: 'transparent',
    opacity: 0.5,
  },
  timeSlotSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeSlotTextUnavailable: {
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },
  timeSlotTextSelected: {
    color: Colors.white,
  },
  selectedInfo: {
    backgroundColor: Colors.secondary + '15',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  selectedInfoText: {
    fontSize: 13,
    color: Colors.secondaryDark,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.secondary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  reviewInfo: { flex: 1, gap: 4 },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.textLight,
  },
  reviewComment: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  reviewSummary: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  reviewSummaryText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  messageBtn: {
    width: 56,
    height: 54,
    borderRadius: 15,
    backgroundColor: Colors.secondary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.secondary + '30',
    gap: 2,
  },
  messageBtnIcon: { fontSize: 20 },
  messageBtnText: {
    fontSize: 10,
    color: Colors.secondary,
    fontWeight: '600',
  },
  bookBtn: {
    flex: 1,
    height: 54,
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
