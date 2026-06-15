import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet, ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMatches } from '../../services/api';
import { COLORS } from '../../constants/colors';

export default function MatchesScreen({ navigation }) {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await getMatches(token);
    setMatches(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={COLORS.terracotta} />
    </View>
  );

  if (matches.length === 0) return (
    <View style={s.center}>
      <Text style={s.emptyEmoji}>💬</Text>
      <Text style={s.emptyTitle}>Pas encore de matchs</Text>
      <Text style={s.emptySub}>Commence à liker des profils !</Text>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>💬 Mes Matchs</Text>
        <Text style={s.headerSub}>{matches.length} conversation{matches.length > 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.match_id.toString()}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.row}
            onPress={() => navigation.navigate('Chat', {
              matchId: item.match_id,
              name: item.name || 'Artiste'
            })}
          >
            {item.photo_url ? (
              <Image source={{ uri: item.photo_url }} style={s.avatar} />
            ) : (
              <View style={s.avatarPlaceholder}>
                <Text style={s.avatarEmoji}>👤</Text>
              </View>
            )}
            <View style={s.rowText}>
              <Text style={s.rowName}>{item.name || 'Artiste'}</Text>
              <Text style={s.rowLast} numberOfLines={1}>
                {item.last_message || 'Dites bonjour !'}
              </Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.terracotta },
  headerSub: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 16, marginBottom: 8, borderRadius: 16,
    backgroundColor: COLORS.offWhite, borderWidth: 1, borderColor: COLORS.border
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.terracottaBg, alignItems: 'center', justifyContent: 'center'
  },
  avatarEmoji: { fontSize: 24 },
  rowText: { flex: 1, marginLeft: 14 },
  rowName: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  rowLast: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 22, color: COLORS.textLight },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  emptySub: { fontSize: 15, color: COLORS.textLight },
});
