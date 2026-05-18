import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [checkedIn, setCheckedIn] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const loadUser = async () => {
      const onboardingDone = await AsyncStorage.getItem('onboarding_done');
      const id = await AsyncStorage.getItem('user_id');
      const name = await AsyncStorage.getItem('user_name');

      if (!onboardingDone) {
        router.replace('/onboarding');
        return;
      }

      if (!id) {
        router.replace('/login');
        return;
      }

      setUserId(id);
      setUserName(name || '');

      try {
        const res = await fetch(`https://alertkind-production.up.railway.app/checkin/today/${id}`);
        const data = await res.json();
        if (data.checkedIn) {
          checkAnim.setValue(1);
          setCheckedIn(true);
        }
      } catch (e) {
        console.log('Error checking today status:', e);
      }
    };
    loadUser();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const handleCheckin = async () => {
    try {
      const response = await fetch('https://alertkind-production.up.railway.app/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (data.checkin) {
        Animated.timing(checkAnim, { toValue: 1, duration: 800, useNativeDriver: false, easing: Easing.out(Easing.ease) }).start();
        setCheckedIn(true);
      }
    } catch (e) {
      console.log('Error:', e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user_name');
    router.replace('/login');
  };

  const bgColor = checkAnim.interpolate({ inputRange: [0, 1], outputRange: ['#0a0a14', '#071a12'] });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={styles.appName}>AlertKind</Text>
        <View style={styles.headerRight}>
          <View style={[styles.dot, { backgroundColor: checkedIn ? '#1D9E75' : '#444' }]} />
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>{greeting}{userName ? `, ${userName}` : ''} 👋</Text>
      <Text style={styles.subtitle}>
        {checkedIn ? 'Your contact knows you are okay' : 'One tap is all it takes to let them know'}
      </Text>

      <Animated.View style={[styles.ringOuter, { transform: [{ scale: checkedIn ? 1 : pulseAnim }] }]}>
        <View style={styles.ringInner}>
          <Text style={styles.ringEmoji}>{checkedIn ? '✅' : '🛡️'}</Text>
          <Text style={[styles.ringStatus, { color: checkedIn ? '#1D9E75' : '#555' }]}>
            {checkedIn ? 'Checked in ✓' : 'Waiting...'}
          </Text>
        </View>
      </Animated.View>

      {!checkedIn ? (
        <TouchableOpacity style={styles.button} onPress={handleCheckin} activeOpacity={0.85}>
          <Text style={styles.buttonText}>I'm okay</Text>
          <Text style={styles.buttonSub}>Tap to notify your contact</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>🌿</Text>
          <Text style={styles.successTitle}>All good!</Text>
          <Text style={styles.successSub}>Your contact has been notified. Have a great day!</Text>
        </View>
      )}

      <Text style={styles.footer}>AlertKind · Your daily check-in</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  header: { position: 'absolute', top: 56, left: 28, right: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appName: { fontSize: 18, fontWeight: '700', color: 'white', letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  headerBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  headerBtnText: { color: '#555', fontSize: 12 },
  greeting: { fontSize: 26, fontWeight: '700', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 52, lineHeight: 22, paddingHorizontal: 16 },
  ringOuter: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: '#1D9E75', alignItems: 'center', justifyContent: 'center', marginBottom: 52 },
  ringInner: { alignItems: 'center' },
  ringEmoji: { fontSize: 52 },
  ringStatus: { fontSize: 13, marginTop: 12, fontWeight: '500' },
  button: { backgroundColor: '#1D9E75', width: width - 56, paddingVertical: 20, borderRadius: 20, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 20, fontWeight: '700' },
  buttonSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
  successCard: { backgroundColor: '#0d2a1a', width: width - 56, padding: 28, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1D9E75' },
  successEmoji: { fontSize: 36, marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#1D9E75', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22 },
  footer: { position: 'absolute', bottom: 32, fontSize: 11, color: '#333', letterSpacing: 0.5 },
});