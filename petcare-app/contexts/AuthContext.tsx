import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    checkUser();
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthContext: onAuthStateChange event:', _event, 'session:', session);
      if (session?.user) {
        // Construir o objeto user a partir dos dados do Supabase Auth
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          nome: session.user.user_metadata.nome || 'Usuário', // Obter nome dos metadados
          created_at: session.user.created_at || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      console.log('AuthContext: checking user session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthContext: getSession result:', session);
      if (session?.user) {
        // Construir o objeto user diretamente da sessão, usando metadados
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          nome: session.user.user_metadata.nome || 'Usuário', // Obter nome dos metadados
          created_at: session.user.created_at || '',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, senha: string) {
    try {
      setLoading(true);
      console.log('AuthContext: attempting to sign in with email:', email);
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error('AuthContext: signIn error:', error);
        throw error;
      }

      console.log('AuthContext: signIn successful, session:', session);

      if (session?.user) {
        // Construir o objeto user diretamente da sessão, usando metadados
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          nome: session.user.user_metadata.nome || 'Usuário', // Obter nome dos metadados
          created_at: session.user.created_at || '',
        });
      } else {
        setUser(null); // Se não houver sessão após login, definir como null
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 