import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen() {
  const { user, token, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, age: parseInt(age) || null, bio, photo_url: photoUrl }, token);
      await refreshUser();
      Alert.alert('✅ Enregistré', 'Profil mis à jour');
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
    setSaving(false);
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>👤 Mon Profil</Text>
        <Text style={s.headerSub}>{user?.email}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Mes infos</Text>

        <Text style={s.label}>Prénom</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Ton prénom" placeholderTextColor="#bbb" />

        <Text style={s.label}>Âge</Text>
        <TextInput style={s.input} value={age} onChangeText={setAge} placeholder="Ton âge" placeholderTextColor="#bbb" keyboardType="numeric" />

        <Text style={s.label}>Bio</Text>
        <TextInput
          style={[s.input, s.textArea]} value={bio} onChangeText={setBio}
          placeholder="Parle de toi..." placeholderTextColor="#bbb"
          multiline numberOfLines={4} textAlignVertical="top"
        />

        <Text style={s.label}>URL de ta photo</Text>
        <TextInput style={s.input} value={photoUrl} onChangeText={setPhotoUrl}
          placeholder="https://..." placeholderTextColor="#bbb" autoCapitalize="none" />

        <TouchableOpacity style={[s.saveBtn, saving && s.saveBtnOff]} onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.saveBtnText}>Enregistrer</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Text style={s.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 40 },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.terracotta },
  headerSub: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  card: {
    marginHorizontal: 20, borderRadius: 20, padding: 24, backgroundColor: '#fff',
    borderWidth: 1, borderColor: COLORS.border,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#E8E0DD', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15,
    color: COLORS.textDark, backgroundColor: COLORS.offWhite
  },
  textArea: { height: 100 },
  saveBtn: {
    backgroundColor: COLORS.terracotta, paddingVertical: 16,
    borderRadius: 14, alignItems: 'center', marginTop: 20,
    elevation: 4, shadowColor: COLORS.terracotta, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  },
  saveBtnOff: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    marginTop: 20, marginHorizontal: 20, paddingVertical: 14,
    borderRadius: 14, borderWidth: 2, borderColor: COLORS.terracotta, alignItems: 'center'
  },
  logoutText: { color: COLORS.terracotta, fontWeight: '700', fontSize: 15 },
});
