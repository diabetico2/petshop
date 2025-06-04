import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Login',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="pets/index"
            options={{
              title: 'Meus Pets',
            }}
          />
          <Stack.Screen
            name="pets/new"
            options={{
              title: 'Novo Pet',
            }}
          />
          <Stack.Screen
            name="pets/[id]"
            options={{
              title: 'Detalhes do Pet',
            }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
} 