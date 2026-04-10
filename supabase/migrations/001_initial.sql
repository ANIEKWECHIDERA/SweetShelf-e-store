create extension if not exists "uuid-ossp";

create table if not exists stores (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  whatsapp text,
  currency text default 'NGN',
  delivery_fee numeric(10,2) default 0,
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order int default 0,
  unique(store_id, slug)
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  category_id uuid references categories(id),
  name text not null,
  slug text not null,
  description text,
  price numeric(10,2) not null,
  image_urls text[] default '{}',
  stock_quantity int default 0,
  low_stock_threshold int default 3,
  status text check (status in ('in_stock','out_of_stock')) default 'in_stock',
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(store_id, slug)
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  customer_id uuid,
  customer_email text,
  customer_name text not null,
  customer_phone text,
  delivery_type text check (delivery_type in ('delivery','pickup')) default 'pickup',
  delivery_address jsonb,
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text check (status in ('pending','confirmed','preparing','ready','delivered','cancelled')) default 'pending',
  payment_status text check (payment_status in ('unpaid','paid','refunded')) default 'unpaid',
  payment_ref text unique,
  payment_channel text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  product_price numeric(10,2) not null,
  quantity int not null,
  subtotal numeric(10,2) not null
);

create table if not exists webhook_events (
  id uuid primary key default uuid_generate_v4(),
  provider text not null,
  event_id text not null,
  payload jsonb not null,
  processed_at timestamptz default now(),
  unique(provider, event_id)
);
