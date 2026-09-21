-- MA DIGITAL SHOP — Supabase Storage for product images
-- Run once in Supabase SQL Editor.
-- Admin UUID: 7e974a6a-51e5-449a-b115-71207df79d24

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;

create policy "Public can read product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

create policy "Admin can upload product images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'product-images'
  and (select auth.uid()) = '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
);

create policy "Admin can update product images"
on storage.objects for update to authenticated
using (
  bucket_id = 'product-images'
  and (select auth.uid()) = '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
)
with check (
  bucket_id = 'product-images'
  and (select auth.uid()) = '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
);

create policy "Admin can delete product images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'product-images'
  and (select auth.uid()) = '7e974a6a-51e5-449a-b115-71207df79d24'::uuid
);
