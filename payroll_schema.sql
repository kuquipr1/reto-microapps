-- SQL schema for FinanzFlow Payroll

-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL,
  department TEXT,
  salary DECIMAL(10, 2) NOT NULL,
  hire_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payrolls table (payment history)
CREATE TABLE IF NOT EXISTS public.payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  item_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own employees" 
ON public.employees FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage payrolls of their employees" 
ON public.payrolls FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE public.employees.id = public.payrolls.employee_id 
    AND public.employees.user_id = auth.uid()
  )
);
