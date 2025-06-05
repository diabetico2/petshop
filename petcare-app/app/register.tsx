import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { styles as themeStyles, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
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

  async function handleRegister() {
    console.log('handleRegister called');
    if (checkRateLimit()) {
      console.log('Rate limit check returned true');
      return;
    }
    console.log('Rate limit check passed');

    if (!email || !password || !confirmPassword) {
      console.log('Validation failed: missing fields');
      Alert.alert('Erro de Cadastro', 'Por favor, preencha todos os campos');
      return;
    }
    console.log('Validation passed: fields present');

    const trimmedEmail = email.trim().toLowerCase();
    if (!validateEmail(trimmedEmail)) {
      console.log('Validation failed: invalid email');
      Alert.alert('Erro de Cadastro', 'Por favor, insira um email válido');
      return;
    }
    console.log('Validation passed: valid email format');

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      Alert.alert('Erro de Cadastro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
     console.log('Validation passed: password length ok');

    if (password !== confirmPassword) {
      console.log('Validation failed: passwords do not match');
      Alert.alert('Erro de Cadastro', 'As senhas não coincidem');
      return;
    }
    console.log('Validation passed: passwords match');

    try {
      setLoading(true);
      console.log('Attempting supabase signup');

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password.trim(),
      });

      if (error) {
        console.error('Registration error:', error);
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          Alert.alert('Erro de Cadastro', 'Este email já está cadastrado. Tente fazer login.');
          return;
        }
        if (error.message.includes('seconds')) {
          const seconds = error.message.match(/\d+/)?.[0] || '46';
          Alert.alert(
            'Aguarde um momento',
            `Por motivos de segurança, aguarde ${seconds} segundos antes de tentar novamente.`
          );
          return;
        }
        // Generic error for other Supabase signup issues
        Alert.alert(
          'Erro no Cadastro',
          error.message || 'Ocorreu um erro inesperado ao criar a conta. Tente novamente.'
        );
        throw error; // Still throw to log the original error
      }

      if (data?.user) {
        console.log('Signup successful, user created');
        Alert.alert(
          'Sucesso no Cadastro',
          'Conta criada com sucesso! Você já pode fazer login.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/');
              },
            },
          ]
        );
      } else {
        console.log('Signup returned no user data');
        // This case might happen if signUp succeeds but doesn't immediately return user data (less common with email/password)
         Alert.alert('Erro no Cadastro', 'Conta criada, mas houve um problema ao obter os dados do usuário.');
         // Depending on flow, might still navigate or handle differently
      }
    } catch (error: any) {
      console.error('Registration error details:', error);
      // Fallback for any errors not caught above or general network issues
      if (!(error.message.includes('already registered') || error.message.includes('already exists') || error.message.includes('seconds')))
      Alert.alert(
        'Erro no Cadastro',
        error.message || 'Não foi possível criar a conta devido a um erro. Tente novamente.'
      );
    } finally {
      setLoading(false);
      console.log('handleRegister finished');
    }
  }

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