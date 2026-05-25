import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [alertHours, setAlertHours] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) { router.replace('/login'); return; }
      const res = await fetch(`https://alertkind-production.up.railway.app/user/${id}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setContactEmail(data.user.contact_email);
        setAlertHours(String(data.user.alert_hours));
        setReminderTime(data.user.reminder_time);
      }

      const histRes = await fetch(`https://alertkind-production.up.railway.app/checkins/${id}`);
      const histData = await histRes.json();
      if (histData.checkins) setHistory(histData.checkins);
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const id = await AsyncStorage.getItem('user_id');
    const res = await fetch(`https://alertkind-production.up.railway.app/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_email: contactEmail, alert_hours: parseInt(alertHours), reminder_time: reminderTime }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirmed) return;
    const id = await AsyncStorage.getItem('user_id');
    await fetch(`https://alertkind-production.up.railway.app/user/${id}`, { method: 'DELETE' });
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user_name');
    router.replace('/login');
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const checkedIn = history.some(c => c.checked_in_at.startsWith(dateStr));
      days.push({ date, dateStr, checkedIn });
    }
    return days;
  };

  const days = getLast7Days();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Trusted contact</Text>
          {editing ? (
            <TextInput style={styles.input} value={contactEmail} onChangeText={setContactEmail} keyboardType="email-address" autoCapitalize="none" />
          ) : (
            <Text style={styles.value}>{user.contact_email}</Text>
          )}

          <Text style={styles.label}>Daily reminder</Text>
          {editing ? (
            <TextInput style={styles.input} value={reminderTime} onChangeText={setReminderTime} placeholder="09:00" />
          ) : (
            <Text style={styles.value}>{user.reminder_time}</Text>
          )}

          <Text style={styles.label}>Alert after</Text>
          <View style={styles.hoursRow}>
            {['24', '48', '72'].map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.hourBtn, alertHours === h && styles.hourBtnActive]}
                onPress={() => editing && setAlertHours(h)}
              >
                <Text style={[styles.hourBtnText, alertHours === h && styles.hourBtnTextActive]}>{h}h</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {success && <Text style={styles.success}>✓ Saved successfully!</Text>}

      {editing && (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save changes'}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Last 7 days</Text>
        <View style={styles.daysRow}>
          {days.map((d, i) => (
            <View key={i} style={styles.dayItem}>
              <View style={[styles.dayDot, { backgroundColor: d.checkedIn ? '#1D9E75' : '#222' }]} />
              <Text style={styles.dayLabel}>
                {d.date.toLocaleDateString('en-GB', { weekday: 'short' })}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Text style={styles.deleteBtnText}>Delete account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14' },
  content: { padding: 28, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  back: { color: '#1D9E75', fontSize: 15 },
  title: { fontSize: 18, fontWeight: '700', color: 'white' },
  editBtn: { color: '#1D9E75', fontSize: 15 },
  card: { backgroundColor: '#141420', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#222' },
  name: { fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 4 },
  email: { fontSize: 14, color: '#555', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#222', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  value: { fontSize: 15, color: 'white' },
  input: { backgroundColor: '#0a0a14', borderWidth: 1, borderColor: '#333', borderRadius: 10, padding: 12, color: 'white', fontSize: 15 },
  hoursRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  hourBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#222', alignItems: 'center', backgroundColor: '#0a0a14' },
  hourBtnActive: { borderColor: '#1D9E75', backgroundColor: '#0d2a1a' },
  hourBtnText: { color: '#555', fontWeight: '600' },
  hourBtnTextActive: { color: '#1D9E75' },
  success: { color: '#1D9E75', textAlign: 'center', marginTop: 16, fontSize: 14 },
  saveBtn: { backgroundColor: '#1D9E75', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
  historyCard: { backgroundColor: '#141420', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#222', marginTop: 16 },
  historyTitle: { fontSize: 14, fontWeight: '600', color: '#aaa', marginBottom: 16 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayItem: { alignItems: 'center', gap: 8 },
  dayDot: { width: 32, height: 32, borderRadius: 16 },
  dayLabel: { fontSize: 11, color: '#555' },
  deleteBtn: { marginTop: 32, paddingVertical: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E05252' },
  deleteBtnText: { color: '#E05252', fontSize: 15, fontWeight: '600' },
});