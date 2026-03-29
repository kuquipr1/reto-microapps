import { createClient, isMockMode } from "@/lib/supabase/client";

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: "general" | "billing" | "technical" | "feature" | "bug";
  customer_name: string | null;
  customer_email: string | null;
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export type TicketInput = Omit<Ticket, "id" | "user_id" | "created_at" | "updated_at" | "resolved_at">;

const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

let MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    user_id: "mock-user",
    title: "Error al procesar pago con tarjeta",
    description: "El sistema rechaza mi tarjeta de crédito aunque tiene fondos suficientes. He intentado 3 veces y sigue fallando.",
    status: "open",
    priority: "critical",
    category: "billing",
    customer_name: "Juan Pérez",
    customer_email: "juan@technovа.com",
    assigned_to: null,
    resolved_at: null,
    created_at: daysAgo(0),
    updated_at: daysAgo(0),
  },
  {
    id: "2",
    user_id: "mock-user",
    title: "Solicitud de nueva funcionalidad: exportar a Excel",
    description: "Necesitamos exportar los reportes de inventario en formato Excel para presentarlos en reuniones.",
    status: "in_progress",
    priority: "medium",
    category: "feature",
    customer_name: "María García",
    customer_email: "maria@logistica.com",
    assigned_to: "Soporte Técnico",
    resolved_at: null,
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
  },
  {
    id: "3",
    user_id: "mock-user",
    title: "El módulo de nómina no carga los empleados",
    description: "Desde la última actualización, la lista de empleados aparece vacía. Es urgente porque tenemos que procesar nóminas esta semana.",
    status: "in_progress",
    priority: "high",
    category: "bug",
    customer_name: "Carlos Rodríguez",
    customer_email: "carlos@startup.io",
    assigned_to: "Dev Team",
    resolved_at: null,
    created_at: daysAgo(3),
    updated_at: daysAgo(1),
  },
  {
    id: "4",
    user_id: "mock-user",
    title: "Pregunta sobre facturación mensual",
    description: "¿El plan actual incluye acceso a todos los módulos? Necesito confirmar antes de renovar.",
    status: "resolved",
    priority: "low",
    category: "billing",
    customer_name: "Ana López",
    customer_email: "ana@empresa.es",
    assigned_to: "Ventas",
    resolved_at: daysAgo(1),
    created_at: daysAgo(5),
    updated_at: daysAgo(1),
  },
  {
    id: "5",
    user_id: "mock-user",
    title: "Configuración de acceso para nuevo empleado",
    description: "Necesito crear un usuario con permisos de solo lectura para el módulo de inventario.",
    status: "closed",
    priority: "low",
    category: "technical",
    customer_name: "Pedro Martínez",
    customer_email: "pedro@corp.com",
    assigned_to: "Soporte TI",
    resolved_at: daysAgo(3),
    created_at: daysAgo(7),
    updated_at: daysAgo(3),
  },
  {
    id: "6",
    user_id: "mock-user",
    title: "Lentitud en dashboard de analytics",
    description: "El dashboard tarda más de 30 segundos en cargar con grandes volúmenes de datos.",
    status: "open",
    priority: "medium",
    category: "bug",
    customer_name: "Laura Sánchez",
    customer_email: "laura@metrics.io",
    assigned_to: null,
    resolved_at: null,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
];

const MOCK_COMMENTS: TicketComment[] = [
  {
    id: "c1",
    ticket_id: "2",
    user_id: "mock-user",
    content: "Estamos evaluando la implementación. Te avisamos en 48h.",
    is_internal: false,
    created_at: daysAgo(1),
  },
  {
    id: "c2",
    ticket_id: "3",
    user_id: "mock-user",
    content: "Hemos replicado el bug en nuestro entorno. Trabajando en el fix.",
    is_internal: false,
    created_at: daysAgo(1),
  },
];

export const helpdeskService = {
  async getTickets(): Promise<Ticket[]> {
    if (isMockMode()) return [...MOCK_TICKETS].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const supabase = createClient();
    const { data, error } = await supabase
      .from("helpdesk_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Error al obtener tickets: ${error.message}`);
    return data as Ticket[];
  },

  async getTicket(id: string): Promise<Ticket> {
    if (isMockMode()) {
      const t = MOCK_TICKETS.find((t) => t.id === id);
      if (!t) throw new Error("Ticket no encontrado");
      return t;
    }
    const supabase = createClient();
    const { data, error } = await supabase.from("helpdesk_tickets").select("*").eq("id", id).single();
    if (error) throw new Error(`Error al obtener ticket: ${error.message}`);
    return data as Ticket;
  },

  async createTicket(input: TicketInput): Promise<Ticket> {
    if (isMockMode()) {
      const ticket: Ticket = {
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        user_id: "mock-user",
        resolved_at: null,
        created_at: now(),
        updated_at: now(),
      };
      MOCK_TICKETS.unshift(ticket);
      return ticket;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No autenticado");
    const { data, error } = await supabase
      .from("helpdesk_tickets")
      .insert([{ ...input, user_id: userData.user.id }])
      .select()
      .single();
    if (error) throw new Error(`Error al crear ticket: ${error.message}`);
    return data as Ticket;
  },

  async updateTicket(id: string, input: Partial<TicketInput & { resolved_at: string | null }>): Promise<Ticket> {
    if (isMockMode()) {
      const idx = MOCK_TICKETS.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error("Ticket no encontrado");
      MOCK_TICKETS[idx] = { ...MOCK_TICKETS[idx], ...input, updated_at: now() };
      return MOCK_TICKETS[idx];
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("helpdesk_tickets")
      .update({ ...input, updated_at: now() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Error al actualizar ticket: ${error.message}`);
    return data as Ticket;
  },

  async deleteTicket(id: string): Promise<void> {
    if (isMockMode()) {
      MOCK_TICKETS = MOCK_TICKETS.filter((t) => t.id !== id);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("helpdesk_tickets").delete().eq("id", id);
    if (error) throw new Error(`Error al eliminar ticket: ${error.message}`);
  },

  async getComments(ticketId: string): Promise<TicketComment[]> {
    if (isMockMode()) return MOCK_COMMENTS.filter((c) => c.ticket_id === ticketId);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("helpdesk_comments")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Error al obtener comentarios: ${error.message}`);
    return data as TicketComment[];
  },

  async addComment(ticketId: string, content: string, isInternal = false): Promise<TicketComment> {
    if (isMockMode()) {
      const comment: TicketComment = {
        id: Math.random().toString(36).substr(2, 9),
        ticket_id: ticketId,
        user_id: "mock-user",
        content,
        is_internal: isInternal,
        created_at: now(),
      };
      MOCK_COMMENTS.push(comment);
      return comment;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No autenticado");
    const { data, error } = await supabase
      .from("helpdesk_comments")
      .insert([{ ticket_id: ticketId, user_id: userData.user.id, content, is_internal: isInternal }])
      .select()
      .single();
    if (error) throw new Error(`Error al añadir comentario: ${error.message}`);
    return data as TicketComment;
  },
};
