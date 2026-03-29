import { createClient, isMockMode } from "@/lib/supabase/client";

export interface Employee {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  role: string;
  department: string;
  salary: number;
  status: "active" | "on_leave" | "terminated";
  hire_date: string;
  created_at: string;
}

export interface Payroll {
  id: string;
  user_id: string;
  employee_id: string;
  amount: number;
  payment_date: string;
  status: "draft" | "sent" | "paid";
  created_at: string;
}

export type EmployeeInput = Omit<Employee, "id" | "user_id" | "created_at" | "status">;

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "e1",
    user_id: "mock-user",
    first_name: "Elena",
    last_name: "Moreno",
    email: "elena@empresa.com",
    role: "Desarrolladora Senior",
    department: "Desarrollo",
    salary: 45000,
    status: "active",
    hire_date: "2023-01-15",
    created_at: new Date().toISOString()
  },
  {
    id: "e2",
    user_id: "mock-user",
    first_name: "Roberto",
    last_name: "Sanz",
    email: "roberto@empresa.com",
    role: "Diseñador UI/UX",
    department: "Diseño",
    salary: 38000,
    status: "active",
    hire_date: "2023-03-20",
    created_at: new Date().toISOString()
  }
];

export const payrollService = {
  async getEmployees() {
    if (isMockMode()) {
      return MOCK_EMPLOYEES;
    }

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
    if (isMockMode()) {
      const newEmployee: Employee = {
        ...employee,
        id: "e" + Math.random().toString(36).substr(2, 5),
        user_id: "mock-user",
        status: "active",
        created_at: new Date().toISOString()
      };
      MOCK_EMPLOYEES.unshift(newEmployee);
      return newEmployee;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("employees")
      .insert([{ ...employee, user_id: userData.user.id, status: "active" }])
      .select()
      .single();

    if (error) {
      console.error("Error adding employee:", error);
      throw new Error(`Error al añadir empleado: ${error.message}`);
    }
    return data as Employee;
  },

  async updateEmployee(id: string, updates: Partial<Employee>) {
    if (isMockMode()) {
      const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
      if (index !== -1) {
        MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], ...updates };
        return MOCK_EMPLOYEES[index];
      }
      throw new Error("Empleado no encontrado");
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async deleteEmployee(id: string) {
    if (isMockMode()) {
      const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
      if (index !== -1) {
        MOCK_EMPLOYEES.splice(index, 1);
        return;
      }
      throw new Error("Empleado no encontrado");
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  calculatePayroll(employees: Employee[]) {
    const totalMonthly = employees.reduce((acc, emp) => acc + Number(emp.salary), 0);
    const averageSalary = employees.length > 0 ? totalMonthly / employees.length : 0;
    return {
      totalMonthly,
      averageSalary,
      employeeCount: employees.length
    };
  },

  async getPayrolls() {
    if (isMockMode()) {
      return [
        {
          id: "p1",
          user_id: "mock-user",
          employee_id: "e1",
          amount: 3750,
          payment_date: "2024-03-31",
          status: "paid",
          created_at: new Date().toISOString()
        }
      ] as Payroll[];
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("payrolls")
      .select("*")
      .order("payment_date", { ascending: false });

    if (error) throw error;
    return data as Payroll[];
  },
};
