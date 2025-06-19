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
  user_metadata?: {
    nome?: string;
    [key: string]: any; // Para permitir outras propriedades dinâmicas do user_metadata
  };
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
  descricao?: string;
  preco: number;
  imagem?: string;
  petId: string;
  tipo: 'alimenticio' | 'medicinal' | 'higiene' | 'alimentacao' | 'brinquedo' | 'outros';
  data_compra: string;
  observacoes?: string;
  quantidade_vezes?: number;
  quando_consumir?: string;
} 