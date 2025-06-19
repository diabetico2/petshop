const API_URL = 'http://localhost:3000'; // Change this to your NestJS backend URL

export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  petId: string;
  tipo: string;
  data_compra: string;
  observacoes?: string;
  quantidade_vezes?: number;
  quando_consumir?: string;
}

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const headers = this.getAuthHeader();
    const response = await fetch(`${API_URL}/produtos`, { headers });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const headers = this.getAuthHeader();
    const response = await fetch(`${API_URL}/produtos/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const headers = this.getAuthHeader();
    const response = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(product),
    });
    const responseBody = await response.text();
    if (!response.ok) {
      console.error('Erro detalhado do backend ao criar produto:', responseBody);
      throw new Error('Failed to create product');
    }
    return JSON.parse(responseBody);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const headers = this.getAuthHeader();
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const headers = this.getAuthHeader();
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }
}

export const api = new ApiService(); 