import { createClient } from "@/lib/supabase/client";

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

export const inventoryService = {
  async getProducts() {
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
