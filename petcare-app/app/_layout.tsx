import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function AppStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
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
        name="pets/[id]/index"
        options={{
          title: 'Detalhes do Pet',
        }}
      />
       <Stack.Screen
        name="pets/[id]/produtos/new"
        options={{
          title: 'Novo Produto/Serviço',
        }}
      />
    </Stack>
  );
}

function AuthStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  );
}


export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <LayoutContent />
      </AuthProvider>
    </PaperProvider>
  );
}

function LayoutContent() {
  const { user } = useAuth();

  if (user) {
    return <AppStack />;
  } else {
    return <AuthStack />;
  }
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
}); 