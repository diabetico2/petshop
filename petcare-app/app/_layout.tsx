import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../theme';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <View style={styles.container}>
          <LinearGradient
            colors={['#f6f6f6', '#ffffff']}
            style={styles.background}
          />
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
        </View>
      </AuthProvider>
    </PaperProvider>
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
}); 