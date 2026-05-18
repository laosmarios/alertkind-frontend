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
      <Text style={styles.body}>By using AlertKind, you agree to these Terms of Service. If you do not agree, please do not use the app.</Text>

      <Text style={styles.section}>2. Description of Service</Text>
      <Text style={styles.body}>AlertKind is a daily check-in safety app. It allows users to notify a trusted contact that they are okay, and alerts that contact if a check-in is missed.</Text>

      <Text style={styles.section}>3. Not a Emergency Service</Text>
      <Text style={styles.body}>AlertKind is not an emergency service. In case of emergency, please contact your local emergency services immediately. AlertKind does not replace professional emergency services.</Text>

      <Text style={styles.section}>4. User Responsibilities</Text>
      <Text style={styles.body}>You are responsible for providing accurate information, keeping your account secure, and ensuring your trusted contact is aware they may receive alerts from AlertKind.</Text>

      <Text style={styles.section}>5. Account Termination</Text>
      <Text style={styles.body}>You may delete your account at any time from the Profile screen. We reserve the right to terminate accounts that violate these terms.</Text>

      <Text style={styles.section}>6. Limitation of Liability</Text>
      <Text style={styles.body}>AlertKind is provided "as is". We are not liable for any damages arising from missed check-ins, failed notifications, or any other issues related to the service.</Text>

      <Text style={styles.section}>7. Changes to Terms</Text>
      <Text style={styles.body}>We may update these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.</Text>

      <Text style={styles.section}>8. Contact</Text>
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