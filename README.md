<div align="center">

![Salary Tracker Poster](assets/poster.png)

# Salary Tracker

**Modern, Precision Shift Scheduling and Wage Tracking Progressive Web App**

[![Live Demo](https://img.shields.io/badge/Demo-aoe1920.github.io%2Fsalary--tracker-3b82f6?style=flat-square&logo=googlechrome&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Version](https://img.shields.io/badge/Release-v2.0.0-10b981?style=flat-square)](https://github.com/aoe1920/salary-tracker/releases)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20iOS%20%7C%20Android%20%7C%20Web-6366f1?style=flat-square&logo=pwa&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ESM-f59e0b?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

<p align="center">
  <a href="https://aoe1920.github.io/salary-tracker/"><strong>Launch App</strong></a> •
  <a href="README.vi.md">Tiếng Việt</a>
</p>

</div>

---

Salary Tracker is an offline-first Progressive Web App designed for shift workers, freelancers, and multi-workplace staff to track hours, calculate wages accurately, and generate instant payslips.

## Highlights

- **Smart Shift Detection:** Automatically classifies Morning, Noon, or Evening shifts by time overlap.
- **Precision Calculations:** Exact net hours after breaks, overnight shift handling past 00:00, overtime multipliers (1x, 1.5x, 2x, 3x), and allowances or deductions.
- **Multi-Workplace:** Manage multiple jobs with separate hourly rates and distinct color codes.
- **Canvas Payslips:** Render high-DPI payslips client-side and copy directly to clipboard or export as PNG, CSV, and JSON.
- **Cloud Sync and Security:** Supabase authentication (Username, Email, Google OAuth PKCE) with PostgreSQL Row Level Security (RLS).
- **Offline-First PWA:** Full offline capability via Service Worker Cache Storage, haptic feedback on mobile, and iOS-inspired Liquid Glass dock navigation.

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES2022 Modules), Modern CSS3 (Variables, Grid, Flexbox)
- **Backend:** Supabase (PostgreSQL 15, GoTrue Auth, Row Level Security)
- **Storage and PWA:** Service Worker API, Cache Storage, Web App Manifest
- **Rendering:** HTML5 Canvas API, SVG

## Quickstart

Run locally without build tools:

```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
npx serve .
```

Navigate to `http://localhost:3000` (or `http://localhost:8080`).

## PWA Installation

- **iOS (Safari):** Tap Share -> Add to Home Screen -> Add.
- **Android (Chrome):** Tap Menu -> Install app.
- **Desktop (Chrome/Edge):** Click Install in the address bar.

## Database Setup

Execute in your Supabase SQL Editor:

```sql
create table if not exists public.user_salary_data (
  user_id uuid references auth.users(id) on delete cascade primary key,
  username text,
  weeks jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.user_salary_data enable row level security;

create policy "Users can only manage their own salary data"
  on public.user_salary_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function public.delete_user() to authenticated;

create or replace function public.get_login_email(p_username text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  select u.email into v_email
  from auth.users u
  left join public.user_salary_data s on s.user_id = u.id
  where lower(s.username) = lower(p_username)
     or lower(u.raw_user_meta_data->>'username') = lower(p_username)
  limit 1;
  return v_email;
end;
$$;

grant execute on function public.get_login_email(text) to anon, authenticated;
```

## License

[MIT](LICENSE)
