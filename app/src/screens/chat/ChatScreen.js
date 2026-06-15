import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMessages, sendMessage } from '../../services/api';
import { COLORS } from '../../constants/colors';

export default function ChatScreen({ route, navigation }) {
  const { matchId, name } = route.params;
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    const data = await getMessages(matchId, token);
    if (Array.isArray(data)) setMessages(data);
    setLoading(false);
  };

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const content = text.trim();
    setText('');
    await sendMessage(matchId, content, token);
    await load();
    setSending(false);
    listRef.current?.scrollToEnd({ animated: true });
  };

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={COLORS.terracotta} />
    </View>
  );

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <View style={s.avatarSmall}>
          <Text style={s.avatarEmoji}>👤</Text>
        </View>
        <Text style={s.headerName}>{name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMe = item.sender_id === user?.id;
          return (
            <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
              <Text style={[s.bubbleText, isMe ? s.textMe : s.textThem]}>
                {item.content}
              </Text>
              <Text style={s.time}>
                {new Date(item.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={text}
          onChangeText={setText}
          placeholder="Écris un message..."
          placeholderTextColor="#bbb"
          multiline
        />
        <TouchableOpacity
          style={[s.sendBtn, (!text.trim() || sending) && s.sendBtnOff]}
          onPress={send}
          disabled={!text.trim() || sending}
        >
          {sending
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.sendIcon}>➤</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: 14,
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: '#fff'
  },
  back: { padding: 8, marginRight: 4 },
  backText: { fontSize: 32, color: COLORS.terracotta, lineHeight: 32 },
  avatarSmall: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.terracottaBg, alignItems: 'center', justifyContent: 'center', marginRight: 10
  },
  avatarEmoji: { fontSize: 18 },
  headerName: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  list: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: '78%', padding: 12, borderRadius: 18, marginBottom: 8
  },
  bubbleMe: {
    alignSelf: 'flex-end', backgroundColor: COLORS.terracotta,
    borderBottomRightRadius: 4
  },
  bubbleThem: {
    alignSelf: 'flex-start', backgroundColor: COLORS.offWhite,
    borderWidth: 1, borderColor: COLORS.border, borderBottomLeftRadius: 4
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  textMe: { color: '#fff' },
  textThem: { color: COLORS.textDark },
  time: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4, textAlign: 'right' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff'
  },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15,
    color: COLORS.textDark, backgroundColor: COLORS.offWhite,
    maxHeight: 100, marginRight: 10
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.terracotta, alignItems: 'center', justifyContent: 'center'
  },
  sendBtnOff: { opacity: 0.4 },
  sendIcon: { color: '#fff', fontSize: 18 },
});
