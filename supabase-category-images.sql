-- MA DIGITAL SHOP — stockage des images de catégories
-- À exécuter dans Supabase > SQL Editor.

insert into storage.buckets (id, name, public)
values ('category-images','category-images',true)
on conflict (id) do update set public=true;

drop policy if exists "Public can read category images" on storage.objects;
drop policy if exists "Admin can upload category images" on storage.objects;
drop policy if exists "Admin can update category images" on storage.objects;
drop policy if exists "Admin can delete category images" on storage.objects;

create policy "Public can read category images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'category-images');

create policy "Admin can upload category images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'category-images'
  and (select auth.uid()) =
  '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
);

create policy "Admin can update category images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'category-images'
  and (select auth.uid()) =
  '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
)
with check (
  bucket_id = 'category-images'
  and (select auth.uid()) =
  '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
);

create policy "Admin can delete category images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'category-images'
  and (select auth.uid()) =
  '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
);
