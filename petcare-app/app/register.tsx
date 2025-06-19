import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(email, password, nome);
        Alert.alert('Sucesso!', 'Conta criada com sucesso. Você já pode fazer login.', [
          {
            text: 'OK',
          onPress: () => router.replace('/'),
        },
        ]);
    } catch (error) {
      Alert.alert('Erro ao Criar Conta', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Criar Conta</Text>
          <TextInput
        placeholder="Nome"
            value={nome}
            onChangeText={setNome}
        style={{ marginBottom: 12, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <TextInput
        placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        style={{ marginBottom: 12, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <TextInput
        placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        style={{ marginBottom: 16, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
      />
      <Button title={loading ? 'Criando...' : 'Criar Conta'} onPress={handleRegister} disabled={loading} />
      <Button title="Voltar para Login" onPress={() => router.replace('/')} />
    </View>
  );
}