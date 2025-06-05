export interface Usuario {
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
  data_nascimento: string;
  foto_url?: string;
  usuario_id: string;
  created_at: string;
}

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  data_compra: string;
  observacoes?: string;
  pet_id: string;
  created_at: string;
} 