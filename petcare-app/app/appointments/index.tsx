import { View, StyleSheet, FlatList } from 'react-native';
import { Card, FAB, Text, Chip } from 'react-native-paper';
import { useState } from 'react';

interface Appointment {
  id: string;
  petName: string;
  date: string;
  time: string;
  type: string;
  status: 'agendada' | 'concluída' | 'cancelada';
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      petName: 'Rex',
      date: '2024-03-20',
      time: '14:30',
      type: 'Consulta de Rotina',
      status: 'agendada',
    },
    {
      id: '2',
      petName: 'Mia',
      date: '2024-03-22',
      time: '10:00',
      type: 'Vacinação',
      status: 'agendada',
    },
  ]);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'agendada':
        return '#6200ee';
      case 'concluída':
        return '#4caf50';
      case 'cancelada':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{item.petName}</Text>
        <Text variant="bodyMedium">Data: {item.date}</Text>
        <Text variant="bodyMedium">Horário: {item.time}</Text>
        <Text variant="bodyMedium">Tipo: {item.type}</Text>
        <Chip
          style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
          textStyle={{ color: 'white' }}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Chip>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Implementar agendamento de nova consulta
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
  statusChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
}); 