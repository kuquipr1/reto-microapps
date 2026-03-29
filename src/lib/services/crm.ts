import { createClient, isMockMode } from "@/lib/supabase/client";

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

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    user_id: "mock-user",
    first_name: "Juan",
    last_name: "Pérez",
    email: "juan@example.com",
    phone: "+34 600 000 001",
    company: "TechNova S.L.",
    status: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "mock-user",
    first_name: "María",
    last_name: "García",
    email: "maria@empresa.es",
    phone: "+34 600 000 002",
    company: "Logística Global",
    status: "prospect",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "mock-user",
    first_name: "Carlos",
    last_name: "Rodríguez",
    email: "carlos@startup.io",
    phone: "+34 600 000 003",
    company: "Ventas Inteligentes",
    status: "lead",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const crmService = {
  async getCustomers() {
    if (isMockMode()) {
      console.log("Using Mock CRM Data");
      return MOCK_CUSTOMERS;
    }

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
    if (isMockMode()) {
      const newCustomer = { 
        ...customer, 
        id: Math.random().toString(36).substr(2, 9),
        user_id: "mock-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      MOCK_CUSTOMERS.unshift(newCustomer);
      return newCustomer;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("customers")
      .insert([{ ...customer, user_id: userData.user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding customer:", error);
      throw new Error(`Error al añadir cliente: ${error.message}`);
    }
    return data as Customer;
  },

  async updateCustomer(id: string, customer: Partial<CustomerInput>) {
    if (isMockMode()) {
      const index = MOCK_CUSTOMERS.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customer, updated_at: new Date().toISOString() };
        return MOCK_CUSTOMERS[index];
      }
      throw new Error("Customer not found in mock data");
    }

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
    if (isMockMode()) {
       const index = MOCK_CUSTOMERS.findIndex(c => c.id === id);
       if (index !== -1) MOCK_CUSTOMERS.splice(index, 1);
       return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
