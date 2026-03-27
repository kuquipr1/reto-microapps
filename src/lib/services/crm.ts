import { createClient } from "@/lib/supabase/client";

export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: "lead" | "prospect" | "customer" | "inactive";
  created_at: string;
  updated_at: string;
}

export type CustomerInput = Omit<Customer, "id" | "user_id" | "created_at" | "updated_at">;

export const crmService = {
  async getCustomers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
      throw new Error(`Error al obtener clientes: ${error.message}${error.message.includes('not found') ? ' (¿Se aplicó el esquema SQL?)' : ''}`);
    }
    return data as Customer[];
  },

  async addCustomer(customer: CustomerInput) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("customers")
      .insert([{ ...customer, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async updateCustomer(id: string, customer: Partial<CustomerInput>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .update(customer)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async deleteCustomer(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
