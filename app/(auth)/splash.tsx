import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { getSession } from '@/utils/auth';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const circleScale1 = useRef(new Animated.Value(0)).current;
  const circleScale2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start circle background animations
    Animated.parallel([
      Animated.spring(circleScale1, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(circleScale2, {
        toValue: 1,
        tension: 15,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo animation
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Title animation
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Subtitle animation
    Animated.sequence([
      Animated.delay(1100),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    Animated.sequence([
      Animated.delay(1500),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Check session while animation plays, navigate accordingly
    const timer = setTimeout(async () => {
      const session = await getSession();
      if (session) {
        // Already logged in — skip login, go straight to home
        router.replace({ pathname: '/(tabs)' } as any);
      } else {
        // Not logged in
        router.replace({ pathname: '/(auth)/login' } as any);
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background decorative circles */}
      <Animated.View
        style={[
          styles.bgCircle1,
          { transform: [{ scale: circleScale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle2,
          { transform: [{ scale: circleScale2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle3,
          { transform: [{ scale: circleScale1 }] },
        ]}
      />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, pulseAnim) },
              ],
            },
          ]}
        >
          <View style={styles.logoInner}>
            {/* Cross / Medical icon */}
            <View style={styles.crossHorizontal} />
            <View style={styles.crossVertical} />
            <View style={styles.heartDot} />
          </View>
          {/* Outer ring */}
          <View style={styles.logoRing} />
        </Animated.View>

        {/* App name */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          <Text style={styles.appName}>Suturio</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>Shifobaxsh ulanish</Text>
            <View style={styles.taglineLine} />
          </View>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Shifokor va psixiatrlar bilan{'\n'}bir qadamda bog'laning
        </Animated.Text>
      </View>

      {/* Bottom section */}
      <Animated.View style={[styles.bottomSection, { opacity: subtitleOpacity }]}>
        <View style={styles.dotRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: Colors.secondaryDark + '40',
    top: -width * 0.3,
    left: -width * 0.1,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primary + '30',
    bottom: -width * 0.1,
    right: -width * 0.15,
  },
  bgCircle3: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: Colors.primaryLight + '20',
    bottom: height * 0.15,
    left: -width * 0.1,
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 46,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.secondary,
  },
  crossVertical: {
    position: 'absolute',
    width: 14,
    height: 46,
    borderRadius: 7,
    backgroundColor: Colors.secondary,
  },
  heartDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    top: 22,
    right: 22,
  },
  logoRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.white + '50',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  taglineLine: {
    height: 1,
    width: 30,
    backgroundColor: Colors.white + '70',
  },
  tagline: {
    fontSize: 13,
    color: Colors.white + 'CC',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white + 'CC',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 40,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    gap: 12,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white + '40',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.white,
  },
  versionText: {
    fontSize: 12,
    color: Colors.white + '60',
  },
});
