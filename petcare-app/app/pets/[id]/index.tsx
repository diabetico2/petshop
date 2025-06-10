import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, Divider, Surface } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { Pet, Produto } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPet();
  }, [id]);

  const loadPet = async () => {
    try {
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
        .eq('pet_id', id)
        .order('data_compra', { ascending: false });

      if (produtosError) throw produtosError;
      setProdutos(produtosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('Pet')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.back();
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
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
    <LinearGradient
      colors={[theme.colors.background, theme.colors.background]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.header}>
          <Image
            source={{ uri: pet.foto_url || 'https://via.placeholder.com/150' }}
            style={styles.petImage}
          />
          <View style={styles.petInfo}>
            <Text variant="headlineMedium" style={styles.petName}>{pet.nome}</Text>
            <Text variant="bodyLarge" style={styles.petDetails}>
              {pet.especie} • {pet.raca}
            </Text>
          </View>
        </Surface>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.push(`/pets/${id}/produtos/new`)}
            style={styles.addButton}
          >
            Adicionar Produto
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push(`/pets/${id}/edit`)}
            style={styles.editButton}
          >
            Editar Pet
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor={theme.colors.error}
            style={styles.deleteButton}
          >
            Excluir Pet
          </Button>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Histórico de Produtos
          </Text>
          {produtos.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum produto registrado para este pet
            </Text>
          ) : (
            produtos.map((produto) => (
              <Card key={produto.id} style={styles.produtoCard}>
                <Card.Content>
                  <View style={styles.produtoHeader}>
                    <Text variant="titleMedium">{produto.nome}</Text>
                    <Text variant="bodyMedium">
                      {new Date(produto.data_compra).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text variant="bodyMedium">R$ {produto.preco.toFixed(2)}</Text>
                  {produto.observacoes && (
                    <Text variant="bodySmall" style={styles.observacoes}>
                      {produto.observacoes}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  petInfo: {
    alignItems: 'center',
  },
  petName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  petDetails: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  actions: {
    padding: 16,
    gap: 8,
  },
  addButton: {
    marginBottom: 8,
  },
  editButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  produtoCard: {
    marginBottom: 12,
  },
  produtoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  observacoes: {
    marginTop: 8,
    color: theme.colors.onSurfaceVariant,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
  },
}); 