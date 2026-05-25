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

      <Text style={styles.section}>1. Data Controller</Text>
      <Text style={styles.body}>AlertKind is operated as an independent service. For any data-related inquiries, contact us at alertkind.support@gmail.com. The service is governed by the laws of the Republic of Cyprus.</Text>

      <Text style={styles.section}>2. Information We Collect</Text>
      <Text style={styles.body}>We collect your name, email address, trusted contact email, daily reminder time, alert preferences, and timezone when you register. We also store the time and date of your daily check-ins.</Text>

      <Text style={styles.section}>3. How We Use Your Information</Text>
      <Text style={styles.body}>Your information is used solely to provide the AlertKind service — sending daily reminders and alerting your trusted contact if you miss a check-in. We do not use your data for marketing or advertising.</Text>

      <Text style={styles.section}>4. Data Retention</Text>
      <Text style={styles.body}>We retain your personal data for as long as your account is active. When you delete your account, all your personal data and check-in history is permanently deleted within 24 hours.</Text>

      <Text style={styles.section}>5. Data Storage</Text>
      <Text style={styles.body}>Your data is stored securely using Supabase, a trusted cloud database provider based in the EU. We do not sell or share your data with third parties.</Text>

      <Text style={styles.section}>6. Email Communications</Text>
      <Text style={styles.body}>We send transactional emails via Resend for daily reminders and alert notifications. These are essential to the service and cannot be opted out of while your account is active. You can delete your account at any time to stop all communications.</Text>

      <Text style={styles.section}>7. Cookies</Text>
      <Text style={styles.body}>AlertKind does not use tracking cookies. We only use essential session storage to keep you logged in on your device.</Text>

      <Text style={styles.section}>8. Your Rights (GDPR)</Text>
      <Text style={styles.body}>If you are located in the European Union or European Economic Area, you have the following rights:{'\n\n'}• Right to access your personal data{'\n'}• Right to correct inaccurate data{'\n'}• Right to delete your data{'\n'}• Right to data portability{'\n'}• Right to object to processing{'\n\n'}You can exercise these rights by deleting your account in the app or contacting us at alertkind.support@gmail.com.</Text>

      <Text style={styles.section}>9. Minimum Age</Text>
      <Text style={styles.body}>AlertKind is intended for users aged 16 and older. By registering, you confirm that you are at least 16 years old. If you are under 16, please do not use this service.</Text>

      <Text style={styles.section}>10. Changes to This Policy</Text>
      <Text style={styles.body}>We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Continued use of the app after changes constitutes acceptance.</Text>

      <Text style={styles.section}>11. Contact</Text>
      <Text style={styles.body}>For any privacy-related questions, contact us at alertkind.support@gmail.com</Text>

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