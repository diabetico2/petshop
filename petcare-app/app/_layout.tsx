import { useAuth } from '../contexts/AuthContext';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

function AuthStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  );
}

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pets/index" />
      <Stack.Screen name="pets/[id]/index" />
      <Stack.Screen name="pets/[id]/edit" />
      <Stack.Screen name="pets/new" />
      <Stack.Screen name="pets/[id]/produtos/new" />
      <Stack.Screen name="pets/[id]/produtos/[produtoId]/edit" />
      <Stack.Screen name="account/edit" />
      <Stack.Screen name="appointments/index" />
    </Stack>
  );
}

function LayoutContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuário logado - ir para pets
        router.replace('/pets');
      } else {
        // Usuário não logado - ir para login
        router.replace('/');
      }
    }
  }, [user, loading]);

  if (loading) {
    return null; // ou um loading spinner
  }

  return user ? <AppStack /> : <AuthStack />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <LayoutContent />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}