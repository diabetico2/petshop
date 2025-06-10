export interface Usuario {
  id: string;
  email: string;
  nome: string;
  created_at: string;
}

// Nova interface User para o contexto de autenticação
export interface User {
  id: string;
  email: string;
  nome: string;
  created_at: string;
}

export interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  sexo: string;
  corPelagem: string;
  castrado: boolean;
  user_id: string;
  created_at: string;
  foto_url?: string;
}

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  data_compra: string;
  observacoes?: string;
  petid: string;
  tipo: 'alimenticio' | 'medicinal';
  quantidade_vezes?: number;
  quando_consumir?: string;
} 