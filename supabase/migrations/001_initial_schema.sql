-- ========================================
-- Supabase SQL Schema
-- Tabla profiles + sincronización con auth.users
-- ========================================

-- ========================================
-- 1. Crear tabla profiles
-- ========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email varchar(255) not null,
  full_name varchar(255),
  avatar_url text,
  onboarding_completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================
-- 2. Habilitar RLS (Row Level Security)
-- ========================================
alter table public.profiles enable row level security;

-- ========================================
-- 3. Políticas RLS estrictas
-- ========================================

-- Política: Los usuarios solo pueden ver su propio perfil
create policy "Users can view own profile" 
  on public.profiles 
  for select 
  using (auth.uid() = id);

-- Política: Los usuarios solo pueden actualizar su propio perfil
create policy "Users can update own profile" 
  on public.profiles 
  for update 
  using (auth.uid() = id);

-- Política: Solo autenticados pueden insertar (controlado por trigger)
create policy "Users can insert own profile" 
  on public.profiles 
  for insert 
  with check (auth.uid() = id);

-- ========================================
-- 4. Trigger para sincronizar auth.users -> profiles
-- ========================================

-- Función que se ejecuta cuando se crea un usuario en auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, onboarding_completed)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que se ejecuta después de insertar en auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================
-- 5. Trigger para actualizar updated_at automáticamente
-- ========================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ========================================
-- 6. Índices para optimización
-- ========================================
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_onboarding on public.profiles(onboarding_completed);

-- ========================================
-- 7. Comentarios de documentación
-- ========================================
comment on table public.profiles is 'Perfiles de usuarios sincronizados con auth.users';
comment on column public.profiles.onboarding_completed is 'Indica si el usuario ha completado el flujo de onboarding';
