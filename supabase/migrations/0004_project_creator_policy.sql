drop policy if exists "project creators add themselves" on public.project_members;
drop policy if exists "project visibility" on public.projects;
create policy "project visibility" on public.projects for select to authenticated
  using (owner_id = auth.uid() or public.is_project_member(id));

create policy "project creators add themselves"
  on public.project_members for insert to authenticated
  with check (user_id = auth.uid() and exists (
    select 1 from public.projects
    where id = project_id and owner_id = auth.uid()
  ));