import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { styles as themeStyles, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const lastAttemptRef = useRef<number>(0);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptRef.current;
    
    if (lastAttemptRef.current && timeSinceLastAttempt < 46000) {
      const remainingSeconds = Math.ceil((46000 - timeSinceLastAttempt) / 1000);
      Alert.alert(
        'Aguarde um momento',
        `Por motivos de segurança, você precisa aguardar ${remainingSeconds} segundos antes de tentar novamente.`
      );
      return true;
    }
    
    lastAttemptRef.current = now;
    return false;
  };

  const handleRegister = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    // Basic validation (can be improved)
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert('Erro de Validação', 'Por favor, preencha todos os campos e garanta que a senha tenha pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    // Email format validation
    if (!validateEmail(email)) {
      Alert.alert('Erro de Validação', 'Por favor, insira um email válido.');
      setLoading(false);
      return;
    }

    // Password length validation
    if (password.length < 6) {
      Alert.alert('Erro de Validação', 'A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Alert.alert('Erro de Validação', 'As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // 1. Register the user in Supabase Auth, including name in metadata
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: { // Include options for user metadata
          data: {
            nome: nome, // Add the name to user metadata
          }
        }
      });

      if (authError) throw authError;

      // Check if user and session are created
      if (data.user && data.session) {
        console.log('User registered in Supabase Auth with metadata:', data.user);
        
        // Registration successful
        Alert.alert('Sucesso!', 'Conta criada com sucesso. Você já pode fazer login.', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login after successful registration
              router.replace('/');
            }
          }
        ]);
      } else {
        // This case might happen if email confirmation is required and not automatic
         Alert.alert('Conta Criada (Confirmação Necessária)', 'Sua conta foi criada. Verifique seu email para confirmar antes de fazer login.');
         // Depending on Supabase config, you might want to redirect here too
         router.replace('/');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Erro ao Criar Conta', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f6f6f6', '#ffffff']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={[styles.card, themeStyles.shadow]} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>
            Criar Conta
          </Text>

          <TextInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            keyboardType="default"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            textContentType="password"
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            textContentType="password"
            left={<TextInput.Icon icon="lock-check" />}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="account-plus"
          >
            Criar Conta
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
            icon="arrow-left"
          >
            Voltar para Login
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 