-- Pizzeria Tov production menu schema.
-- Run this in Supabase Dashboard > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.app_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('napoli', 'drinks')),
  menu_group text not null check (menu_group in ('chef', 'signature', 'drinks')),
  name_tr text not null,
  name_en text,
  ingredients_tr text[] not null default '{}',
  ingredients_en text[] not null default '{}',
  price_text_tr text not null,
  price_text_en text,
  visual text not null default 'tomato',
  image_path text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_menu_products_updated_at on public.menu_products;
create trigger set_menu_products_updated_at
before update on public.menu_products
for each row
execute function public.set_updated_at();

-- Replace this email with the restaurant owner's real admin email before launch.
insert into public.app_admins (email)
values ('owner@example.com')
on conflict (email) do nothing;

alter table public.app_admins enable row level security;
alter table public.menu_products enable row level security;

create or replace function public.is_menu_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.app_admins
    where user_id = auth.uid()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_menu_admin() to anon, authenticated;

drop policy if exists "Admins can read their admin grant" on public.app_admins;
create policy "Admins can read their admin grant"
on public.app_admins
for select
to authenticated
using (
  user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "Admins can bind their user id" on public.app_admins;
create policy "Admins can bind their user id"
on public.app_admins
for update
to authenticated
using (
  user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  user_id = auth.uid()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "Public can read visible menu products" on public.menu_products;
create policy "Public can read visible menu products"
on public.menu_products
for select
to anon, authenticated
using (is_visible = true or public.is_menu_admin());

drop policy if exists "Admins can insert menu products" on public.menu_products;
create policy "Admins can insert menu products"
on public.menu_products
for insert
to authenticated
with check (public.is_menu_admin());

drop policy if exists "Admins can update menu products" on public.menu_products;
create policy "Admins can update menu products"
on public.menu_products
for update
to authenticated
using (public.is_menu_admin())
with check (public.is_menu_admin());

drop policy if exists "Admins can delete menu products" on public.menu_products;
create policy "Admins can delete menu products"
on public.menu_products
for delete
to authenticated
using (public.is_menu_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_menu_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_menu_admin())
with check (bucket_id = 'product-images' and public.is_menu_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_menu_admin());

insert into public.menu_products (
  slug,
  category,
  menu_group,
  name_tr,
  name_en,
  ingredients_tr,
  ingredients_en,
  price_text_tr,
  price_text_en,
  visual,
  image_path,
  sort_order,
  is_visible
) values
  (
    'margherita',
    'napoli',
    'chef',
    'Margherita',
    'Margherita',
    array['Eritilmiş peynir', 'San Marzano domates', 'Fesleğen', 'Parmesan', 'Zeytinyağı'],
    array['Melted cheese', 'San Marzano tomatoes', 'Basil', 'Parmesan', 'Olive oil'],
    '415 ₺',
    '415 ₺',
    'tomato',
    'assets/menu/Margherita.png',
    10,
    true
  ),
  (
    'marinara',
    'napoli',
    'chef',
    'Marinara',
    'Marinara',
    array['San Marzano domates sos', 'Fesleğen', 'Siyah zeytin', 'Acı zeytin', 'Zeytinyağı'],
    array['San Marzano tomato sauce', 'Basil', 'Black olives', 'Spicy olives', 'Olive oil'],
    '240 ₺',
    '240 ₺',
    'tomato',
    null,
    20,
    true
  ),
  (
    'no-1',
    'napoli',
    'signature',
    'No:1',
    'No:1',
    array['San Marzano domates sos', 'Fesleğen', 'Dilber eritilmiş peyniri', 'Parmesan', 'Mantar mix', 'Zeytinyağı'],
    array['San Marzano tomato sauce', 'Basil', 'Dilber melted cheese', 'Parmesan', 'Mixed mushrooms', 'Olive oil'],
    '460 ₺',
    '460 ₺',
    'mushroom',
    'assets/menu/mantar-pizza-dilim.jpg',
    30,
    true
  ),
  (
    'no-2',
    'napoli',
    'signature',
    'No:2',
    'No:2',
    array['Gorgonzola', 'Kars gravyeri', 'Dilber eritilmiş peyniri', 'Fesleğen', 'Parmesan', 'Mantar mix', 'Zeytinyağı', 'Soslu etler'],
    array['Gorgonzola', 'Kars gruyere', 'Dilber melted cheese', 'Basil', 'Parmesan', 'Mixed mushrooms', 'Olive oil', 'Sauced meats'],
    '485 ₺',
    '485 ₺',
    'cheese',
    'assets/menu/mantar-pizza.jpg',
    40,
    true
  ),
  (
    'no-3',
    'napoli',
    'signature',
    'No:3',
    'No:3',
    array['Gorgonzola peyniri', 'Fesleğen', 'Parmesan peyniri', 'Dilber peyniri', 'Mantar', 'Füme et', 'Ricotta kreması', 'Balzamik', 'Karabiber'],
    array['Gorgonzola cheese', 'Basil', 'Parmesan cheese', 'Dilber cheese', 'Mushroom', 'Smoked meat', 'Ricotta cream', 'Balsamic', 'Black pepper'],
    'Fiyat sorunuz',
    'Ask price',
    'mushroom',
    'assets/menu/no 3.png',
    50,
    true
  ),
  (
    'pepperoni',
    'napoli',
    'signature',
    'Pepperoni',
    'Pepperoni',
    array['San Marzano domates sos', 'Fesleğen', 'Parmesan', 'Dilber eritilmiş peyniri', 'Kayap sucuk', 'Deniz zeytinyağı'],
    array['San Marzano tomato sauce', 'Basil', 'Parmesan', 'Dilber melted cheese', 'Kayap sucuk', 'Deniz olive oil'],
    '525 ₺',
    '525 ₺',
    'tomato',
    'assets/menu/pepperoni.png',
    60,
    true
  ),
  (
    'dort-peynir',
    'napoli',
    'signature',
    '4 Peynirli Pizza',
    'Four Cheese Pizza',
    array['Dilberice', 'Kars gravyeri', 'Gorgonzola', 'Parmesan', 'Dilber peyniri', 'Kaymak', 'Bal'],
    array['Dilberice', 'Kars gruyere', 'Gorgonzola', 'Parmesan', 'Dilber cheese', 'Cream', 'Honey'],
    '570 ₺',
    '570 ₺',
    'cheese',
    'assets/menu/dort-peynir.jpg',
    70,
    true
  ),
  (
    'burrata-special',
    'napoli',
    'signature',
    'Burrata Special',
    'Burrata Special',
    array['Burrata', 'Roka', 'Cherry domates', 'Pesto'],
    array['Burrata', 'Arugula', 'Cherry tomatoes', 'Pesto'],
    '460 ₺',
    '460 ₺',
    'cheese',
    'assets/menu/burrata-special.jpg',
    80,
    true
  ),
  (
    'san-pellegrino',
    'drinks',
    'drinks',
    'San Pellegrino',
    'San Pellegrino',
    array['Maden suyu'],
    array['Sparkling mineral water'],
    '120 ₺',
    '120 ₺',
    'drink',
    null,
    90,
    true
  ),
  (
    'espresso',
    'drinks',
    'drinks',
    'Espresso',
    'Espresso',
    array['Yoğun İtalyan espresso'],
    array['Intense Italian espresso'],
    '95 ₺',
    '95 ₺',
    'drink',
    null,
    100,
    true
  )
on conflict (slug) do update
set category = excluded.category,
    menu_group = excluded.menu_group,
    name_tr = excluded.name_tr,
    name_en = excluded.name_en,
    ingredients_tr = excluded.ingredients_tr,
    ingredients_en = excluded.ingredients_en,
    price_text_tr = excluded.price_text_tr,
    price_text_en = excluded.price_text_en,
    visual = excluded.visual,
    image_path = excluded.image_path,
    sort_order = excluded.sort_order,
    is_visible = excluded.is_visible;
