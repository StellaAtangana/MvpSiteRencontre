import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import { COLORS } from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Champs manquants', 'Remplis tous les champs');
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.token) await login(data.user, data.token);
      else Alert.alert('Erreur', data.message || 'Connexion échouée');
    } catch {
      Alert.alert('Erreur', 'Impossible de se connecter');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.container}>
          <View style={s.header}>
            <View style={s.logoCircle}><Text style={s.logoEmoji}>🎨</Text></View>
            <Text style={s.title}>ArtMatch</Text>
            <Text style={s.subtitle}>Trouve ton âme d'artiste</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Connexion</Text>
            <Text style={s.label}>Email</Text>
            <TextInput style={s.input} placeholder="ton@email.com" placeholderTextColor="#bbb"
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={s.label}>Mot de passe</Text>
            <TextInput style={s.input} placeholder="••••••••" placeholderTextColor="#bbb"
              value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={[s.button, loading && s.buttonOff]} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Se connecter</Text>}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.footer}>Pas de compte ? <Text style={s.footerBold}>S'inscrire</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 36 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.terracottaBg, alignItems: 'center', justifyContent: 'center', marginBottom: 12, elevation: 4, shadowColor: COLORS.terracotta, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.terracotta },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textDark, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1.5, borderColor: '#E8E0DD', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: COLORS.textDark, backgroundColor: COLORS.offWhite },
  button: { backgroundColor: COLORS.terracotta, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 20, elevation: 4, shadowColor: COLORS.terracotta, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  buttonOff: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 14, color: COLORS.textLight },
  footerBold: { color: COLORS.terracotta, fontWeight: '700' },
});
