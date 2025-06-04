import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Pet } from '../../types';
import { router } from 'expo-router';

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Pet')
        .select('*')
        .eq('usuarioId', user?.id);

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pets');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePet(petId: number) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('Pet')
        .delete()
        .eq('id', petId);

      if (error) throw error;
      await loadPets();
      Alert.alert('Sucesso', 'Pet removido com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o pet');
    } finally {
      setLoading(false);
    }
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{item.nome}</Text>
        <Text variant="bodyMedium">Raça: {item.raca}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => router.push(`/pets/${item.id}`)}
          mode="contained"
        >
          Detalhes
        </Button>
        <Button
          onPress={() => handleDeletePet(item.id)}
          mode="outlined"
          textColor="red"
        >
          Remover
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Meus Pets</Text>
        <Button
          mode="contained"
          onPress={() => router.push('/pets/new')}
          icon="plus"
        >
          Novo Pet
        </Button>
      </View>

      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Você ainda não tem pets cadastrados
          </Text>
        }
      />
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  card: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
}); 