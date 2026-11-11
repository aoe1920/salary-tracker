<div align="center">

![Salary Tracker](assets/poster.png)

# Salary Tracker

**Precision Shift Scheduling and Wage Tracking Progressive Web App**

[![Live Demo](https://img.shields.io/badge/Demo-aoe1920.github.io%2Fsalary--tracker-3b82f6?style=flat-square&logo=googlechrome&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Version](https://img.shields.io/badge/Release-v1.29-10b981?style=flat-square)](https://github.com/aoe1920/salary-tracker/releases)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20iOS%20%7C%20Android%20%7C%20Web-6366f1?style=flat-square&logo=pwa&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ESM-f59e0b?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

<p align="center">
  <a href="https://aoe1920.github.io/salary-tracker/"><strong>Live Demo</strong></a>
</p>

</div>

---

Salary Tracker is an offline-first Progressive Web App designed for shift workers, freelancers, and multi-workplace staff to log hours accurately, automate wage calculations, and generate client-side payslips.

## Key Features

- **Smart Shift Detection:** Automatically classifies shifts into Morning, Noon, or Night based on time overlap.
- **Precision Wage Calculations:** Exact net hours with unpaid break deductions, seamless overnight shifts spanning past midnight, configurable overtime multipliers (1.5x, 2.0x, 3.0x), and shift allowances.
- **Multi-Workplace Management:** Manage multiple employers with independent hourly wages, distinct color tags, and aggregated hours and earnings breakdown.
- **Instant Canvas Payslips:** Renders high-DPI payslips client-side with one-click clipboard copying and high-resolution PNG export.
- **Cloud Synchronization and Security:** Supabase Cloud authentication (Email, Password, Google OAuth PKCE) protected by PostgreSQL Row Level Security (RLS) for complete privacy and tenant isolation.
- **Offline-First PWA Architecture:** Operates seamlessly without network connectivity via Service Worker Cache Storage, with native-like haptic feedback on mobile.
- **Abstract Acrylic Liquid Glass UI:** Translucent layered panels, specular rim highlights, balanced light and dark modes, and mobile-friendly floating dock navigation.

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES2022 Modules), Modern CSS3 (Variables, Flexbox, Grid, Backdrop Filters)
- **Backend and Cloud:** Supabase (PostgreSQL 15, GoTrue Auth, Row Level Security)
- **Offline and Storage:** Service Worker API, Cache Storage, Web App Manifest
- **Rendering:** HTML5 Canvas API, Inline Vector SVG

## Quickstart

Run locally without build steps:

```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
npx serve .
```

Open `http://localhost:3000` or `http://localhost:8080` in any modern web browser.

## PWA Installation

- **iOS (Safari):** Tap the Share button -> select Add to Home Screen -> tap Add.
- **Android (Chrome):** Tap the three-dot Menu -> select Install app.
- **Desktop (Chrome / Edge):** Click the Install button in the address bar.

## Database Setup

Run the following SQL migration in your Supabase SQL Editor to initialize the schema and security policies:

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

MIT License

Copyright (c) 2026 Tien Dang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
