import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Dimensions, TextInput } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [checkedIn, setCheckedIn] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [streak, setStreak] = useState(0);
  const [checkinTime, setCheckinTime] = useState('');
  const [note, setNote] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
          setCheckedIn(true);
        }

        const userRes = await fetch(`https://alertkind-production.up.railway.app/user/${id}`);
        const userData = await userRes.json();
        if (userData.user) setStreak(userData.user.streak || 0);

        const histRes = await fetch(`https://alertkind-production.up.railway.app/checkins/${id}`);
        const histData = await histRes.json();
        if (histData.checkins && histData.checkins.length > 0) {
          const latest = histData.checkins[0];
          const time = new Date(latest.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setCheckinTime(time);
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

  const getStreakMilestone = (s: number) => {
    if (s >= 100) return '🏆';
    if (s >= 30) return '⭐';
    return '🔥';
  };

  const handleCheckin = async () => {
    try {
      const response = await fetch('https://alertkind-production.up.railway.app/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, note: note || null }),
      });
      const data = await response.json();
      if (data.checkin) {
        setCheckedIn(true);
        setStreak(data.streak || streak + 1);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCheckinTime(time);
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

  const gradientColors = checkedIn
    ? ['#050f0a', '#071a12', '#0a0a14'] as const
    : ['#080810', '#0a0a14', '#080810'] as const;

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>AlertKind</Text>
        <View style={styles.headerRight}>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{getStreakMilestone(streak)} {streak}</Text>
            </View>
          )}
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
        <View style={styles.buttonWrap}>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note (optional)"
            placeholderTextColor="#444"
            value={note}
            onChangeText={setNote}
            maxLength={100}
          />
          <TouchableOpacity style={styles.button} onPress={handleCheckin} activeOpacity={0.85}>
            <Text style={styles.buttonText}>I'm okay</Text>
            <Text style={styles.buttonSub}>Tap to notify your contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>🌿</Text>
          <Text style={styles.successTitle}>All good!</Text>
          <Text style={styles.successSub}>Your contact has been notified.</Text>
          {note ? <Text style={styles.noteDisplay}>📝 {note}</Text> : null}
          {checkinTime ? <Text style={styles.checkinTime}>Checked in at {checkinTime}</Text> : null}
          {streak > 0 && (
            <Text style={styles.streakSub}>{getStreakMilestone(streak)} {streak} day streak!</Text>
          )}
        </View>
      )}

      <Text style={styles.footer}>AlertKind · Your daily check-in</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  header: { position: 'absolute', top: 56, left: 28, right: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appName: { fontSize: 18, fontWeight: '700', color: 'white', letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  streakBadge: { backgroundColor: '#1a1a2e', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#333' },
  streakText: { color: '#aaa', fontSize: 12, fontWeight: '600' },
  headerBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  headerBtnText: { color: '#555', fontSize: 12 },
  greeting: { fontSize: 26, fontWeight: '700', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 52, lineHeight: 22, paddingHorizontal: 16 },
  ringOuter: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: '#1D9E75', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  ringInner: { alignItems: 'center' },
  ringEmoji: { fontSize: 52 },
  ringStatus: { fontSize: 13, marginTop: 12, fontWeight: '500' },
  buttonWrap: { width: width - 56, gap: 12 },
  noteInput: { backgroundColor: '#141420', borderWidth: 1, borderColor: '#222', borderRadius: 16, padding: 14, color: 'white', fontSize: 14 },
  button: { backgroundColor: '#1D9E75', width: '100%', paddingVertical: 20, borderRadius: 100, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  buttonSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
  successCard: { backgroundColor: '#0d2a1a', width: width - 56, padding: 28, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#1D9E75' },
  successEmoji: { fontSize: 36, marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#1D9E75', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22 },
  noteDisplay: { fontSize: 13, color: '#aaa', marginTop: 8, textAlign: 'center' },
  checkinTime: { fontSize: 12, color: '#444', marginTop: 6 },
  streakSub: { fontSize: 13, color: '#1D9E75', marginTop: 8, fontWeight: '600' },
  footer: { position: 'absolute', bottom: 32, fontSize: 11, color: '#333', letterSpacing: 0.5 },
});