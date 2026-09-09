-- Every authenticated active workspace profile can manage shared workspace content.
drop policy if exists "members create papers" on public.papers;
drop policy if exists "authors manage papers" on public.papers;
drop policy if exists "authors delete papers" on public.papers;
create policy "shared papers" on public.papers
  for all to authenticated using (true) with check (created_by = auth.uid());

drop policy if exists "authors update attention notes" on public.attention_notes;
drop policy if exists "authors delete attention notes" on public.attention_notes;
create policy "shared attention notes" on public.attention_notes
  for update to authenticated using (true) with check (true);
create policy "shared attention note deletion" on public.attention_notes
  for delete to authenticated using (true);

drop policy if exists "members create activity" on public.activity_feed;
create policy "shared activity creation" on public.activity_feed
  for insert to authenticated with check (actor_id = auth.uid());