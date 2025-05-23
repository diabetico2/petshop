import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            title: 'PetCare',
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="pets/index" 
          options={{
            title: 'Meus Pets',
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="appointments/index" 
          options={{
            title: 'Consultas',
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </PaperProvider>
  );
} 