create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  phone text check (phone is null or char_length(phone) <= 20),
  email text check (email is null or char_length(email) <= 255),
  message text not null check (char_length(message) between 5 and 2000),
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send a message" on public.contact_messages for insert to anon, authenticated with check (true);