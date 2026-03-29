import { createClient, isMockMode } from "@/lib/supabase/client";

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Omit<Product, "id" | "user_id" | "created_at" | "updated_at">;

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    user_id: "mock-user",
    name: "MacBook Pro M3",
    description: "Laptop de alta gama",
    sku: "MBP-M3-001",
    price: 2499,
    stock: 15,
    category: "Electrónica",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p2",
    user_id: "mock-user",
    name: "Monitor 4K 27\"",
    description: "Monitor profesional",
    sku: "MON-4K-27",
    price: 599,
    stock: 8,
    category: "Electrónica",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const inventoryService = {
  async getProducts() {
    if (isMockMode()) {
      return MOCK_PRODUCTS;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Error al obtener productos: ${error.message}${error.message.includes('not found') ? ' (¿Se aplicó el esquema SQL?)' : ''}`);
    }
    return data as Product[];
  },

  async addProduct(product: ProductInput) {
    if (isMockMode()) {
      const newProduct = {
        ...product,
        id: "p" + Math.random().toString(36).substr(2, 5),
        user_id: "mock-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      MOCK_PRODUCTS.unshift(newProduct);
      return newProduct;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("products")
      .insert([{ ...product, user_id: userData.user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding product:", error);
      throw new Error(`Error al añadir producto: ${error.message}`);
    }
    return data as Product;
  },

  async updateProduct(id: string, product: Partial<ProductInput>) {
    if (isMockMode()) {
       const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
       if (index !== -1) {
         MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...product, updated_at: new Date().toISOString() };
         return MOCK_PRODUCTS[index];
       }
       throw new Error("Product not found");
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
    return data as Product;
  },

  async deleteProduct(id: string) {
    if (isMockMode()) {
      const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
      if (index !== -1) MOCK_PRODUCTS.splice(index, 1);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  },
};
