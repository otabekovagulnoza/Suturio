import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { categories } from '@/data/categories';
import { specialists, Specialist } from '@/data/specialists';

const { width } = Dimensions.get('window');

const SORT_OPTIONS = [
  { id: 'rating', label: 'Reyting' },
  { id: 'price_asc', label: 'Arzon avval' },
  { id: 'price_desc', label: 'Qimmat avval' },
  { id: 'experience', label: 'Tajriba' },
];

function SpecialistCard({ item, onPress }: { item: Specialist; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.cardAvatarWrap}>
        <Image source={{ uri: item.photo }} style={styles.cardPhoto} />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardName}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardSpecialty}>{item.specialty}</Text>
        <View style={styles.cardTags}>
          {item.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.cardBottom}>
          <View style={styles.cardMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="briefcase-outline" size={12} color={Colors.textLight} />
              <Text style={styles.metaItem}>{item.experience} yil</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color={Colors.textLight} />
              <Text style={styles.metaItem}>{item.location.split(',')[1]?.trim() ?? item.location}</Text>
            </View>
          </View>
          <View style={styles.cardAction}>
            <Text style={styles.cardPrice}>{item.price}K so'm</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={onPress} activeOpacity={0.8}>
              <Text style={styles.bookBtnText}>Yozilish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SpecialistsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string; query?: string }>();

  const [search, setSearch] = useState(params.query ?? '');
  const [selectedCategory, setSelectedCategory] = useState(params.category ?? 'all');
  const [sortBy, setSortBy] = useState('rating');
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let list = [...specialists];

    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.categoryId === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.specialty.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'experience') return b.experience - a.experience;
      return 0;
    });

    return list;
  }, [search, selectedCategory, sortBy]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Mutaxassislar</Text>
        <Text style={styles.headerSubtitle}>{filtered.length} ta topildi</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ism yoki soha bo'yicha..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips */}
      <View style={styles.filtersSection}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategory === item.id && { backgroundColor: item.color, borderColor: item.color },
              ]}
              onPress={() => setSelectedCategory(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.ionicon as any}
                size={14}
                color={selectedCategory === item.id ? Colors.white : item.color ?? Colors.textSecondary}
              />
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item.id && styles.chipTextActive,
                ]}
              >
                {item.name.replace('\n', ' ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Saralash:</Text>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setShowSort(!showSort)}
          activeOpacity={0.8}
        >
          <Ionicons name="funnel-outline" size={13} color={Colors.secondary} />
          <Text style={styles.sortBtnText}>
            {SORT_OPTIONS.find((o) => o.id === sortBy)?.label}
          </Text>
          <Ionicons name={showSort ? 'chevron-up' : 'chevron-down'} size={13} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={[styles.sortDropdown, { top: insets.top + 130 }]}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.sortOption, sortBy === opt.id && styles.sortOptionActive]}
              onPress={() => { setSortBy(opt.id); setShowSort(false); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.sortOptionText, sortBy === opt.id && styles.sortOptionTextActive]}>
                {opt.label}
              </Text>
              {sortBy === opt.id && <Ionicons name="checkmark" size={16} color={Colors.secondary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={56} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Hech narsa topilmadi</Text>
            <Text style={styles.emptySubtitle}>Boshqa kalit so'z yoki kategoriya tanlang</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SpecialistCard
            item={item}
            onPress={() => router.push({ pathname: '/specialist/[id]', params: { id: item.id } } as any)}
          />
        )}
      />
    </View>
  );
}

const STATUS_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.white + 'CC',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textLight,
    padding: 4,
  },
  filtersSection: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chipsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  sortDropdown: {
    position: 'absolute',
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 99,
    overflow: 'hidden',
    minWidth: 160,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.secondary + '15',
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  cardAvatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'relative',
  },
  cardPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    resizeMode: 'cover',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cardInfo: {
    flex: 1,
    gap: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  cardSpecialty: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.secondary + '18',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: Colors.secondaryDark,
    fontWeight: '600',
  },
  cardBottom: {
    gap: 6,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaItem: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500',
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  bookBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
