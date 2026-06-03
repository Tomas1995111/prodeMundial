-- Scoring system and leaderboard

-- Grant usage on schema to authenticated (idempotent)
grant usage on schema public to authenticated;

-- Calculate points for a single user
create or replace function calculate_user_points(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  total integer;
begin
  select coalesce(sum(
    case
      when pr.local_goals = m.local_score and pr.away_goals = m.away_score then 5
      when sign(pr.local_goals - pr.away_goals) = sign(m.local_score - m.away_score) then 3
      else 0
    end
  ), 0)
  into total
  from predictions pr
  join matches m on m.id = pr.match_id
  where pr.user_id = p_user_id
    and m.local_score is not null;

  return total;
end;
$$;

-- Get full leaderboard with all users
create or replace function get_leaderboard()
returns table (
  user_id uuid,
  nombre_completo text,
  total_points bigint
)
language plpgsql
security definer
as $$
begin
  return query
  select
    p.id,
    p.nombre_completo,
    coalesce(sum(
      case
        when pr.local_goals = m.local_score and pr.away_goals = m.away_score then 5
        when sign(pr.local_goals - pr.away_goals) = sign(m.local_score - m.away_score) then 3
        else 0
      end
    ), 0)::bigint as total_points
  from profiles p
  left join predictions pr on pr.user_id = p.id
  left join matches m on m.id = pr.match_id and m.local_score is not null
  group by p.id, p.nombre_completo
  order by total_points desc;
end;
$$;

-- Admin function to set match result (bypasses RLS via security definer)
create or replace function admin_set_match_score(
  p_match_id uuid,
  p_local_score int,
  p_away_score int
)
returns void
language plpgsql
security definer
as $$
begin
  update public.matches
  set local_score = p_local_score,
      away_score = p_away_score,
      status = 'finalizado'
  where id = p_match_id;
end;
$$;

-- Grant execute permissions
grant execute on function calculate_user_points to authenticated;
grant execute on function get_leaderboard to authenticated;
grant execute on function admin_set_match_score to authenticated;

-- Allow all authenticated users to see all profiles (for leaderboard)
drop policy if exists "Usuarios autenticados pueden ver todos los perfiles" on public.profiles;
create policy "Usuarios autenticados pueden ver todos los perfiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');
