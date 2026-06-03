-- Tabla de partidos
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  local_team text not null,
  away_team text not null,
  match_date timestamptz not null,
  group_name text not null,
  local_score int,
  away_score int,
  status text default 'pendiente'
);

-- Tabla de predicciones
create table if not exists public.predictions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  match_id uuid references public.matches not null,
  local_goals int not null default 0,
  away_goals int not null default 0,
  updated_at timestamptz default now(),
  unique(user_id, match_id)
);

-- RLS: matches (solo lectura)
alter table public.matches enable row level security;
create policy "Todos pueden ver partidos"
  on public.matches for select
  using (true);

-- RLS: predictions (cada usuario solo ve/edita sus predicciones)
alter table public.predictions enable row level security;
create policy "Cada usuario puede ver sus predicciones"
  on public.predictions for select
  using (auth.uid() = user_id);

create policy "Cada usuario puede crear sus predicciones"
  on public.predictions for insert
  with check (auth.uid() = user_id);

create policy "Cada usuario puede actualizar sus predicciones"
  on public.predictions for update
  using (auth.uid() = user_id);

-- Índices
create index if not exists idx_predictions_user_match on public.predictions (user_id, match_id);
create index if not exists idx_matches_group on public.matches (group_name);
create index if not exists idx_matches_date on public.matches (match_date);

-- Seed: todos los partidos del Mundial 2026
-- Grupos A-L, R32, R16, QF, SF, 3° puesto, Final

-- ============ GRUPO A ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('México', 'Sudáfrica', '2026-06-11 13:00:00+00', 'Grupo A'),
  ('Corea del Sur', 'Chequia', '2026-06-11 17:00:00+00', 'Grupo A'),
  ('México', 'Corea del Sur', '2026-06-15 13:00:00+00', 'Grupo A'),
  ('Sudáfrica', 'Chequia', '2026-06-15 17:00:00+00', 'Grupo A'),
  ('México', 'Chequia', '2026-06-19 13:00:00+00', 'Grupo A'),
  ('Sudáfrica', 'Corea del Sur', '2026-06-19 17:00:00+00', 'Grupo A');

-- ============ GRUPO B ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Canadá', 'Suiza', '2026-06-11 19:00:00+00', 'Grupo B'),
  ('Qatar', 'Bosnia y Herzegovina', '2026-06-11 21:00:00+00', 'Grupo B'),
  ('Canadá', 'Qatar', '2026-06-15 19:00:00+00', 'Grupo B'),
  ('Suiza', 'Bosnia y Herzegovina', '2026-06-15 21:00:00+00', 'Grupo B'),
  ('Canadá', 'Bosnia y Herzegovina', '2026-06-19 19:00:00+00', 'Grupo B'),
  ('Suiza', 'Qatar', '2026-06-19 21:00:00+00', 'Grupo B');

-- ============ GRUPO C ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Brasil', 'Marruecos', '2026-06-12 13:00:00+00', 'Grupo C'),
  ('Escocia', 'Haití', '2026-06-12 17:00:00+00', 'Grupo C'),
  ('Brasil', 'Escocia', '2026-06-16 13:00:00+00', 'Grupo C'),
  ('Marruecos', 'Haití', '2026-06-16 17:00:00+00', 'Grupo C'),
  ('Brasil', 'Haití', '2026-06-20 13:00:00+00', 'Grupo C'),
  ('Marruecos', 'Escocia', '2026-06-20 17:00:00+00', 'Grupo C');

-- ============ GRUPO D ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Estados Unidos', 'Paraguay', '2026-06-12 19:00:00+00', 'Grupo D'),
  ('Australia', 'Turquía', '2026-06-12 21:00:00+00', 'Grupo D'),
  ('Estados Unidos', 'Australia', '2026-06-16 19:00:00+00', 'Grupo D'),
  ('Paraguay', 'Turquía', '2026-06-16 21:00:00+00', 'Grupo D'),
  ('Estados Unidos', 'Turquía', '2026-06-20 19:00:00+00', 'Grupo D'),
  ('Paraguay', 'Australia', '2026-06-20 21:00:00+00', 'Grupo D');

-- ============ GRUPO E ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Alemania', 'Ecuador', '2026-06-13 13:00:00+00', 'Grupo E'),
  ('Costa de Marfil', 'Curazao', '2026-06-13 17:00:00+00', 'Grupo E'),
  ('Alemania', 'Costa de Marfil', '2026-06-17 13:00:00+00', 'Grupo E'),
  ('Ecuador', 'Curazao', '2026-06-17 17:00:00+00', 'Grupo E'),
  ('Alemania', 'Curazao', '2026-06-21 13:00:00+00', 'Grupo E'),
  ('Ecuador', 'Costa de Marfil', '2026-06-21 17:00:00+00', 'Grupo E');

-- ============ GRUPO F ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Países Bajos', 'Japón', '2026-06-13 19:00:00+00', 'Grupo F'),
  ('Túnez', 'Suecia', '2026-06-13 21:00:00+00', 'Grupo F'),
  ('Países Bajos', 'Túnez', '2026-06-17 19:00:00+00', 'Grupo F'),
  ('Japón', 'Suecia', '2026-06-17 21:00:00+00', 'Grupo F'),
  ('Países Bajos', 'Suecia', '2026-06-21 19:00:00+00', 'Grupo F'),
  ('Japón', 'Túnez', '2026-06-21 21:00:00+00', 'Grupo F');

-- ============ GRUPO G ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Bélgica', 'Irán', '2026-06-14 13:00:00+00', 'Grupo G'),
  ('Egipto', 'Nueva Zelanda', '2026-06-14 17:00:00+00', 'Grupo G'),
  ('Bélgica', 'Egipto', '2026-06-18 13:00:00+00', 'Grupo G'),
  ('Irán', 'Nueva Zelanda', '2026-06-18 17:00:00+00', 'Grupo G'),
  ('Bélgica', 'Nueva Zelanda', '2026-06-22 13:00:00+00', 'Grupo G'),
  ('Irán', 'Egipto', '2026-06-22 17:00:00+00', 'Grupo G');

-- ============ GRUPO H ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('España', 'Uruguay', '2026-06-14 19:00:00+00', 'Grupo H'),
  ('Arabia Saudita', 'Cabo Verde', '2026-06-14 21:00:00+00', 'Grupo H'),
  ('España', 'Arabia Saudita', '2026-06-18 19:00:00+00', 'Grupo H'),
  ('Uruguay', 'Cabo Verde', '2026-06-18 21:00:00+00', 'Grupo H'),
  ('España', 'Cabo Verde', '2026-06-22 19:00:00+00', 'Grupo H'),
  ('Uruguay', 'Arabia Saudita', '2026-06-22 21:00:00+00', 'Grupo H');

-- ============ GRUPO I ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Francia', 'Senegal', '2026-06-23 13:00:00+00', 'Grupo I'),
  ('Noruega', 'Irak', '2026-06-23 15:00:00+00', 'Grupo I'),
  ('Francia', 'Noruega', '2026-06-25 13:00:00+00', 'Grupo I'),
  ('Senegal', 'Irak', '2026-06-25 15:00:00+00', 'Grupo I'),
  ('Francia', 'Irak', '2026-06-27 13:00:00+00', 'Grupo I'),
  ('Senegal', 'Noruega', '2026-06-27 15:00:00+00', 'Grupo I');

-- ============ GRUPO J ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Argentina', 'Argelia', '2026-06-23 17:00:00+00', 'Grupo J'),
  ('Austria', 'Jordania', '2026-06-23 19:00:00+00', 'Grupo J'),
  ('Argentina', 'Austria', '2026-06-25 17:00:00+00', 'Grupo J'),
  ('Argelia', 'Jordania', '2026-06-25 19:00:00+00', 'Grupo J'),
  ('Argentina', 'Jordania', '2026-06-27 17:00:00+00', 'Grupo J'),
  ('Argelia', 'Austria', '2026-06-27 19:00:00+00', 'Grupo J');

-- ============ GRUPO K ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Portugal', 'Colombia', '2026-06-24 13:00:00+00', 'Grupo K'),
  ('Camerún', 'Emiratos Árabes Unidos', '2026-06-24 15:00:00+00', 'Grupo K'),
  ('Portugal', 'Camerún', '2026-06-26 13:00:00+00', 'Grupo K'),
  ('Colombia', 'Emiratos Árabes Unidos', '2026-06-26 15:00:00+00', 'Grupo K'),
  ('Portugal', 'Emiratos Árabes Unidos', '2026-06-28 13:00:00+00', 'Grupo K'),
  ('Colombia', 'Camerún', '2026-06-28 15:00:00+00', 'Grupo K');

-- ============ GRUPO L ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('Inglaterra', 'Croacia', '2026-06-24 17:00:00+00', 'Grupo L'),
  ('Ghana', 'Panamá', '2026-06-24 19:00:00+00', 'Grupo L'),
  ('Inglaterra', 'Ghana', '2026-06-26 17:00:00+00', 'Grupo L'),
  ('Croacia', 'Panamá', '2026-06-26 19:00:00+00', 'Grupo L'),
  ('Inglaterra', 'Panamá', '2026-06-28 17:00:00+00', 'Grupo L'),
  ('Croacia', 'Ghana', '2026-06-28 19:00:00+00', 'Grupo L');

-- ============ R32 (OCTAVOS DE FINAL) ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('1A', '2B', '2026-06-30 13:00:00+00', 'R32'),
  ('1C', '2D', '2026-06-30 17:00:00+00', 'R32'),
  ('1E', '2F', '2026-06-30 19:00:00+00', 'R32'),
  ('1G', '2H', '2026-07-01 13:00:00+00', 'R32'),
  ('1I', '2J', '2026-07-01 17:00:00+00', 'R32'),
  ('1K', '2L', '2026-07-01 19:00:00+00', 'R32'),
  ('1B', '2A', '2026-07-02 13:00:00+00', 'R32'),
  ('1D', '2C', '2026-07-02 17:00:00+00', 'R32'),
  ('1F', '2E', '2026-07-02 19:00:00+00', 'R32'),
  ('1H', '2G', '2026-07-03 13:00:00+00', 'R32'),
  ('1J', '2I', '2026-07-03 17:00:00+00', 'R32'),
  ('1L', '2K', '2026-07-03 19:00:00+00', 'R32'),
  ('3A', '3B', '2026-07-04 13:00:00+00', 'R32'),
  ('3C', '3D', '2026-07-04 17:00:00+00', 'R32'),
  ('3E', '3F', '2026-07-04 19:00:00+00', 'R32'),
  ('3G', '3H', '2026-07-05 17:00:00+00', 'R32');

-- ============ R16 ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('R32-1', 'R32-2', '2026-07-06 13:00:00+00', 'R16'),
  ('R32-3', 'R32-4', '2026-07-06 17:00:00+00', 'R16'),
  ('R32-5', 'R32-6', '2026-07-07 13:00:00+00', 'R16'),
  ('R32-7', 'R32-8', '2026-07-07 17:00:00+00', 'R16'),
  ('R32-9', 'R32-10', '2026-07-08 13:00:00+00', 'R16'),
  ('R32-11', 'R32-12', '2026-07-08 17:00:00+00', 'R16'),
  ('R32-13', 'R32-14', '2026-07-09 13:00:00+00', 'R16'),
  ('R32-15', 'R32-16', '2026-07-09 17:00:00+00', 'R16');

-- ============ QF (CUARTOS) ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('R16-1', 'R16-2', '2026-07-11 13:00:00+00', 'Cuartos'),
  ('R16-3', 'R16-4', '2026-07-11 17:00:00+00', 'Cuartos'),
  ('R16-5', 'R16-6', '2026-07-12 13:00:00+00', 'Cuartos'),
  ('R16-7', 'R16-8', '2026-07-12 17:00:00+00', 'Cuartos');

-- ============ SF (SEMIS) ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('QF-1', 'QF-2', '2026-07-14 17:00:00+00', 'Semifinal'),
  ('QF-3', 'QF-4', '2026-07-15 17:00:00+00', 'Semifinal');

-- ============ 3° PUESTO ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('SF-1 Perdedor', 'SF-2 Perdedor', '2026-07-18 17:00:00+00', 'Tercer Puesto');

-- ============ FINAL ============
insert into public.matches (local_team, away_team, match_date, group_name) values
  ('SF-1 Ganador', 'SF-2 Ganador', '2026-07-19 16:00:00+00', 'Final');
