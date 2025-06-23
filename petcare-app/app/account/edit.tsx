import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { styles as themeStyles, theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api';

export default function EditAccountScreen() {
  const { user, signOut } = useAuth();
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateProfile = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'A confirmação da senha não confere');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);

      const updateData: any = {
        nome,
        email,
      };

      if (novaSenha) {
        updateData.novaSenha = novaSenha;
      }

      const response = await fetch(`${API_URL}/usuarios/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }

      Alert.alert(
        'Sucesso', 
        'Perfil atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (novaSenha) {
                Alert.alert(
                  'Senha Alterada',
                  'Sua senha foi alterada com sucesso!',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.back()
                    }
                  ]
                );
              } else {
                router.back();
              }
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', `Não foi possível atualizar o perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}/usuarios/${user?.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir conta');
              }              Alert.alert(
                'Conta Excluída',
                'Sua conta foi excluída com sucesso.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      signOut();
                    }
                  }
                ]
              );
            } catch (error: any) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert('Erro', `Não foi possível excluir a conta: ${error.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
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
            Editar Conta
          </Text>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações Pessoais
          </Text>

          <TextInput
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
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
            left={<TextInput.Icon icon="email" />}
          />

          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>
            Alterar Senha (Opcional)
          </Text>

          <TextInput
            label="Nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            left={<TextInput.Icon icon="lock-outline" />}
          />

          <TextInput
            label="Confirmar nova senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            left={<TextInput.Icon icon="lock-check" />}
          />

          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="check"
          >
            Salvar Alterações
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
            icon="arrow-left"
          >
            Voltar
          </Button>

          <View style={styles.dangerZone}>
            <Text variant="titleMedium" style={styles.dangerTitle}>
              Zona de Perigo
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleDeleteAccount}
              style={[styles.button, styles.deleteButton]}
              textColor={theme.colors.error}
              icon="delete"
            >
              Excluir Conta
            </Button>
          </View>
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
    flexGrow: 1,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    maxWidth: 600,
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  dangerZone: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  dangerTitle: {
    color: theme.colors.error,
    fontWeight: '600',
    marginBottom: 16,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});
