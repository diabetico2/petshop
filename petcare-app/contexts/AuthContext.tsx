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

  const loadUser = async () => {
    try {
      console.log('🔍 Carregando usuário do AsyncStorage...');
      
      const userData = await AsyncStorage.getItem('@user');
      console.log('📱 Dados do AsyncStorage:', userData);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('👤 Usuário carregado:', parsedUser);
        setUser(parsedUser);
      } else {
        console.log('❌ Nenhum usuário encontrado no AsyncStorage');
      }
    } catch (error) {
      console.error('🚨 Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando fazer login com:', { email, password: '***' });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📦 Dados recebidos:', data);

      if (!response.ok) {
        console.error('❌ Erro na resposta:', data);
        throw new Error(data.message || 'Credenciais inválidas');
      }

      console.log('✅ Login bem-sucedido, salvando dados...');
      
      // Salvar dados do usuário
      await AsyncStorage.setItem('@user', JSON.stringify(data));
      setUser(data);
      
      console.log('💾 Dados salvos no AsyncStorage:', data);
      
    } catch (error: any) {
      console.error('🚨 Erro no signIn:', error);
      throw error;
    }
  };

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
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    await AsyncStorage.removeItem('@user');
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