<div align="center">

![Salary Tracker](assets/poster.png)

# Salary Tracker

**Precision Shift Scheduling, Real-Time Wage Analytics & Instant Payslips**

A modern, offline-first Progressive Web App designed for shift workers, freelancers, and multi-workplace professionals to track hours accurately, automate wage calculations, and generate client-side payslips.

[![Live Demo](https://img.shields.io/badge/Demo-aoe1920.github.io%2Fsalary--tracker-3b82f6?style=flat-square&logo=googlechrome&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Version](https://img.shields.io/badge/Release-v1.29-10b981?style=flat-square)](https://github.com/aoe1920/salary-tracker/releases)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20iOS%20%7C%20Android%20%7C%20Desktop-6366f1?style=flat-square&logo=pwa&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ESM-f59e0b?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

<br/>

<a href="https://aoe1920.github.io/salary-tracker/">
  <img src="https://img.shields.io/badge/%E2%96%B6_Launch_App-aoe1920.github.io%2Fsalary--tracker-2563eb?style=for-the-badge" alt="Launch Web App">
</a>

</div>

---

## Overview

**Salary Tracker** replaces messy notebooks and complex spreadsheets with a streamlined, elegant, and private workspace. Built with an offline-first architecture, it empowers part-time employees, freelancers, and multi-job shift workers to manage unpredictable work hours, calculate accurate gross salaries, and generate professional payslips with a single tap.

---

## PWA Installation

Salary Tracker can be installed on your device as a standalone native-like app:

- **iOS (Safari):** Tap the **Share** button in Safari -> select **Add to Home Screen** -> tap **Add**.
- **Android (Chrome):** Tap the **three-dot menu** -> select **Install app** or **Add to Home screen**.
- **Desktop (Chrome / Edge / Brave):** Click the **Install** button located on the right side of the address bar.

---

## Tech Stack & Architecture

- **Frontend:** Vanilla JavaScript (ES2022 Modules), Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Backdrop Filters).
- **Zero Build Tools:** No Webpack, Vite, or Babel required; native ES module imports run directly in modern browsers.
- **Backend & Cloud:** Supabase (PostgreSQL 15, GoTrue Auth, Row Level Security).
- **Storage & Offline:** Service Worker API, Cache Storage, Web App Manifest, LocalStorage.
- **Graphics & Rendering:** HTML5 Canvas API, Inline Vector SVG, CSS3 Liquid Glass shaders.

---

## Quickstart

Run Salary Tracker locally without any build steps or package installations:

```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
npx serve .
```

Open `http://localhost:3000` or `http://localhost:8080` in your web browser.

---

## Database Setup

If connecting your own Supabase instance, execute the following SQL migration in your Supabase SQL Editor:

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

---

## License

This project is licensed under the [MIT License](LICENSE).
