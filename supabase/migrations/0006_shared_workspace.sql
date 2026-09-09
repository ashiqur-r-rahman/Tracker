-- All authenticated workspace profiles share the same project/task workspace.
drop policy if exists "project visibility" on public.projects;
create policy "shared project visibility" on public.projects
  for select to authenticated using (true);

drop policy if exists "admins create projects" on public.projects;
drop policy if exists "active members create projects" on public.projects;
create policy "shared project creation" on public.projects
  for insert to authenticated
  with check (owner_id = auth.uid() and exists (
    select 1 from public.users_profile
    where id = auth.uid() and is_active
  ));

drop policy if exists "project leads update" on public.projects;
create policy "shared project updates" on public.projects
  for update to authenticated using (true) with check (true);

drop policy if exists "project leads delete" on public.projects;
create policy "shared project deletion" on public.projects
  for delete to authenticated using (true);

drop policy if exists "tasks by membership" on public.tasks;
create policy "shared tasks" on public.tasks
  for all to authenticated using (true) with check (true);

drop policy if exists "activity visible to authenticated" on public.activity_feed;
create policy "shared activity" on public.activity_feed
  for select to authenticated using (true);