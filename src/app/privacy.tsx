import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.date}>Last updated: May 2026</Text>

      <Text style={styles.section}>1. Information We Collect</Text>
      <Text style={styles.body}>We collect your name, email address, and trusted contact email when you register. We also store the time and date of your daily check-ins.</Text>

      <Text style={styles.section}>2. How We Use Your Information</Text>
      <Text style={styles.body}>Your information is used solely to provide the AlertKind service — sending daily reminders and alerting your trusted contact if you miss a check-in.</Text>

      <Text style={styles.section}>3. Data Storage</Text>
      <Text style={styles.body}>Your data is stored securely using Supabase, a trusted cloud database provider. We do not sell or share your data with third parties.</Text>

      <Text style={styles.section}>4. Email Communications</Text>
      <Text style={styles.body}>We send emails via Resend for daily reminders and alert notifications. You can delete your account at any time to stop all communications.</Text>

      <Text style={styles.section}>5. Your Rights</Text>
      <Text style={styles.body}>You have the right to access, correct, or delete your personal data at any time. You can delete your account directly from the app under Profile → Delete account.</Text>

      <Text style={styles.section}>6. GDPR Compliance</Text>
      <Text style={styles.body}>AlertKind complies with the General Data Protection Regulation (GDPR). If you are located in the European Union, you have additional rights regarding your personal data.</Text>

      <Text style={styles.section}>7. Contact</Text>
      <Text style={styles.body}>If you have any questions about this Privacy Policy, please contact us at privacy@alertkind.com</Text>

      <Text style={styles.footer}>AlertKind · alertkind.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14' },
  content: { padding: 28, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  back: { color: '#1D9E75', fontSize: 15 },
  title: { fontSize: 18, fontWeight: '700', color: 'white' },
  date: { fontSize: 12, color: '#555', marginBottom: 32 },
  section: { fontSize: 15, fontWeight: '700', color: 'white', marginTop: 24, marginBottom: 8 },
  body: { fontSize: 14, color: '#666', lineHeight: 24 },
  footer: { textAlign: 'center', color: '#333', fontSize: 11, marginTop: 48 },
});