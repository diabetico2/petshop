import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Text, Card, Button, ActivityIndicator, FAB, Surface } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { Pet } from '../../types';
import { router } from 'expo-router';
import { styles as themeStyles, theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, signOut } = useAuth();

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

  async function loadPets() {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/pets?userId=${user?.id}`);
      if (!response.ok) throw new Error('Erro ao buscar pets');
      const data = await response.json();
      setPets(data || []);
    } catch (error) {
      Alert.alert('Erro', `Não foi possível carregar os pets: ${error.message}`);
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
              const response = await fetch(`http://localhost:3000/pets/${petId}`, {
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
          <Image source={{ uri: item.foto_url }} style={styles.petImagePreview} />
        ) : (
          <Text style={styles.petEmoji}>🐾</Text>
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

      <View style={styles.headerRow}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Olá, {user?.nome}!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Gerencie seus pets aqui
          </Text>
        </View>
        <Button
          mode="outlined"
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
          style={styles.logoutButton}
          icon="logout"
        >
          Sair
        </Button>
      </View>

      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
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
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  welcomeText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  petImageContainer: {
    height: 120,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  petImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  petEmoji: {
    fontSize: 48,
  },
  petInfo: {
    padding: 16,
  },
  petName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petBreed: {
    color: '#666',
  },
  petActions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 8,
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
    padding: 16,
    paddingTop: 8,
  },
  logoutButton: {
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
}); 