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

## Key App Features

### Smart Shift Detection & Time Engine
- **Automatic Shift Classification:** Automatically identifies Morning, Noon, or Night shifts based on shift time overlap without manual selection.
- **Precision Hour Calculations:** Deducts unpaid break times and calculates exact billable decimal hours (e.g. `5.33h`).
- **Overnight Shift Handling:** Seamlessly supports shifts crossing past midnight into the next day (e.g. `22:00` to `06:00`).
- **Overtime Multipliers & Extras:** Flexible OT multiplier configuration (`1.0x` to `3.0x`), shift allowances, and deductions.

### Multi-Workplace Management & Independent Rates
- **Multiple Employers & Branches:** Manage multiple workplaces with individual custom color palettes and badges.
- **Isolated Per-Shift Rates:** Editing an hourly rate inside a shift modal applies strictly to that specific shift, keeping the global workplace rate intact.
- **Historical Rate Integrity:** Updating a workplace's default rate freezes all existing historical shifts at their original rates. Only new shifts created forward calculate with the updated rate.
- **Dynamic Workplace Select:** Truncates long workplace names cleanly in selection dropdowns and animates smooth marquee sliding in profile settings.

### Weekly Income Trends & Analytics
- **Authentic Day-by-Day Graph:** Smooth cubic bezier line chart visualizing daily earnings from Monday through Sunday (`T2` - `CN`).
- **Active Day Anchors:** Workdays with active shifts are highlighted with emerald dots and bold accent labels, while days off rest at baseline.
- **Real-Time KPI Dashboard:** Instant metrics for Weekly Gross Income, Total Billable Hours, Average Hours per Shift, and Workplace Breakdown.

### Instant Canvas Payslips
- **High-DPI Client-Side Rendering:** Generates clean, high-resolution payslips on an HTML5 Canvas directly in the browser.
- **One-Click Clipboard Copying:** Copy payslip images directly to the system clipboard for immediate sharing via chat applications (Zalo, Messenger, Telegram).
- **Multi-Format Export:** Export complete records to high-resolution PNG images, CSV spreadsheets, or portable JSON backups.

### Acrylic Liquid Glass Design
- **3D Acrylic Aesthetics:** Translucent layered panels, specular rim highlights, and ambient liquid ribbon background graphics.
- **Adaptive Theme Switching:** Seamless Dark and Light modes synchronized with morphing system icons.
- **Mobile Floating Dock:** Thumb-friendly floating navigation dock equipped with native-feel haptic feedback on mobile devices.
- **Fluid Cross-Platform Scrolling:** Hardware-accelerated smooth scrolling optimized across both mobile touchscreens and desktop mice.

### Offline-First PWA & Cloud Synchronization
- **100% Offline Capability:** Full guest functionality stored locally via Service Worker Cache Storage; zero network connection required.
- **Encrypted Cloud Sync:** Backed by Supabase PostgreSQL protected by Row Level Security (RLS) policies for complete data privacy.
- **Flexible Authentication:** Sign in with Email/Password or one-click Google OAuth PKCE.

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

## Database Setup (Optional for Self-Hosters)

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
