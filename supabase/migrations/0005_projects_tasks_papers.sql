create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  topic text not null check (length(trim(topic)) > 0),
  doi text not null unique check (length(trim(doi)) > 0),
  download_link text,
  created_by uuid not null references public.users_profile(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.papers enable row level security;
create policy "papers readable to authenticated" on public.papers
  for select to authenticated using (true);
create policy "members create papers" on public.papers
  for insert to authenticated with check (created_by = auth.uid());
create policy "authors manage papers" on public.papers
  for update to authenticated using (created_by = auth.uid() or public.is_admin_or_owner())
  with check (created_by = auth.uid() or public.is_admin_or_owner());
create policy "authors delete papers" on public.papers
  for delete to authenticated using (created_by = auth.uid() or public.is_admin_or_owner());

drop policy if exists "project leads delete" on public.projects;
create policy "project leads delete" on public.projects for delete to authenticated
  using (public.is_admin_or_owner() or exists(
    select 1 from public.project_members pm
    where pm.project_id = id and pm.user_id = auth.uid() and pm.project_role = 'lead'
  ));

create index if not exists papers_topic_idx on public.papers(topic);