import Colors from '@/constants/Colors';
import { Chat, chats, Message } from '@/data/chats';
import { specialists } from '@/data/specialists';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QUICK_REPLIES = [
  'Ha, albatta!',
  'Rahmat! 🙏',
  'Qachon bo\'ladi?',
  'Tushundim',
  'Ertaga 10:00 da',
];

function MessageBubble({ msg }: { msg: Message }) {
  const isMe = msg.senderId === 'user';
  return (
    <View style={[styles.bubbleRow, isMe && styles.bubbleRowMe]}>
      {!isMe && (
        <View style={styles.bubbleAvatar}>
          <Text style={styles.bubbleAvatarText}>Dr</Text>
        </View>
      )}
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{msg.text}</Text>
        <View style={styles.bubbleMeta}>
          <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>{msg.time}</Text>
          {isMe && (
            <Text style={[styles.bubbleRead, msg.read && styles.bubbleReadSeen]}>
              {msg.read ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Find chat by chat id OR by specialist id
  const existingChat = chats.find((c) => c.id === id) ?? chats.find((c) => c.specialistId === id);

  // If no existing chat, build one on the fly from specialist data
  const specialist = !existingChat ? specialists.find((s) => s.id === id) : null;
  const now = new Date();
  const nowStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const virtualChat: Chat | undefined = specialist
    ? {
      id: `virtual_${specialist.id}`,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialistAvatar: specialist.avatar,
      specialistAvatarColor: specialist.avatarColor,
      specialistSpecialty: specialist.specialty,
      isOnline: specialist.isOnline,
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0,
      messages: [
        {
          id: 'welcome',
          senderId: 'specialist',
          text: `Assalomu alaykum! Men ${specialist.name} — ${specialist.specialty}. Qanday yordam bera olaman? 😊`,
          time: nowStr,
          read: true,
        },
      ],
    }
    : undefined;

  const chat: Chat | undefined = existingChat ?? virtualChat;

  const [messages, setMessages] = useState<Message[]>(chat?.messages ?? []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  // Mark messages as read
  useEffect(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }, []);

  const simulateReply = (userMessage: string) => {
    setIsTyping(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(typingAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    const replies: Record<string, string> = {
      'salom': 'Vaalaykum assalom! Siz bilan suhbatdan mamnunman 😊',
      'assalomu alaykum': 'Vaalaykum assalom! Qanday yordam bera olaman?',
      'ha': 'Ajoyib! Unda kelishib oldik. Sizni kutaman! 😊',
      'rahmat': 'Arzimaydi! Savollaringiz bo\'lsa, xabar yuboring.',
      'narx': `Konsultatsiya narxi ${chat?.specialistSpecialty === 'Psixolog' ? '150' : '200'}K so'm. To'lov seans kuni amalga oshiriladi.`,
      'qachon': 'Siz uchun qulay vaqtni tanlang. Ertaga 10:00, 11:00 yoki 14:00 da band bo\'laman.',
    };

    const lower = userMessage.toLowerCase();
    let reply = 'Xabaringizni qabul qildim. Tez orada javob beraman. 🙂';

    for (const [key, val] of Object.entries(replies)) {
      if (lower.includes(key)) {
        reply = val;
        break;
      }
    }

    setTimeout(() => {
      setIsTyping(false);
      typingAnim.stopAnimation();
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const replyMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: 'specialist',
        text: reply,
        time: timeStr,
        read: true,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'user',
      text,
      time: timeStr,
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    simulateReply(text);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendQuickReply = (text: string) => {
    setInputText(text);
  };

  if (!chat) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Suhbat topilmadi</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Orqaga</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: chat.specialistAvatarColor + '30' }]}>
          <Text style={styles.headerAvatarEmoji}>{chat.specialistAvatar}</Text>
          {chat.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.specialistName}</Text>
          <Text style={styles.headerStatus}>
            {chat.isOnline ? '🟢 Onlayn' : '⚫ Oflayn'}
            {' · '}{chat.specialistSpecialty}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() =>
            router.push({ pathname: '/specialist/[id]', params: { id: chat.specialistId } } as any)
          }
          activeOpacity={0.8}
        >
          <Text style={styles.callBtnIcon}>📋</Text>
        </TouchableOpacity>
      </View>

      {/* Date separator */}
      <View style={styles.dateSeparator}>
        <View style={styles.dateLine} />
        <Text style={styles.dateText}>Bugun</Text>
        <View style={styles.dateLine} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.bubbleRow}>
              <View style={styles.bubbleAvatar}>
                <Text style={styles.bubbleAvatarText}>Dr</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleThem, styles.typingBubble]}>
                <View style={styles.typingDots}>
                  {[0, 1, 2].map((i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.typingDot,
                        {
                          opacity: typingAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: i === 1 ? [1, 0] : [0, 1],
                          }),
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick replies */}
      <View style={styles.quickRepliesSection}>
        <FlatList
          data={QUICK_REPLIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.quickRepliesRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickReply}
              onPress={() => sendQuickReply(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickReplyText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          style={styles.input}
          placeholder="Xabar yozing..."
          placeholderTextColor={Colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          activeOpacity={0.8}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendBtnIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF4F7',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  backLink: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Header
  header: {
    backgroundColor: Colors.secondary,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
    marginTop: -2,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.white + '50',
  },
  headerAvatarEmoji: { fontSize: 22 },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  headerStatus: {
    fontSize: 12,
    color: Colors.white + 'CC',
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnIcon: { fontSize: 18 },

  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textLight + '50',
  },
  dateText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    backgroundColor: '#EDF4F7',
    paddingHorizontal: 6,
  },

  // Messages
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 2,
  },
  bubbleRowMe: {
    flexDirection: 'row-reverse',
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleAvatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
  },
  bubble: {
    maxWidth: width * 0.7,
    borderRadius: 18,
    padding: 12,
    gap: 4,
  },
  bubbleMe: {
    backgroundColor: Colors.secondary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: Colors.white,
  },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  bubbleTime: {
    fontSize: 11,
    color: Colors.textLight,
  },
  bubbleTimeMe: {
    color: Colors.white + 'AA',
  },
  bubbleRead: {
    fontSize: 11,
    color: Colors.white + '80',
    fontWeight: '700',
  },
  bubbleReadSeen: {
    color: Colors.primaryLight,
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textLight,
  },

  // Quick replies
  quickRepliesSection: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickRepliesRow: {
    paddingHorizontal: 14,
    gap: 8,
  },
  quickReply: {
    backgroundColor: Colors.secondary + '18',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.secondary + '35',
  },
  quickReplyText: {
    fontSize: 13,
    color: Colors.secondaryDark,
    fontWeight: '600',
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Colors.inputBg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    lineHeight: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnIcon: {
    fontSize: 16,
    color: Colors.white,
    marginLeft: 2,
  },
});
