import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Bem-vindo ao PetCare
      </Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/pets" asChild>
          <Button 
            mode="contained" 
            style={styles.button}
            icon="paw"
          >
            Meus Pets
          </Button>
        </Link>

        <Link href="/appointments" asChild>
          <Button 
            mode="contained" 
            style={styles.button}
            icon="calendar"
          >
            Consultas
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    color: '#6200ee',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    padding: 8,
  },
}); 