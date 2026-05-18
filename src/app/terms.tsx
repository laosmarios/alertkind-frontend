import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.date}>Last updated: May 2026</Text>

      <Text style={styles.section}>1. Acceptance of Terms</Text>
      <Text style={styles.body}>By using AlertKind, you agree to these Terms of Service. If you do not agree, please do not use the app. These terms are governed by the laws of the Republic of Cyprus.</Text>

      <Text style={styles.section}>2. Description of Service</Text>
      <Text style={styles.body}>AlertKind is a daily check-in safety app. It allows users to notify a trusted contact that they are okay, and alerts that contact if a check-in is missed within the user's chosen time window.</Text>

      <Text style={styles.section}>3. Not an Emergency Service</Text>
      <Text style={styles.body}>AlertKind is NOT an emergency service. In case of emergency, contact your local emergency services immediately (e.g. 112 in Europe, 999 in Cyprus). AlertKind does not replace professional emergency services and should not be used as such.</Text>

      <Text style={styles.section}>4. Minimum Age</Text>
      <Text style={styles.body}>You must be at least 16 years old to use AlertKind. By registering, you confirm that you meet this age requirement. If you are under 16, please do not use this service.</Text>

      <Text style={styles.section}>5. User Responsibilities</Text>
      <Text style={styles.body}>You are responsible for:{'\n\n'}• Providing accurate and truthful information{'\n'}• Keeping your account secure{'\n'}• Ensuring your trusted contact is aware they may receive alerts from AlertKind{'\n'}• Not using the service for any unlawful purpose</Text>

      <Text style={styles.section}>6. Trusted Contact Consent</Text>
      <Text style={styles.body}>By adding a trusted contact email, you confirm that this person has agreed to receive alert notifications from AlertKind on your behalf. You are responsible for obtaining this consent.</Text>

      <Text style={styles.section}>7. Account Termination</Text>
      <Text style={styles.body}>You may delete your account at any time from the Profile screen. All your data will be permanently deleted. We reserve the right to terminate accounts that violate these terms without prior notice.</Text>

      <Text style={styles.section}>8. Service Availability</Text>
      <Text style={styles.body}>We aim to keep AlertKind available at all times but cannot guarantee uninterrupted service. We are not liable for any downtime or service interruptions.</Text>

      <Text style={styles.section}>9. Limitation of Liability</Text>
      <Text style={styles.body}>AlertKind is provided "as is" without warranties of any kind. We are not liable for any damages arising from missed check-ins, failed notifications, delayed alerts, or any other issues related to the service. Your use of AlertKind is at your own risk.</Text>

      <Text style={styles.section}>10. Changes to Terms</Text>
      <Text style={styles.body}>We may update these terms at any time. We will notify you of significant changes via email. Continued use of the app after changes constitutes acceptance of the new terms.</Text>

      <Text style={styles.section}>11. Contact</Text>
      <Text style={styles.body}>If you have any questions about these Terms, please contact us at legal@alertkind.com</Text>

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