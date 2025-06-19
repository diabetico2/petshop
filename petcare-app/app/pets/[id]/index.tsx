import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, Divider, Surface } from 'react-native-paper';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../../lib/api';
import { Pet, Produto } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      loadPet();
    }, [id])
  );

  const loadPet = async () => {
    try {
      // Buscar pet pelo backend
      const response = await fetch(`http://localhost:3000/pets/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar pet');
      const petData = await response.json();
      setPet(petData);
      // Buscar produtos pelo backend
      const produtos = await api.getProducts();
      const petProdutos = produtos.filter(p => String(p.petId) === String(id));
      const sortedProdutos = petProdutos.sort((a, b) => {
        if (a.tipo === 'medicinal' && b.tipo !== 'medicinal') return -1;
        if (b.tipo === 'medicinal' && a.tipo !== 'medicinal') return 1;
        return new Date(b.data_compra).getTime() - new Date(a.data_compra).getTime();
      });
      setProdutos(sortedProdutos);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar pet');
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
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
            style={styles.headerGradient}
          />
          {pet?.foto_url ? (
            console.log('Rendering Image with URL:', pet.foto_url),
            <Image
              source={{ uri: pet.foto_url }}
              style={styles.petImage}
              resizeMode="cover"
              onError={(e) => console.error('Erro ao carregar imagem do pet:', e.nativeEvent.error)}
              onLoad={() => console.log('Imagem do pet carregada com sucesso!')}
            />
          ) : (
            <View style={styles.petImagePlaceholder}>
              <Text style={styles.petImagePlaceholderText}>
                {pet?.nome?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text variant="headlineLarge" style={styles.petName}>
            {pet?.nome}
          </Text>
          {user?.nome && (
            <Text variant="bodyMedium" style={styles.userNameText}>
              Dono: {user.nome}
            </Text>
          )}
        </Surface>

        {/* Detalhes do Pet em linha */}
        <View
          style={{
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 16,
            marginTop: -60, 
            marginBottom: 16,
            marginHorizontal: 16,
            alignSelf: 'stretch',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text variant="titleLarge" style={{ marginBottom: 12, fontWeight: 'bold' }}>
            Informações do Pet
          </Text>
          <Text>
            {[
              pet?.nome,
              pet?.especie,
              pet?.raca,
              pet?.corPelagem,
              pet?.idade ? `${pet.idade} ${pet.idade === 1 ? 'ano' : 'anos'}` : null,
              pet?.sexo,
              pet?.castrado ? 'castrado' : 'não castrado'
            ].filter(Boolean).join(', ')}
          </Text>
        </View>

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
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => router.push(`/pets/${id}/produtos/${produto.id}/edit`)}
                    />
                  </View>
                  <Text variant="bodyMedium">Tipo: {produto.tipo.charAt(0).toUpperCase() + produto.tipo.slice(1)}</Text>
                  <Text variant="bodyMedium">R$ {produto.preco.toFixed(2)}</Text>
                  {produto.tipo === 'medicinal' && (
                    <View style={styles.medicinalDetails}>
                      <Text variant="bodySmall">Quantidade: {produto.quantidade_vezes} vezes</Text>
                      <Text variant="bodySmall">Consumo: {produto.quando_consumir}</Text>
                    </View>
                  )}
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
    height: 200,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  petImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  petImagePlaceholderText: {
    fontSize: 48,
    color: theme.colors.onSurfaceVariant,
    fontWeight: 'bold',
  },
  petName: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
    marginBottom: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.outline,
    marginTop: 20,
  },
  produtoCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  produtoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicinalDetails: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.outline,
  },
  observacoes: {
    marginTop: 8,
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
  },
  userNameText: {
    color: 'white',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
}); 