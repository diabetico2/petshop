import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Pet, Produto } from '../../types';

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetDetails();
  }, [id]);

  async function loadPetDetails() {
    try {
      setLoading(true);
      const { data: petData, error: petError } = await supabase
        .from('Pet')
        .select('*')
        .eq('id', id)
        .single();

      if (petError) throw petError;
      setPet(petData);

      const { data: produtosData, error: produtosError } = await supabase
        .from('Produto')
        .select('*')
        .eq('petId', id);

      if (produtosError) throw produtosError;
      setProdutos(produtosData || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do pet');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduto(produtoId: number) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('Produto')
        .delete()
        .eq('id', produtoId);

      if (error) throw error;
      await loadPetDetails();
      Alert.alert('Sucesso', 'Produto removido com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o produto');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">{pet.nome}</Text>
          <Text variant="bodyLarge">Raça: {pet.raca}</Text>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleLarge">Produtos</Text>
        <Button
          mode="contained"
          onPress={() => router.push(`/pets/${id}/produtos/new`)}
          icon="plus"
        >
          Novo Produto
        </Button>
      </View>

      {produtos.map((produto) => (
        <Card key={produto.id} style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">{produto.nome}</Text>
            <Text variant="bodyMedium">Tipo: {produto.tipo}</Text>
            <Text variant="bodyMedium">Preço: R$ {produto.preco.toFixed(2)}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => handleDeleteProduto(produto.id)}
              mode="outlined"
              textColor="red"
            >
              Remover
            </Button>
          </Card.Actions>
        </Card>
      ))}

      {produtos.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum produto cadastrado para este pet
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
}); 