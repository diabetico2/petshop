import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Text, Card, Button, ActivityIndicator, FAB, Surface } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api';
import { Pet } from '../../types';
import { router } from 'expo-router';
import { styles as themeStyles, theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, signOut } = useAuth();

  // Reage diretamente quando o usuário é deslogado
  useEffect(() => {
    if (!authLoading && !user) {
      setPets([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  useFocusEffect(
    React.useCallback(() => {
      if (!authLoading && user) {
        loadPets();
      } else if (!authLoading && !user) {
        setPets([]);
        setLoading(false);
      }
    }, [user, authLoading])
  );

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

  async function loadPets() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pets?userId=${user?.id}`);
      if (!response.ok) throw new Error('Erro ao buscar pets');
      const data = await response.json();
      setPets(data || []);
    } catch (error) {
      Alert.alert('Erro', `Não foi possível carregar os pets: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePet(petId: string) {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja remover este pet?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}/pets/${petId}`, {
                method: 'DELETE',
              });
              if (!response.ok) throw new Error('Erro ao remover o pet');
              await loadPets();
              Alert.alert('Sucesso', 'Pet removido com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o pet');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <Surface style={[styles.card, themeStyles.shadow]} elevation={2}>
      <View style={styles.petImageContainer}>
        {item.foto_url ? (
          <Image source={{ uri: getPetImageUrl(item.foto_url) }} style={styles.petImagePreview} />
        ) : (
          <View style={styles.petImagePlaceholder}>
            <Icon name="pets" size={60} color="#999" />
          </View>
        )}
      </View>
      <View style={styles.petInfo}>
        <Text variant="titleLarge" style={styles.petName}>{item.nome}</Text>
        <Text variant="bodyMedium" style={styles.petBreed}>Raça: {item.raca}</Text>
      </View>
      <View style={styles.petActions}>
        <Button
          mode="contained"
          onPress={() => router.push(`/pets/${item.id}`)}
          style={styles.actionButton}
          icon="paw"
        >
          Detalhes
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleDeletePet(item.id)}
          textColor={theme.colors.error}
          style={styles.actionButton}
          icon="delete"
        >
          Remover
        </Button>
      </View>
    </Surface>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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

      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.welcomeText}>
                Olá, {user?.nome}!
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Gerencie seus pets aqui
              </Text>
            </View>
            
            <View style={styles.headerButtons}>
              <Button
                mode="outlined"
                onPress={() => router.push('/account/edit')}
                style={[styles.headerButton, { marginRight: 8 }]}
                icon="account-edit"
                compact
              >
                Conta
              </Button>
              
              <Button
                mode="outlined"
                onPress={async () => {
                  await signOut();
                }}
                style={styles.headerButton}
                icon="logout"
                compact
              >
                Sair
              </Button>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Surface style={styles.emptyContainer} elevation={1}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyText}>
              Você ainda não tem pets cadastrados
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/pets/new')}
              style={styles.emptyButton}
              icon="plus"
            >
              Adicionar Pet
            </Button>
          </Surface>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/pets/new')}
        label="Novo Pet"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flex: 1,
    paddingLeft: 16,
  },
  welcomeText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  petImageContainer: {
    height: 200, // Aumentado de 120 para 200
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  petImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  petImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 48,
  },
  petInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  petName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 18,
    color: '#333',
  },
  petBreed: {
    color: '#666',
    fontSize: 14,
  },
  petActions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    gap: 8,
    backgroundColor: '#fff',
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  emptyButton: {
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingRight: 16,
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    alignSelf: 'flex-start',
  },
  logoutButton: {
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
});