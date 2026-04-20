import Colors from '@/constants/Colors';
import { Chat, chats } from '@/data/chats';
import { specialists } from '@/data/specialists';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

function ChatItem({ item, onPress }: { item: Chat; onPress: () => void }) {
  const specialist = specialists.find((s) => s.id === item.specialistId);
  const photoUri = specialist?.photo;

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.85}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarPhoto} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: item.specialistAvatarColor + '30' }]}>
            <Text style={styles.avatarInitials}>
              {item.specialistName.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </Text>
          </View>
        )}
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      {/* Info */}
      <View style={styles.chatInfo}>
        <View style={styles.chatTop}>
          <Text style={styles.chatName} numberOfLines={1}>{item.specialistName}</Text>
          <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
        </View>
        <Text style={styles.chatSpecialty}>{item.specialistSpecialty}</Text>
        <View style={styles.chatBottom}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const [chatList] = useState<Chat[]>(chats);

  if (chatList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Xabarlar</Text>
          <Text style={styles.headerSubtitle}>Mutaxassislar bilan suhbat</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={72} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Hali xabarlar yo'q</Text>
          <Text style={styles.emptySubtitle}>
            Mutaxassis profilini ochib{`\n`}"Xabar yozish" tugmasini bosing
          </Text>
          <TouchableOpacity
            style={styles.findBtn}
            onPress={() => router.push({ pathname: '/(tabs)/specialists' } as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="search" size={16} color={Colors.white} />
            <Text style={styles.findBtnText}>Mutaxassis topish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xabarlar</Text>
        <Text style={styles.headerSubtitle}>{chatList.length} ta suhbat</Text>
      </View>

      {/* Chat list */}
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatItem
            item={item}
            onPress={() =>
              router.push({ pathname: '/chat/[id]', params: { id: item.id } } as any)
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: Colors.primary,
    paddingTop: STATUS_HEIGHT + 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    gap: 14,
  },
  avatarWrap: {
    width: 58, height: 58, borderRadius: 29,
    position: 'relative',
  },
  avatarPhoto: {
    width: 58, height: 58, borderRadius: 29,
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 20, fontWeight: '800', color: Colors.secondary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatInfo: {
    flex: 1,
    gap: 3,
  },
  chatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 8,
  },
  chatSpecialty: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '600',
  },
  chatBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 92,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
    marginTop: -80,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  findBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 13,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  findBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
