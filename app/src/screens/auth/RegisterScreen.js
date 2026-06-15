import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/api';
import { COLORS } from '../../constants/colors';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!email || !phone || !password) return Alert.alert('Champs manquants', 'Remplis tous les champs');
    if (password !== confirm) return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
    if (password.length < 6) return Alert.alert('Erreur', 'Mot de passe trop court (min. 6 caractères)');
    setLoading(true);
    try {
      const data = await registerUser(email, phone, password);
      if (data.token) await login(data.user, data.token);
      else Alert.alert('Erreur', data.message || 'Inscription échouée');
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le compte');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.container}>
          <View style={s.header}>
            <View style={s.logoCircle}><Text style={s.logoEmoji}>🎨</Text></View>
            <Text style={s.title}>ArtMatch</Text>
            <Text style={s.subtitle}>Crée ton profil d'artiste</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Inscription</Text>
            {[
              { label: 'Email', value: email, set: setEmail, placeholder: 'ton@email.com', type: 'email-address', cap: 'none' },
              { label: 'Téléphone', value: phone, set: setPhone, placeholder: '+33 6 00 00 00 00', type: 'phone-pad' },
              { label: 'Mot de passe', value: password, set: setPassword, placeholder: '••••••••', secure: true },
              { label: 'Confirmer', value: confirm, set: setConfirm, placeholder: '••••••••', secure: true },
            ].map(({ label, value, set, placeholder, type, cap, secure }) => (
              <View key={label}>
                <Text style={s.label}>{label}</Text>
                <TextInput style={s.input} placeholder={placeholder} placeholderTextColor="#bbb"
                  value={value} onChangeText={set} keyboardType={type || 'default'}
                  autoCapitalize={cap || 'sentences'} secureTextEntry={secure} />
              </View>
            ))}
            <TouchableOpacity style={[s.button, loading && s.buttonOff]} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Créer mon compte</Text>}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.footer}>Déjà un compte ? <Text style={s.footerBold}>Se connecter</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.terracottaBg, alignItems: 'center', justifyContent: 'center', marginBottom: 12, elevation: 4 },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.terracotta },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1.5, borderColor: '#E8E0DD', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: COLORS.textDark, backgroundColor: COLORS.offWhite },
  button: { backgroundColor: COLORS.terracotta, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 20, elevation: 4 },
  buttonOff: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 14, color: COLORS.textLight },
  footerBold: { color: COLORS.terracotta, fontWeight: '700' },
});
