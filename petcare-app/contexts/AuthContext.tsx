import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  nome: string;
  created_at: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, senha: string, nome: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Salvar token no AsyncStorage
  const saveToken = async (token: string) => await AsyncStorage.setItem('access_token', token);
  const getToken = async () => await AsyncStorage.getItem('access_token');
  const clearToken = async () => await AsyncStorage.removeItem('access_token');

  useEffect(() => {
    // Tenta carregar o usuário ao iniciar
    const fetchUser = async () => {
      const userId = await getToken();
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/usuarios/${userId}`);
        if (res.ok) {
          const userData = await res.json();
          setUser({
            id: userData.id,
            email: userData.email,
            nome: userData.nome,
            created_at: userData.created_at,
          });
        } else {
          setUser(null);
          await clearToken();
        }
      } catch {
        setUser(null);
        await clearToken();
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  async function signIn(email: string, senha: string) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao logar');
      
      // Salvar o ID do usuário como token temporário
      await saveToken(data.id);
      
      setUser({
        id: data.id,
        email: data.email,
        nome: data.nome,
        created_at: data.created_at,
      });
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, senha: string, nome: string) {
      setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha, nome }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao registrar');
      // Você pode logar automaticamente após registrar, se quiser
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    await clearToken();
    setUser(null);
    setLoading(false);
    // Força o redirecionamento para a tela de login
    setTimeout(() => {
      router.replace('/');
    }, 100);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
} 