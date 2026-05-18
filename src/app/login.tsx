import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email) {
      setError('Please enter your email');
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
      if (data.user) {
        await AsyncStorage.setItem('user_id', data.user.id);
        await AsyncStorage.setItem('user_name', data.user.name);
        router.replace('/');
      } else {
        setError('Email not found. Please register first.');
      }
    } catch (e) {
      setError('Could not connect to server');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Enter your email to continue</Text>

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
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Continue'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/register')} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14', padding: 28, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 40, lineHeight: 22 },
  input: { backgroundColor: '#141420', borderWidth: 1, borderColor: '#222', borderRadius: 12, padding: 14, color: 'white', fontSize: 15, marginBottom: 16 },
  error: { color: '#E05252', fontSize: 13, marginBottom: 16 },
  button: { backgroundColor: '#1D9E75', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#555', fontSize: 13 },
});