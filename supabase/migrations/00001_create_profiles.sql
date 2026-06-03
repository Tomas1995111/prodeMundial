create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nombre_completo text not null,
  email text not null,
  telefono text,
  created_at timestamp with time zone default now() not null
);

alter table public.profiles enable row level security;

create policy "Cada usuario puede ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Cada usuario puede insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Cada usuario puede actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);