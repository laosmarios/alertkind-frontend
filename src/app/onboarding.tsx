import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

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

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const handleNext = async () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
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

      <View style={styles.content}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === current ? '#1D9E75' : '#222' }]} />
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
  emoji: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 16, lineHeight: 36 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 26, paddingHorizontal: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  button: { backgroundColor: '#1D9E75', paddingVertical: 20, borderRadius: 20, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footer: { textAlign: 'center', color: '#333', fontSize: 11 },
});