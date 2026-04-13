import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/api';

export default function RegisterScreen({ navigation }) {
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const { login } = useAuth();

const handleRegister = async () => {
    if (!email || !phone || !password) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
    }
    setLoading(true);
    try {
        const data = await registerUser(email, phone, password);
        if (data.token) {
        await login(data.user, data.token);
        } else {
        Alert.alert('Erreur', data.message);
            }
    } catch (error) {
        Alert.alert('Erreur', 'Inscription impossible');
    } finally {
        setLoading(false);
    }
};

    return (
    <View style={styles.container}>
        <Text style={styles.title}>🎨 ArtMatch</Text>
        <Text style={styles.subtitle}>Créer un compte</Text>

    <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
    />

    <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
    />

    <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
/>

<TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
>
        {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.buttonText}>S'inscrire</Text>
        }
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
</TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff'
},
title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#6C3483'
},
subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#888'
},
input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16
},
button: {
    backgroundColor: '#6C3483',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16
},
buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
},
link: {
    textAlign: 'center',
    color: '#6C3483',
    fontSize: 14
}
});