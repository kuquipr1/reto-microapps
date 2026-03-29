-- =============================================
-- HelpDesk Schema
-- =============================================

create table if not exists helpdesk_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  category text not null default 'general' check (category in ('general', 'billing', 'technical', 'feature', 'bug')),
  customer_name text,
  customer_email text,
  assigned_to text,
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists helpdesk_comments (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references helpdesk_tickets(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  is_internal boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security
alter table helpdesk_tickets enable row level security;
alter table helpdesk_comments enable row level security;

create policy "Users can manage their own tickets"
  on helpdesk_tickets for all
  using (auth.uid() = user_id);

create policy "Users can manage comments on their tickets"
  on helpdesk_comments for all
  using (
    exists (
      select 1 from helpdesk_tickets
      where id = ticket_id and user_id = auth.uid()
    )
  );
