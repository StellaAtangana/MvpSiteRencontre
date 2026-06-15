import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, Modal, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getDiscover, likeUser } from '../../services/api';
import { COLORS } from '../../constants/colors';

export default function DiscoverScreen() {
  const { token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState(false);
  const [matchedName, setMatchedName] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getDiscover(token);
      setProfiles(Array.isArray(data) ? data : []);
      setIndex(0);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const current = profiles[index];

  const handleLike = async () => {
    if (!current) return;
    try {
      const res = await likeUser(current.id, token);
      if (res.match) {
        setMatchedName(current.name || 'quelqu\'un');
        setMatchModal(true);
      }
    } catch { }
    setIndex(i => i + 1);
  };

  const handlePass = () => setIndex(i => i + 1);

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={COLORS.terracotta} />
    </View>
  );

  if (!current) return (
    <View style={s.center}>
      <Text style={s.emptyEmoji}>🎨</Text>
      <Text style={s.emptyTitle}>Plus personne à découvrir</Text>
      <Text style={s.emptySub}>Reviens plus tard !</Text>
      <TouchableOpacity style={s.reloadBtn} onPress={load}>
        <Text style={s.reloadText}>Actualiser</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>🎨 ArtMatch</Text>
        <Text style={s.headerSub}>Découvrir</Text>
      </View>

      {/* Card */}
      <View style={s.card}>
        {current.photo_url ? (
          <Image source={{ uri: current.photo_url }} style={s.photo} />
        ) : (
          <View style={s.photoPlaceholder}>
            <Text style={s.photoEmoji}>👤</Text>
          </View>
        )}
        <View style={s.cardInfo}>
          <Text style={s.name}>
            {current.name || 'Artiste'}{current.age ? `, ${current.age}` : ''}
          </Text>
          {current.bio ? (
            <Text style={s.bio} numberOfLines={3}>{current.bio}</Text>
          ) : (
            <Text style={s.bioEmpty}>Aucune bio</Text>
          )}
        </View>
      </View>

      {/* Buttons */}
      <View style={s.buttons}>
        <TouchableOpacity style={s.passBtn} onPress={handlePass} activeOpacity={0.8}>
          <Text style={s.passEmoji}>✕</Text>
          <Text style={s.passText}>Passer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.likeBtn} onPress={handleLike} activeOpacity={0.8}>
          <Text style={s.likeEmoji}>♥</Text>
          <Text style={s.likeText}>J'aime</Text>
        </TouchableOpacity>
      </View>

      {/* Counter */}
      <Text style={s.counter}>{profiles.length - index - 1} profils restants</Text>

      {/* Match Modal */}
      <Modal visible={matchModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.matchEmoji}>🎉</Text>
            <Text style={s.matchTitle}>C'est un match !</Text>
            <Text style={s.matchSub}>Toi et {matchedName} vous vous plaisez !</Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => setMatchModal(false)}>
              <Text style={s.modalBtnText}>Super !</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.terracotta },
  headerSub: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  card: { marginHorizontal: 20, borderRadius: 24, backgroundColor: '#fff', overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  photo: { width: '100%', height: 340, backgroundColor: COLORS.terracottaBg },
  photoPlaceholder: { width: '100%', height: 340, backgroundColor: COLORS.terracottaBg, alignItems: 'center', justifyContent: 'center' },
  photoEmoji: { fontSize: 80 },
  cardInfo: { padding: 20 },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.textDark },
  bio: { fontSize: 15, color: COLORS.textMid, marginTop: 8, lineHeight: 22 },
  bioEmpty: { fontSize: 14, color: COLORS.textLight, marginTop: 8, fontStyle: 'italic' },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 24, paddingHorizontal: 20 },
  passBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderColor: '#ddd', backgroundColor: '#fff' },
  passEmoji: { fontSize: 18, color: '#999' },
  passText: { fontSize: 16, fontWeight: '700', color: '#999' },
  likeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16, backgroundColor: COLORS.terracotta, elevation: 4 },
  likeEmoji: { fontSize: 18, color: '#fff' },
  likeText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  counter: { textAlign: 'center', marginTop: 16, fontSize: 13, color: COLORS.textLight },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  emptySub: { fontSize: 15, color: COLORS.textLight, marginBottom: 24 },
  reloadBtn: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, borderWidth: 2, borderColor: COLORS.terracotta },
  reloadText: { color: COLORS.terracotta, fontWeight: '700', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%' },
  matchEmoji: { fontSize: 64, marginBottom: 12 },
  matchTitle: { fontSize: 28, fontWeight: '800', color: COLORS.terracotta, marginBottom: 8 },
  matchSub: { fontSize: 16, color: COLORS.textMid, textAlign: 'center', marginBottom: 24 },
  modalBtn: { backgroundColor: COLORS.terracotta, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
