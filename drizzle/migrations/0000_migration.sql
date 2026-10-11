create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  slug text not null unique,
  description text,
  gender text check (gender in ('homme','femme','mixte')),
  fragrance_notes text,
  published boolean not null default false,
  featured boolean not null default false,
  new_arrival boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false
);
create index on public.product_images(product_id);
create index on public.product_categories(category_id);

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_updated before update on public.products for each row execute function public.touch_updated_at();

grant select on public.categories, public.products, public.product_categories, public.product_images to anon, authenticated;
grant all on public.categories, public.products, public.product_categories, public.product_images to service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_images enable row level security;

create policy "public read active categories" on public.categories for select using (active);
create policy "public read published products" on public.products for select using (published);
create policy "public read pc of published" on public.product_categories for select using (exists (select 1 from public.products p where p.id = product_id and p.published));
create policy "public read images of published" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and p.published));

insert into public.categories (name, slug, description, sort_order) values
('Boisés','boises','Bois précieux, cèdre, santal et vétiver.',1),
('Floraux','floraux','Rose, jasmin, fleur d''oranger et bouquets délicats.',2),
('Orientaux','orientaux','Oud, ambre, épices et résines chaudes.',3),
('Frais','frais','Agrumes, notes marines et aromatiques.',4);

create policy "read images of published products" on storage.objects for select
using (bucket_id = 'product-images' and exists (
  select 1 from public.product_images i join public.products p on p.id = i.product_id
  where i.storage_path = storage.objects.name and p.published));