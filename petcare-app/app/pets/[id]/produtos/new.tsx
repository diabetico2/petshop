import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../../../lib/supabase';
import { styles as themeStyles, theme } from '../../../../theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewProdutoScreen() {
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nome || !tipo || !preco) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('Produto').insert({
        nome,
        tipo,
        preco: parseFloat(preco),
        petId: id,
      });

      if (error) throw error;
      Alert.alert('Sucesso', 'Produto adicionado com sucesso');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o produto');
    } finally {
      setLoading(false);
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
            Novo Produto
          </Text>

          <TextInput
            label="Nome do Produto"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="tag" />}
          />

          <TextInput
            label="Tipo"
            value={tipo}
            onChangeText={setTipo}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="shape" />}
          />

          <TextInput
            label="Preço"
            value={preco}
            onChangeText={setPreco}
            mode="outlined"
            style={styles.input}
            keyboardType="decimal-pad"
            left={<TextInput.Icon icon="currency-brl" />}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="check"
          >
            Adicionar Produto
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
            icon="arrow-left"
          >
            Voltar
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