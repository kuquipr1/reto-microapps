import { createClient } from "@/lib/supabase/client";

export interface Employee {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  role: string;
  department: string | null;
  salary: number;
  hire_date: string;
  created_at: string;
}

export interface PayrollItem {
  id: string;
  employee_id: string;
  amount: number;
  status: "pending" | "paid";
  item_date: string;
  created_at: string;
}

export type EmployeeInput = Omit<Employee, "id" | "user_id" | "created_at">;

export const payrollService = {
  async getEmployees() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
      throw new Error(`Error al obtener empleados: ${error.message}`);
    }
    return data as Employee[];
  },

  async addEmployee(employee: EmployeeInput) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("employees")
      .insert([{ ...employee, user_id: userData.user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding employee:", error);
      throw new Error(`Error al añadir empleado: ${error.message}`);
    }
    return data as Employee;
  },

  async deleteEmployee(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getPayrolls() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("payrolls")
      .select("*, employees(first_name, last_name)")
      .order("item_date", { ascending: false });

    if (error) throw error;
    return data;
  },
};
