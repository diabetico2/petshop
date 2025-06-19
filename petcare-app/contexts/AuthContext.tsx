import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Salvar token no localStorage/sessionStorage
  const saveToken = (token: string) => localStorage.setItem('access_token', token);
  const getToken = () => localStorage.getItem('access_token');
  const clearToken = () => localStorage.removeItem('access_token');

  useEffect(() => {
    // Tenta carregar o usuário ao iniciar
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  async function signIn(email: string, senha: string) {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao logar');
      // data já é o usuário retornado pelo backend
        setUser({
        id: data.id,
        email: data.email,
        nome: data.nome,
        created_at: data.created_at,
        });
      // Se o backend retornar um token, salve aqui (exemplo: saveToken(data.token))
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, senha: string, nome: string) {
      setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
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
    clearToken();
      setUser(null);
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