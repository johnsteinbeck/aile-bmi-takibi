alter table public.people drop constraint if exists people_gender_check;
alter table public.people add constraint people_gender_check check (gender in ('kadın', 'erkek', 'kedi') or gender is null);
