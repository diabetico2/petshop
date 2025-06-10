import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../../../lib/supabase';
import { styles as themeStyles, theme } from '../../../../theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewProdutoScreen() {
  const { id: petId } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'alimenticio' | 'medicinal' | ''>('');
  const [preco, setPreco] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [quantidadeVezes, setQuantidadeVezes] = useState('');
  const [quandoConsumir, setQuandoConsumir] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nome || !tipo || !preco || !dataCompra) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (isNaN(parseFloat(preco))) {
      Alert.alert('Erro', 'Por favor, insira um preço válido.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dataCompra)) {
      Alert.alert('Erro', 'Por favor, insira a data da compra no formato AAAA-MM-DD.');
      return;
    }

    if (tipo === 'medicinal') {
      if (!quantidadeVezes || !quandoConsumir) {
        Alert.alert('Erro', 'Por favor, preencha a quantidade de vezes e quando consumir para produtos medicinais.');
        return;
      }
      if (isNaN(Number(quantidadeVezes))) {
        Alert.alert('Erro', 'Por favor, insira uma quantidade de vezes válida.');
        return;
      }
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('Produto').insert({
        nome,
        tipo,
        preco: parseFloat(preco),
        data_compra: dataCompra,
        observacoes: observacoes || null,
        petid: petId,
        ...(tipo === 'medicinal' && {
          quantidade_vezes: parseInt(quantidadeVezes, 10),
          quando_consumir: quandoConsumir,
        }),
      });

      if (error) throw error;
      Alert.alert('Sucesso', 'Produto adicionado com sucesso');
      router.back();
    } catch (error: any) {
      console.error('Erro ao adicionar produto:', error);
      Alert.alert('Erro', `Não foi possível adicionar o produto: ${error.message}`);
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

          <View style={styles.segmentedButtonContainer}>
            <Text style={styles.segmentedButtonLabel}>Tipo:</Text>
            <SegmentedButtons
              value={tipo}
              onValueChange={(value) => setTipo(value as 'alimenticio' | 'medicinal')}
              buttons={[
                {
                  value: 'alimenticio',
                  label: 'Alimentício',
                  icon: 'food-apple',
                },
                {
                  value: 'medicinal',
                  label: 'Medicinal',
                  icon: 'pill',
                },
              ]}
            />
          </View>

          {tipo === 'medicinal' && (
            <>
              <TextInput
                label="Quantidade de Vezes (por dia/semana)"
                value={quantidadeVezes}
                onChangeText={setQuantidadeVezes}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                left={<TextInput.Icon icon="numeric" />}
              />
              <TextInput
                label="Quando Consumir (Ex: Manhã, Noite, Após refeição)"
                value={quandoConsumir}
                onChangeText={setQuandoConsumir}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="clock-outline" />}
              />
            </>
          )}

          <TextInput
            label="Preço"
            value={preco}
            onChangeText={setPreco}
            mode="outlined"
            style={styles.input}
            keyboardType="decimal-pad"
            left={<TextInput.Icon icon="currency-brl" />}
          />

          <TextInput
            label="Data da Compra (AAAA-MM-DD)"
            value={dataCompra}
            onChangeText={setDataCompra}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: 2024-03-25"
            left={<TextInput.Icon icon="calendar" />}
          />

          <TextInput
            label="Observações (Opcional)"
            value={observacoes}
            onChangeText={setObservacoes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="note-text-outline" />}
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
  segmentedButtonContainer: {
    marginBottom: 16,
  },
  segmentedButtonLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
    marginLeft: 12,
  },
}); 