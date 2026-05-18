import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [alertHours, setAlertHours] = useState('48');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !contactEmail) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch('https://alertkind-production.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          contact_email: contactEmail,
          reminder_time: reminderTime,
          alert_hours: parseInt(alertHours),
          timezone,
        }),
      });
      const data = await response.json();
      if (data.user) {
        await AsyncStorage.setItem('user_id', data.user.id);
        await AsyncStorage.setItem('user_name', data.user.name);
        router.replace('/');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (e) {
      setError('Could not connect to server');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome to AlertKind</Text>
      <Text style={styles.subtitle}>Set up your daily check-in in seconds</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Maria"
          placeholderTextColor="#444"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Your email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#444"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Trusted contact email</Text>
        <Text style={styles.labelSub}>This person will be notified if you miss a check-in</Text>
        <TextInput
          style={styles.input}
          placeholder="friend@example.com"
          placeholderTextColor="#444"
          value={contactEmail}
          onChangeText={setContactEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Daily reminder time</Text>
        <TextInput
          style={styles.input}
          placeholder="09:00"
          placeholderTextColor="#444"
          value={reminderTime}
          onChangeText={setReminderTime}
        />

        <Text style={styles.label}>Alert contact after</Text>
        <View style={styles.hoursRow}>
          {['24', '48', '72'].map(h => (
            <TouchableOpacity
              key={h}
              style={[styles.hourBtn, alertHours === h && styles.hourBtnActive]}
              onPress={() => setAlertHours(h)}
            >
              <Text style={[styles.hourBtnText, alertHours === h && styles.hourBtnTextActive]}>
                {h}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{loading ? 'Setting up...' : 'Get started'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>AlertKind · Your daily safety check-in</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14' },
  content: { padding: 28, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 40, lineHeight: 22 },
  form: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#aaa', marginTop: 16, marginBottom: 4 },
  labelSub: { fontSize: 11, color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#141420', borderWidth: 1, borderColor: '#222', borderRadius: 12, padding: 14, color: 'white', fontSize: 15 },
  hoursRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  hourBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#222', alignItems: 'center', backgroundColor: '#141420' },
  hourBtnActive: { borderColor: '#1D9E75', backgroundColor: '#0d2a1a' },
  hourBtnText: { color: '#555', fontWeight: '600' },
  hourBtnTextActive: { color: '#1D9E75' },
  error: { color: '#E05252', fontSize: 13, marginTop: 8 },
  button: { backgroundColor: '#1D9E75', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 32 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footer: { textAlign: 'center', color: '#333', fontSize: 11, marginTop: 40 },
});