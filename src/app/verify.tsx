import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your link...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid link.');
        return;
      }
      try {
        const res = await fetch(`https://alertkind-production.up.railway.app/verify?token=${token}`);
        const data = await res.json();
        if (data.user) {
          await AsyncStorage.setItem('user_id', data.user.id);
          await AsyncStorage.setItem('user_name', data.user.name);
          setStatus('success');
          setMessage('Verified! Taking you to the app...');
          setTimeout(() => router.replace('/'), 1500);
        } else {
          setStatus('error');
          setMessage(data.error || 'Invalid or expired link.');
        }
      } catch (e) {
        setStatus('error');
        setMessage('Could not connect to server.');
      }
    };
    verify();
  }, [token]);

  return (
    <View style={styles.container}>
      {status === 'loading' && <ActivityIndicator size="large" color="#1D9E75" />}
      {status === 'success' && <Text style={styles.emoji}>✅</Text>}
      {status === 'error' && <Text style={styles.emoji}>❌</Text>}
      <Text style={[styles.message, { color: status === 'error' ? '#E05252' : status === 'success' ? '#1D9E75' : 'white' }]}>
        {message}
      </Text>
      {status === 'error' && (
        <Text style={styles.link} onPress={() => router.replace('/login')}>
          Back to login
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14', alignItems: 'center', justifyContent: 'center', padding: 28 },
  emoji: { fontSize: 64, marginBottom: 24 },
  message: { fontSize: 18, fontWeight: '600', textAlign: 'center', lineHeight: 28 },
  link: { color: '#1D9E75', fontSize: 14, marginTop: 24 },
});