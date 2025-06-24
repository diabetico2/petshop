import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, Divider, Surface } from 'react-native-paper';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { API_URL, api } from '../../../lib/api';
import { Pet, Produto } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      const response = await fetch(`${API_URL}/pets/${id}`);
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
      setProdutos(
        sortedProdutos.map((p) => ({
          ...p,
          tipo: p.tipo as Produto['tipo'],
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar pet');
      router.back();
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
    }
  };

  function getPetImageUrl(foto_url: string | null) {
    if (!foto_url) return undefined;
    if (foto_url.startsWith('http')) {
      // Corrige URLs antigas que ainda têm localhost
      if (foto_url.includes('localhost:3000')) {
        return foto_url.replace('http://localhost:3000', API_URL);
      }
      return foto_url;
    }
    return `${API_URL}${foto_url.startsWith('/') ? '' : '/'}${foto_url}`;
  }

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
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.petImageContainer}>
          {pet.foto_url ? (
            <Image
              source={{ uri: getPetImageUrl(pet.foto_url) }}
              style={styles.petImage}
              onError={() => console.error('Erro ao carregar imagem do pet')}
              onLoad={() => console.log('Imagem do pet carregada com sucesso!')}
            />
          ) : (
            <View style={styles.petImagePlaceholder}>
              <Icon name="pets" size={80} color="#fff" />
            </View>
          )}
        </View>
      </LinearGradient>

      <Surface style={styles.contentCard} elevation={4}>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.nome}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Icon name="category" size={20} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Raça</Text>
                <Text style={styles.infoValue}>{pet.raca || 'Não informado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="schedule" size={20} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Idade</Text>
                <Text style={styles.infoValue}>{pet.idade ? `${pet.idade} anos` : 'Não informado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name={pet.sexo === 'Macho' ? 'male' : 'female'} size={20} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Sexo</Text>
                <Text style={styles.infoValue}>{pet.sexo || 'Não informado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="pets" size={20} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Espécie</Text>
                <Text style={styles.infoValue}>{pet.especie || 'Não informado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="palette" size={20} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Cor/Pelagem</Text>
                <Text style={styles.infoValue}>{pet.corPelagem || 'Não informado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name={pet.castrado ? 'check-circle' : 'cancel'} size={20} color={pet.castrado ? '#4caf50' : '#ff9800'} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Castração</Text>
                <Text style={[styles.infoValue, { color: pet.castrado ? '#4caf50' : '#ff9800' }]}>
                  {pet.castrado ? 'Castrado' : 'Não castrado'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push(`/pets/${pet.id}/produtos/new`)}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
            >
              <Icon name="add-shopping-cart" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Adicionar Produto</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push(`/pets/${pet.id}/edit`)}
            >
              <Icon name="edit" size={20} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Editar Pet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Surface>

      {produtos.length > 0 && (
        <Surface style={styles.productsSection} elevation={2}>
          <View style={styles.sectionHeader}>
            <Icon name="inventory" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Histórico de Produtos</Text>
          </View>
          
          {produtos.map((produto) => (
            <View key={produto.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{produto.nome}</Text>
                <TouchableOpacity
                  onPress={() => router.push(`/pets/${pet.id}/produtos/${produto.id}/edit`)}
                  style={styles.editButton}
                >
                  <Icon name="edit" size={18} color="#667eea" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.productDetails}>
                <View style={styles.productDetailItem}>
                  <Icon name="calendar-today" size={16} color="#666" />
                  <Text style={styles.productDetailText}>
                    {new Date(produto.data_compra).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                
                <View style={styles.productDetailItem}>
                  <Icon name="category" size={16} color="#666" />
                  <Text style={styles.productDetailText}>Tipo: {produto.tipo}</Text>
                </View>
                
                <View style={styles.productDetailItem}>
                  <Icon name="attach-money" size={16} color="#666" />
                  <Text style={styles.productDetailText}>R$ {produto.preco.toFixed(2)}</Text>
                </View>

                {produto.tipo === 'medicinal' && (
                  <>
                    {produto.quantidade_vezes && (
                      <View style={styles.productDetailItem}>
                        <Icon name="looks-one" size={16} color="#666" />
                        <Text style={styles.productDetailText}>Quantidade: {produto.quantidade_vezes}x</Text>
                      </View>
                    )}
                    
                    {produto.quando_consumir && (
                      <View style={styles.productDetailItem}>
                        <Icon name="schedule" size={16} color="#666" />
                        <Text style={styles.productDetailText}>Quando: {produto.quando_consumir}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          ))}
        </Surface>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 71,
    resizeMode: 'cover',
  },
  petImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 71,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    margin: 16,
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  petInfo: {
    padding: 20,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667eea',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#ffcccb',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
  productsSection: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  productDetails: {
    gap: 8,
  },
  productDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productDetailText: {
    fontSize: 14,
    color: '#666',
  },
});