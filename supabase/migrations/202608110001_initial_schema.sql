create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.content_pillars (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  color text not null default '#9eaf96' check (color ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now(),
  unique (workspace_id, name)
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  pillar_id uuid references public.content_pillars(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 180),
  summary text not null default '',
  hook text not null default '',
  caption text not null default '',
  production_notes text not null default '',
  format text not null default 'Post' check (format in ('Reel', 'Carousel', 'Post', 'Story', 'Newsletter')),
  status text not null default 'idea' check (status in ('idea', 'drafting', 'review', 'scheduled', 'published')),
  platforms text[] not null default '{}',
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_items_workspace_publish_idx
  on public.content_items (workspace_id, publish_at);
create index content_items_workspace_status_idx
  on public.content_items (workspace_id, status);
create index workspace_members_user_idx
  on public.workspace_members (user_id);

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.can_edit_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'editor')
  );
$$;

create or replace function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function public.add_workspace_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger add_workspace_owner_after_insert
after insert on public.workspaces
for each row execute function public.add_workspace_owner();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.content_pillars enable row level security;
alter table public.content_items enable row level security;

create policy "Profiles are visible to their owner"
on public.profiles for select
using (id = auth.uid());

create policy "Profiles are editable by their owner"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can create their profile"
on public.profiles for insert
with check (id = auth.uid());

create policy "Members can view workspaces"
on public.workspaces for select
using (public.is_workspace_member(id));

create policy "Users can create workspaces"
on public.workspaces for insert
with check (created_by = auth.uid());

create policy "Owners can update workspaces"
on public.workspaces for update
using (public.is_workspace_owner(id))
with check (public.is_workspace_owner(id));

create policy "Members can view memberships"
on public.workspace_members for select
using (public.is_workspace_member(workspace_id));

create policy "Owners can manage memberships"
on public.workspace_members for all
using (public.is_workspace_owner(workspace_id))
with check (public.is_workspace_owner(workspace_id));

create policy "Members can view pillars"
on public.content_pillars for select
using (public.is_workspace_member(workspace_id));

create policy "Editors can create pillars"
on public.content_pillars for insert
with check (public.can_edit_workspace(workspace_id));

create policy "Editors can update pillars"
on public.content_pillars for update
using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "Editors can delete pillars"
on public.content_pillars for delete
using (public.can_edit_workspace(workspace_id));

create policy "Members can view content"
on public.content_items for select
using (public.is_workspace_member(workspace_id));

create policy "Editors can create content"
on public.content_items for insert
with check (public.can_edit_workspace(workspace_id) and created_by = auth.uid());

create policy "Editors can update content"
on public.content_items for update
using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "Editors can delete content"
on public.content_items for delete
using (public.can_edit_workspace(workspace_id));

grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.can_edit_workspace(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;
