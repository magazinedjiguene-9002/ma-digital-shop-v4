-- MA DIGITAL SHOP — catégories dynamiques
-- Exécuter dans Supabase > SQL Editor.

create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text default '',
  image_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
alter table public.categories enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Admin can read all categories" on public.categories;
drop policy if exists "Admin can insert categories" on public.categories;
drop policy if exists "Admin can update categories" on public.categories;
drop policy if exists "Admin can delete categories" on public.categories;

create policy "Public can read active categories" on public.categories for select to anon, authenticated using (active = true);
create policy "Admin can read all categories" on public.categories for select to authenticated using ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can insert categories" on public.categories for insert to authenticated with check ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can update categories" on public.categories for update to authenticated using ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid) with check ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);
create policy "Admin can delete categories" on public.categories for delete to authenticated using ((select auth.uid()) = 'abe1de6b-43bc-4f42-96f8-1b404fc5f7d1'::uuid);

insert into public.categories (id,name,description,image_url,sort_order,active) values
('streaming','Streaming','Netflix, Prime Video, Crunchyroll et services de streaming.','assets/category-streaming.jpg',1,true),
('gaming','Gaming','Jeux PC et bibliothèque gaming.','assets/category-gaming.jpg',2,true),
('software','Logiciels','Windows, Microsoft, Adobe, macOS et sécurité.','assets/category-software.jpg',3,true),
('accessory','Accessoires','Manettes, souris, claviers, casques et autres accessoires.','assets/category-accessories.jpg',4,true)
on conflict (id) do update set name=excluded.name,description=excluded.description,image_url=excluded.image_url,sort_order=excluded.sort_order,active=true,updated_at=now();

create index if not exists categories_sort_order_idx on public.categories(sort_order,id);
