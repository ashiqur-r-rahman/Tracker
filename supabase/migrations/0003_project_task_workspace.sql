-- Project-centered task workflow and team attention notes.
alter table public.tasks
  add column if not exists task_state text not null default 'todo'
    check (task_state in ('todo', 'running', 'done')),
  add column if not exists task_what text,
  add column if not exists goal text,
  add column if not exists source text,
  add column if not exists source_link text,
  add column if not exists expected_duration_minutes int
    check (expected_duration_minutes is null or expected_duration_minutes >= 0),
  add column if not exists completion_summary text;

update public.tasks
set task_state = case status::text
  when 'backlog' then 'todo'
  when 'todo' then 'todo'
  when 'in_progress' then 'running'
  when 'in_review' then 'running'
  when 'done' then 'done'
  when 'blocked' then 'running'
  else 'todo'
end
where task_state = 'todo';

update public.tasks
set task_what = coalesce(task_what, title),
    goal = coalesce(goal, description)
where task_what is null or goal is null;

create index if not exists tasks_project_state_idx
  on public.tasks(project_id, task_state, position);

create table if not exists public.attention_notes (
  id uuid primary key default gen_random_uuid(),
  body text not null check (length(trim(body)) > 0),
  author_id uuid not null references public.users_profile(id) on delete cascade,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists attention_notes_recent_idx
  on public.attention_notes(created_at desc);

alter table public.attention_notes enable row level security;

create policy "active members create projects"
  on public.projects for insert to authenticated
  with check (owner_id = auth.uid() and exists (
    select 1 from public.users_profile
    where id = auth.uid() and is_active
  ));

create policy "project creators add themselves"
  on public.project_members for insert to authenticated
  with check (user_id = auth.uid() and public.is_project_member(project_id));

create policy "attention notes readable to authenticated"
  on public.attention_notes for select to authenticated using (true);

create policy "members create attention notes"
  on public.attention_notes for insert to authenticated
  with check (author_id = auth.uid());

create policy "authors update attention notes"
  on public.attention_notes for update to authenticated
  using (author_id = auth.uid() or public.is_admin_or_owner())
  with check (author_id = auth.uid() or public.is_admin_or_owner());

create policy "authors delete attention notes"
  on public.attention_notes for delete to authenticated
  using (author_id = auth.uid() or public.is_admin_or_owner());

create policy "members create activity"
  on public.activity_feed for insert to authenticated
  with check (actor_id = auth.uid());

drop policy if exists "activity by membership" on public.activity_feed;
create policy "activity visible to authenticated"
  on public.activity_feed for select to authenticated
  using (project_id is null or public.is_project_member(project_id));