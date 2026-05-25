import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Svg, { Circle, Polyline } from 'react-native-svg';
import i18n from './i18n';

function Logo() {
  return (
    <Svg width="80" height="80" viewBox="0 0 160 160">
      <Circle cx="80" cy="80" r="70" fill="none" stroke="#1D9E75" strokeWidth="1" opacity="0.15"/>
      <Circle cx="80" cy="80" r="56" fill="none" stroke="#1D9E75" strokeWidth="1.5" opacity="0.3"/>
      <Circle cx="80" cy="80" r="42" fill="none" stroke="#1D9E75" strokeWidth="2" opacity="0.5"/>
      <Circle cx="80" cy="80" r="32" fill="#1D9E75"/>
      <Polyline points="64,82 72,92 96,66" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      setError(i18n.t('enterEmail'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://alertkind-production.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
      } else {
        setError(i18n.t('emailNotFound'));
      }
    } catch (e) {
      setError(i18n.t('couldNotConnect'));
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <Text style={styles.sentEmoji}>📧</Text>
        <Text style={styles.sentTitle}>Check your email!</Text>
        <Text style={styles.sentSub}>We sent a sign-in link to{'\n'}<Text style={styles.sentEmail}>{email}</Text></Text>
        <Text style={styles.sentNote}>The link expires in 15 minutes.</Text>
        <TouchableOpacity onPress={() => setSent(false)} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Use a different email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Logo />
        <Text style={styles.logoText}>ALERTKIND</Text>
      </View>

      <Text style={styles.title}>{i18n.t('welcomeBack')}</Text>
      <Text style={styles.subtitle}>Enter your email and we'll send you a sign-in link</Text>

      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#444"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85}>
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send sign-in link'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/register')} style={styles.link}>
        <Text style={styles.linkText}>{i18n.t('noAccount')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14', padding: 28, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoText: { color: '#1D9E75', fontSize: 18, fontWeight: '700', letterSpacing: 4, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 40, lineHeight: 22 },
  input: { backgroundColor: '#141420', borderWidth: 1, borderColor: '#222', borderRadius: 12, padding: 14, color: 'white', fontSize: 15, marginBottom: 16 },
  error: { color: '#E05252', fontSize: 13, marginBottom: 16 },
  button: { backgroundColor: '#1D9E75', paddingVertical: 18, borderRadius: 100, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#555', fontSize: 13 },
  sentEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 24 },
  sentTitle: { fontSize: 28, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 16 },
  sentSub: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 26, marginBottom: 12 },
  sentEmail: { color: '#1D9E75', fontWeight: '600' },
  sentNote: { fontSize: 13, color: '#444', textAlign: 'center', marginBottom: 40 },
  backBtn: { alignItems: 'center' },
  backBtnText: { color: '#555', fontSize: 14 },
});