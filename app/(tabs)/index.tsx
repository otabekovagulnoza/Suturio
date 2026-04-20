import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { specialists } from '@/data/specialists';

const { width } = Dimensions.get('window');

const QUICK_FILTERS = [
  { id: 'surgery', label: 'Jarrohlik', ionicon: 'cut-outline' as const, color: '#00D4FF' },
  { id: 'wound', label: 'Chok', ionicon: 'bandage-outline' as const, color: '#00C48C' },
  { id: 'therapy', label: 'Terapevt', ionicon: 'medical-outline' as const, color: '#9B59B6' },
  { id: 'ortho', label: 'Ortoped', ionicon: 'body-outline' as const, color: '#F39C12' },
  { id: 'rehab', label: 'Reabilitolog', ionicon: 'fitness-outline' as const, color: '#27AE60' },
  { id: 'derma', label: 'Dermatolog', ionicon: 'scan-outline' as const, color: '#E74C3C' },
];

const HEALTH_LOGS = [
  { id: '1', time: '09:00', date: 'Apr 21', humidity: 68, temp: 36.7, status: 'normal' },
  { id: '2', time: '12:00', date: 'Apr 21', humidity: 72, temp: 37.1, status: 'warning' },
  { id: '3', time: '15:00', date: 'Apr 21', humidity: 65, temp: 36.9, status: 'normal' },
  { id: '4', time: '18:00', date: 'Apr 21', humidity: 61, temp: 36.5, status: 'normal' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [humidity, setHumidity] = useState(68);
  const [temp, setTemp] = useState(36.7);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHumidity(prev => Math.min(80, Math.max(50, prev + (Math.random() - 0.5) * 3)));
      setTemp(prev => Math.min(38.5, Math.max(36.0, prev + (Math.random() - 0.5) * 0.2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const featured = specialists.filter(s => s.isFeatured);
  const filtered = activeFilter
    ? specialists.filter(s => s.categoryId === activeFilter)
    : specialists;

  const go = (path: string, params?: object) =>
    router.push({ pathname: path, ...(params ? { params } : {}) } as any);

  const humidityColor = humidity > 75 ? Colors.error : humidity < 55 ? Colors.warning : Colors.success;
  const tempColor = temp > 37.5 ? Colors.error : temp < 36.0 ? Colors.warning : Colors.primary;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.appName}>Suturio</Text>
          <Text style={styles.appTagline}>Post-op monitoring & konsultatsiya</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => Alert.alert('Bildirishnomalar', '• Sensor: Namlik yuqori (72%)\n• Dr. Kamola: Ertaga 10:00 uchrashuvingiz bor')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={Colors.white} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Sensor Status Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorLeft}>
              <View style={[styles.sensorDot, { backgroundColor: connected ? Colors.success : Colors.error }]} />
              <Text style={styles.sensorTitle}>{connected ? 'Qurilma ulangan' : 'Qurilma uzilgan'}</Text>
            </View>
            <View style={styles.sensorRight}>
              <Ionicons name="bluetooth" size={14} color={connected ? Colors.primary : Colors.textLight} />
              <Text style={styles.sensorSub}>Patch v2.1</Text>
            </View>
          </View>

          {/* Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View style={[styles.metricIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="water-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.metricVal, { color: humidityColor }]}>{humidity.toFixed(0)}%</Text>
              <Text style={styles.metricLabel}>Namlik</Text>
              <View style={[styles.metricBadge, { backgroundColor: humidityColor + '20' }]}>
                <Text style={[styles.metricBadgeText, { color: humidityColor }]}>
                  {humidity > 75 ? 'Yuqori' : humidity < 55 ? 'Past' : 'Normal'}
                </Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={[styles.metricIcon, { backgroundColor: Colors.warning + '20' }]}>
                <Ionicons name="thermometer-outline" size={20} color={Colors.warning} />
              </View>
              <Text style={[styles.metricVal, { color: tempColor }]}>{temp.toFixed(1)}°C</Text>
              <Text style={styles.metricLabel}>Harorat</Text>
              <View style={[styles.metricBadge, { backgroundColor: tempColor + '20' }]}>
                <Text style={[styles.metricBadgeText, { color: tempColor }]}>
                  {temp > 37.5 ? 'Isitma' : temp < 36.0 ? 'Past' : 'Normal'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Logs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sog'liq jurnali</Text>
          </View>
          {HEALTH_LOGS.map(log => (
            <View key={log.id} style={styles.logItem}>
              <View style={[styles.logDot, { backgroundColor: log.status === 'warning' ? Colors.warning : Colors.success }]} />
              <View style={styles.logContent}>
                <Text style={styles.logTime}>{log.date} • {log.time}</Text>
                <Text style={styles.logValues}>💧 {log.humidity}%   🌡 {log.temp}°C</Text>
              </View>
              <View style={[styles.logBadge, { backgroundColor: log.status === 'warning' ? Colors.warning + '20' : Colors.success + '20' }]}>
                <Text style={[styles.logBadgeText, { color: log.status === 'warning' ? Colors.warning : Colors.success }]}>
                  {log.status === 'warning' ? 'Ogohlantirish' : 'Normal'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => go('/(tabs)/specialists')}
          activeOpacity={0.85}
        >
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <Text style={styles.searchPlaceholder}>Mutaxassis yoki soha qidiring...</Text>
          <View style={styles.searchFilterTag}>
            <Ionicons name="options-outline" size={14} color={Colors.secondary} />
          </View>
        </TouchableOpacity>

        {/* Category Filters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategoriyalar</Text>
            {activeFilter && (
              <TouchableOpacity onPress={() => setActiveFilter(null)}>
                <Text style={styles.clearFilter}>Tozalash ×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.filterGrid}>
            {QUICK_FILTERS.map(f => {
              const isActive = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterBtn, isActive && { backgroundColor: f.color, borderColor: f.color }]}
                  onPress={() => setActiveFilter(prev => prev === f.id ? null : f.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.filterIconBg, isActive && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name={f.ionicon} size={20} color={isActive ? '#fff' : f.color} />
                  </View>
                  <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Featured Specialists */}
        {!activeFilter && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tavsiya etilgan</Text>
              <TouchableOpacity onPress={() => go('/(tabs)/specialists')} activeOpacity={0.7}>
                <Text style={styles.seeAll}>Barchasi</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
              {featured.map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.featuredCard}
                  onPress={() => go('/specialist/[id]', { id: s.id })}
                  activeOpacity={0.88}
                >
                  <View style={[styles.featuredAvatar, { backgroundColor: s.avatarColor + '20' }]}>
                    <Text style={[styles.featuredAvatarText, { color: s.avatarColor }]}>{s.avatar}</Text>
                    {s.isOnline && <View style={styles.onlineDotFeatured} />}
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredName} numberOfLines={1}>{s.name}</Text>
                    <Text style={styles.featuredSpec} numberOfLines={1}>{s.specialty}</Text>
                    <View style={styles.featuredMeta}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={styles.ratingTxt}>{s.rating}</Text>
                      <Text style={styles.priceTxt}> · {s.price}K</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Specialists List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter ? `Mutaxassislar (${filtered.length})` : `Barcha mutaxassislar (${filtered.length})`}
            </Text>
            <TouchableOpacity onPress={() => go('/(tabs)/specialists')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>Ko'proq</Text>
            </TouchableOpacity>
          </View>

          {filtered.slice(0, 4).map(s => (
            <TouchableOpacity
              key={s.id}
              style={styles.listCard}
              onPress={() => go('/specialist/[id]', { id: s.id })}
              activeOpacity={0.88}
            >
              <View style={[styles.listAvatarWrap, { backgroundColor: s.avatarColor + '20' }]}>
                <Text style={[styles.listAvatarText, { color: s.avatarColor }]}>{s.avatar}</Text>
                {s.isOnline && <View style={styles.listOnlineDot} />}
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{s.name}</Text>
                <Text style={styles.listSpec}>{s.specialty}</Text>
                <View style={styles.listMeta}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={styles.listRating}>{s.rating}</Text>
                  <Text style={styles.metaDot}> · </Text>
                  <Ionicons name="briefcase-outline" size={11} color={Colors.textLight} />
                  <Text style={styles.listExp}> {s.experience} yil</Text>
                </View>
              </View>
              <View style={styles.listRight}>
                <Text style={styles.listPrice}>{s.price}K</Text>
                <Text style={styles.listPriceSub}>so'm/seans</Text>
                <View style={[styles.statusTag, !s.isOnline && styles.statusTagOff]}>
                  <View style={[styles.statusDot, !s.isOnline && styles.statusDotOff]} />
                  <Text style={[styles.statusTxt, !s.isOnline && styles.statusTxtOff]}>
                    {s.isOnline ? 'Online' : 'Oflayn'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const CARD_W = (width - 52) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    backgroundColor: Colors.secondary,
    paddingBottom: 12, paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  appName: { fontSize: 22, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
  appTagline: { fontSize: 11, color: Colors.white + 'BB', fontWeight: '500' },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white + '25',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 9, right: 9,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary, borderWidth: 1.5, borderColor: Colors.secondary,
  },
  scrollContent: { paddingTop: 16, gap: 4 },

  // Sensor card
  sensorCard: {
    backgroundColor: Colors.white, marginHorizontal: 16, borderRadius: 20,
    padding: 16, marginBottom: 8,
    shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  sensorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sensorLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sensorDot: { width: 8, height: 8, borderRadius: 4 },
  sensorTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  sensorRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sensorSub: { fontSize: 12, color: Colors.textSecondary },
  metricsRow: { flexDirection: 'row', alignItems: 'center' },
  metricItem: { flex: 1, alignItems: 'center', gap: 4 },
  metricDivider: { width: 1, height: 60, backgroundColor: Colors.border },
  metricIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  metricVal: { fontSize: 28, fontWeight: '800' },
  metricLabel: { fontSize: 12, color: Colors.textSecondary },
  metricBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  metricBadgeText: { fontSize: 11, fontWeight: '700' },

  // Logs
  section: { paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  seeAll: { fontSize: 13, fontWeight: '700', color: Colors.secondary },
  clearFilter: { fontSize: 13, fontWeight: '600', color: Colors.error },

  logItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 14,
    padding: 12, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  logDot: { width: 10, height: 10, borderRadius: 5 },
  logContent: { flex: 1 },
  logTime: { fontSize: 11, color: Colors.textSecondary },
  logValues: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginTop: 1 },
  logBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  logBadgeText: { fontSize: 11, fontWeight: '700' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: 16, borderRadius: 14,
    paddingHorizontal: 14, height: 48, gap: 10, marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  searchPlaceholder: { fontSize: 14, color: Colors.textLight, flex: 1 },
  searchFilterTag: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: Colors.secondary + '20',
    alignItems: 'center', justifyContent: 'center',
  },

  // Filters
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  filterBtn: {
    width: (width - 52) / 3, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center', gap: 6,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
    marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  filterIconBg: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  filterLabel: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  filterLabelActive: { color: Colors.white },

  // Featured
  featuredRow: { gap: 12, paddingRight: 4 },
  featuredCard: {
    width: CARD_W, backgroundColor: Colors.white, borderRadius: 16,
    padding: 14, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  featuredAvatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  featuredAvatarText: { fontSize: 22, fontWeight: '700' },
  onlineDotFeatured: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.white,
  },
  featuredInfo: { alignItems: 'center', gap: 2 },
  featuredName: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  featuredSpec: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingTxt: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary },
  priceTxt: { fontSize: 11, color: Colors.secondary, fontWeight: '700' },

  // List
  listCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, marginBottom: 8,
  },
  listAvatarWrap: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  listAvatarText: { fontSize: 16, fontWeight: '700' },
  listOnlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.white,
  },
  listInfo: { flex: 1, gap: 2 },
  listName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  listSpec: { fontSize: 12, color: Colors.textSecondary },
  listMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  listRating: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary, marginLeft: 3 },
  metaDot: { color: Colors.textLight },
  listExp: { fontSize: 11, color: Colors.textLight },
  listRight: { alignItems: 'flex-end', gap: 3 },
  listPrice: { fontSize: 15, fontWeight: '800', color: Colors.secondary },
  listPriceSub: { fontSize: 9, color: Colors.textLight },
  statusTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.success + '18',
    borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
  },
  statusTagOff: { backgroundColor: Colors.border },
  statusDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.success },
  statusDotOff: { backgroundColor: Colors.textLight },
  statusTxt: { fontSize: 10, fontWeight: '600', color: Colors.success },
  statusTxtOff: { color: Colors.textLight },
});
