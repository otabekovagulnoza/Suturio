import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

type UserRole = 'patient' | 'doctor';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  icon: string;
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  icon,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.spring(borderAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.spring(borderAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inputBg, '#F8FAE8'],
  });

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Animated.View style={[styles.inputWrapper, { borderColor, backgroundColor: bgColor }]}>
        <Text style={[styles.inputIcon, focused && styles.inputIconActive]}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

interface RoleCardProps {
  role: UserRole;
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
  icon: string;
  title: string;
  description: string;
}

function RoleCard({ role, selectedRole, onSelect, icon, title, description }: RoleCardProps) {
  const isSelected = role === selectedRole;
  return (
    <TouchableOpacity
      style={[styles.roleCard, isSelected && styles.roleCardSelected]}
      onPress={() => onSelect(role)}
      activeOpacity={0.8}
    >
      <View style={[styles.roleIconBg, isSelected && styles.roleIconBgSelected]}>
        <Text style={styles.roleIcon}>{icon}</Text>
      </View>
      <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>{title}</Text>
      <Text style={[styles.roleDesc, isSelected && styles.roleDescSelected]}>{description}</Text>
      {isSelected && (
        <View style={styles.roleCheck}>
          <Text style={styles.roleCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = fullName && phone && password && confirmPassword && password === confirmPassword;

  const handleRegister = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.headerBg}>
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoSmall}>
            <View style={styles.crossH} />
            <View style={styles.crossV} />
          </View>
          <Text style={styles.headerTitle}>Ro'yxatdan o'tish</Text>
          <Text style={styles.headerSubtitle}>Yangi hisob yarating</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Role Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Siz kimningsiz?</Text>
          <View style={styles.roleRow}>
            <RoleCard
              role="patient"
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
              icon="🧑‍⚕️"
              title="Bemor"
              description="Mutaxassis qidiraman"
            />
            <RoleCard
              role="doctor"
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
              icon="👨‍⚕️"
              title="Mutaxassis"
              description="Shifokor/Psixiatr"
            />
          </View>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shaxsiy ma'lumotlar</Text>

          <InputField
            label="To'liq ism"
            placeholder="Ismingiizni kiriting"
            value={fullName}
            onChangeText={setFullName}
            icon="👤"
          />

          <InputField
            label="Telefon raqam"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon="📱"
          />

          <InputField
            label="Email (ixtiyoriy)"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="📧"
          />

          <InputField
            label="Parol"
            placeholder="Parol yarating"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="🔒"
          />

          <InputField
            label="Parolni tasdiqlang"
            placeholder="Parolni qayta kiriting"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="🔐"
          />

          {confirmPassword !== '' && password !== confirmPassword && (
            <View style={styles.errorRow}>
              <Text style={styles.errorText}>⚠️ Parollar mos kelmadi</Text>
            </View>
          )}

          {/* Terms */}
          <View style={styles.termsRow}>
            <Text style={styles.termsText}>
              Ro'yxatdan o'tish orqali siz{' '}
              <Text style={styles.termsLink}>Foydalanish shartlari</Text>
              {'  '}va{' '}
              <Text style={styles.termsLink}>Maxfiylik siyosati</Text>
              {' '}ga rozilik bildirasiz.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, !isFormValid && styles.registerButtonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>Ro'yxatdan o'tish</Text>
                <Text style={styles.registerButtonIcon}>✓</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Nima olasiz?</Text>
          <View style={styles.featuresList}>
            {[
              { icon: '🔍', text: 'Yaqinlardagi mutaxassislarni toping' },
              { icon: '📅', text: 'Onlayn qabulga yoziling' },
              { icon: '💬', text: 'Xavfsiz maslahatlashing' },
              { icon: '⭐', text: 'Shifokorlarni baholang' },
            ].map((feat, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feat.icon}</Text>
                <Text style={styles.featureText}>{feat.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Allaqachon hisobingiz bormi?</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.loginLink}> Kirish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const HEADER_HEIGHT = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBg: {
    height: HEADER_HEIGHT,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },
  headerCircle1: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: Colors.primaryDark + '40',
    top: -width * 0.4,
    right: -width * 0.2,
  },
  headerCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: Colors.secondary + '30',
    bottom: -width * 0.15,
    left: -width * 0.1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
  logoSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  crossH: {
    position: 'absolute',
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  crossV: {
    position: 'absolute',
    width: 6,
    height: 20,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white + 'CC',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 50,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  roleIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconBgSelected: {
    backgroundColor: Colors.primary + '20',
  },
  roleIcon: {
    fontSize: 26,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleTitleSelected: {
    color: Colors.primaryDark,
  },
  roleDesc: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
  },
  roleDescSelected: {
    color: Colors.textSecondary,
  },
  roleCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCheckText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    gap: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  inputIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  inputIconActive: {
    opacity: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorRow: {
    backgroundColor: Colors.error + '15',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: -4,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
  termsRow: {
    marginTop: -4,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  registerButton: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 4,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  registerButtonIcon: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
  featuresCard: {
    backgroundColor: Colors.secondary + '15',
    borderRadius: 20,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '700',
  },
});
