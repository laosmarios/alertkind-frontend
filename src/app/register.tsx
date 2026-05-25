import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Svg, { Circle, Polyline } from 'react-native-svg';
import i18n from './i18n';

function Logo() {
  return (
    <Svg width="60" height="60" viewBox="0 0 160 160">
      <Circle cx="80" cy="80" r="70" fill="none" stroke="#1D9E75" strokeWidth="1" opacity="0.15"/>
      <Circle cx="80" cy="80" r="56" fill="none" stroke="#1D9E75" strokeWidth="1.5" opacity="0.3"/>
      <Circle cx="80" cy="80" r="42" fill="none" stroke="#1D9E75" strokeWidth="2" opacity="0.5"/>
      <Circle cx="80" cy="80" r="32" fill="#1D9E75"/>
      <Polyline points="64,82 72,92 96,66" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [alertHours, setAlertHours] = useState('48');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !contactEmail) {
      setError(i18n.t('fillAllFields'));
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
      if (response.ok) {
        setSent(true);
      } else {
        setError(data.error || i18n.t('couldNotConnect'));
      }
    } catch (e) {
      setError(i18n.t('couldNotConnect'));
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <View style={styles.sentContainer}>
        <Text style={styles.sentEmoji}>📧</Text>
        <Text style={styles.sentTitle}>Check your email!</Text>
        <Text style={styles.sentSub}>We sent a verification link to{'\n'}<Text style={styles.sentEmail}>{email}</Text></Text>
        <Text style={styles.sentNote}>Click the link to activate your account.{'\n'}It expires in 15 minutes.</Text>
        <TouchableOpacity onPress={() => setSent(false)} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Use a different email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.logoWrap}>
        <Logo />
        <Text style={styles.logoText}>ALERTKIND</Text>
      </View>

      <Text style={styles.title}>{i18n.t('welcomeTo')}</Text>
      <Text style={styles.subtitle}>{i18n.t('setupCheckin')}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>{i18n.t('yourName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Maria"
          placeholderTextColor="#444"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>{i18n.t('yourEmail')}</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#444"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{i18n.t('trustedContactEmail')}</Text>
        <Text style={styles.labelSub}>{i18n.t('trustedContactSub')}</Text>
        <TextInput
          style={styles.input}
          placeholder="friend@example.com"
          placeholderTextColor="#444"
          value={contactEmail}
          onChangeText={setContactEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{i18n.t('dailyReminder')}</Text>
        <TextInput
          style={styles.input}
          placeholder="09:00"
          placeholderTextColor="#444"
          value={reminderTime}
          onChangeText={setReminderTime}
        />

        <Text style={styles.label}>{i18n.t('alertAfter')}</Text>
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
          <Text style={styles.buttonText}>{loading ? i18n.t('settingUp') : i18n.t('getStarted')}</Text>
        </TouchableOpacity>

        <View style={styles.termsRow}>
          <Text style={styles.termsText}>By registering you agree to our </Text>
          <TouchableOpacity onPress={() => router.push('/terms')}>
            <Text style={styles.termsLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}> and </Text>
          <TouchableOpacity onPress={() => router.push('/privacy')}>
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/login')} style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>{i18n.t('footer')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14' },
  content: { padding: 28, paddingTop: 60 },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
  logoText: { color: '#1D9E75', fontSize: 16, fontWeight: '700', letterSpacing: 3 },
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
  button: { backgroundColor: '#1D9E75', paddingVertical: 18, borderRadius: 100, alignItems: 'center', marginTop: 32 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  termsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 },
  termsText: { color: '#555', fontSize: 12 },
  termsLink: { color: '#1D9E75', fontSize: 12 },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#555', fontSize: 13 },
  footer: { textAlign: 'center', color: '#333', fontSize: 11, marginTop: 40 },
  sentContainer: { flex: 1, backgroundColor: '#0a0a14', padding: 28, justifyContent: 'center', alignItems: 'center' },
  sentEmoji: { fontSize: 64, marginBottom: 24 },
  sentTitle: { fontSize: 28, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 16 },
  sentSub: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 26, marginBottom: 12 },
  sentEmail: { color: '#1D9E75', fontWeight: '600' },
  sentNote: { fontSize: 13, color: '#444', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  backBtn: { alignItems: 'center' },
  backBtnText: { color: '#555', fontSize: 14 },
});