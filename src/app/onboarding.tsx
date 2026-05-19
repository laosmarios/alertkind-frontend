import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Polyline } from 'react-native-svg';

const slides = [
  {
    emoji: '🛡️',
    title: 'Your daily safety check-in',
    subtitle: 'AlertKind lets your loved ones know you are okay — with just one tap a day.',
  },
  {
    emoji: '📧',
    title: 'Someone always knows',
    subtitle: 'If you miss your check-in, your trusted contact gets an alert automatically.',
  },
  {
    emoji: '⚡',
    title: 'Takes 1 second a day',
    subtitle: 'Open the app, tap "I\'m okay", and your contact is notified. That\'s it.',
  },
];

function Logo() {
  return (
    <Svg width="160" height="160" viewBox="0 0 160 160">
      <Circle cx="80" cy="80" r="70" fill="none" stroke="#1D9E75" strokeWidth="1" opacity="0.15"/>
      <Circle cx="80" cy="80" r="56" fill="none" stroke="#1D9E75" strokeWidth="1.5" opacity="0.3"/>
      <Circle cx="80" cy="80" r="42" fill="none" stroke="#1D9E75" strokeWidth="2" opacity="0.5"/>
      <Circle cx="80" cy="80" r="32" fill="#1D9E75"/>
      <Polyline points="64,82 72,92 96,66" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(nextIndex);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = async () => {
    if (current < slides.length - 1) {
      animateTransition(current + 1);
    } else {
      await AsyncStorage.setItem('onboarding_done', 'true');
      router.replace('/register');
    }
  };

  const slide = slides[current];

  return (
    <View style={styles.container}>
      <View style={styles.skipRow}>
        <TouchableOpacity onPress={async () => {
          await AsyncStorage.setItem('onboarding_done', 'true');
          router.replace('/register');
        }}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        {current === 0 ? (
          <View style={styles.logoWrap}>
            <Logo />
            <Text style={styles.logoText}>ALERTKIND</Text>
          </View>
        ) : (
          <Text style={styles.emoji}>{slide.emoji}</Text>
        )}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === current ? '#1D9E75' : '#222', width: i === current ? 20 : 8 }]} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {current < slides.length - 1 ? 'Next' : 'Get started'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>AlertKind · Your daily safety check-in</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14', padding: 28, justifyContent: 'space-between' },
  skipRow: { paddingTop: 60, alignItems: 'flex-end' },
  skip: { color: '#555', fontSize: 14 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoText: { color: '#1D9E75', fontSize: 22, fontWeight: '700', letterSpacing: 4, marginTop: 12 },
  emoji: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 26, paddingHorizontal: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  button: { backgroundColor: '#1D9E75', paddingVertical: 20, borderRadius: 100, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footer: { textAlign: 'center', color: '#333', fontSize: 11 },
});