import { View, StyleSheet, FlatList } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';
import { useState } from 'react';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
}

export default function PetsList() {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Rex',
      species: 'Cachorro',
      breed: 'Labrador',
      age: 3,
    },
    {
      id: '2',
      name: 'Mia',
      species: 'Gato',
      breed: 'Siamês',
      age: 2,
    },
  ]);

  const renderPetCard = ({ item }: { item: Pet }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium">Espécie: {item.species}</Text>
        <Text variant="bodyMedium">Raça: {item.breed}</Text>
        <Text variant="bodyMedium">Idade: {item.age} anos</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Implementar adição de novo pet
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
}); 