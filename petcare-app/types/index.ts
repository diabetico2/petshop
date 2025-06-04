export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  usuarioId: number;
}

export interface Produto {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  petId: number;
} 