<div align="center">

![Salary Tracker Poster](assets/poster.png)

# Salary Tracker

**The Modern, Precision Shift Scheduling and Wage Tracking Progressive Web App**

[![Live Demo](https://img.shields.io/badge/Demo-aoe1920.github.io%2Fsalary--tracker-3b82f6?style=flat-square&logo=googlechrome&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Version](https://img.shields.io/badge/Release-v2.0.0-10b981?style=flat-square)](https://github.com/aoe1920/salary-tracker/releases)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20iOS%20%7C%20Android%20%7C%20Web-6366f1?style=flat-square&logo=pwa&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ESM-f59e0b?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

<p align="center">
  <a href="https://aoe1920.github.io/salary-tracker/"><strong>Launch Live Application</strong></a>
</p>

<p align="center">
  <strong>English</strong> | <a href="README.vi.md">Tiếng Việt</a>
</p>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture and Technology Stack](#architecture-and-technology-stack)
- [Project Directory Structure](#project-directory-structure)
- [Progressive Web App (PWA) Installation](#progressive-web-app-pwa-installation)
- [Local Development Setup](#local-development-setup)
- [Supabase Database Setup](#supabase-database-setup)
- [Security and Privacy Architecture](#security-and-privacy-architecture)
- [Contributing and License](#contributing-and-license)

---

## Overview

Salary Tracker is a high-precision, privacy-first Progressive Web App (PWA) engineered for shift workers, part-time employees, freelancers, and multi-workplace professionals.

Manual timesheets, paper logs, and complex spreadsheets are error-prone and tedious. Salary Tracker automates wage calculation, handles overnight shifts seamlessly, manages independent hourly rates across multiple employers, provides actionable financial analytics, and renders high-resolution exportable payslips with one-touch sharing, all while functioning completely offline.

### Design Principles

- **Zero-Friction Time Tracking:** Time-overlap heuristics automatically detect whether a shift is Morning, Afternoon, or Evening without manual tagging.
- **Mathematical Precision:** Accurate net-duration deduction for break periods, multi-tier overtime multipliers, allowance additions, and tax or deduction handling.
- **Offline-First Resilience:** Instant local persistence via the Cache Storage API and localStorage, with bidirectional cloud synchronization upon reconnecting.
- **Zero-Dependency Core:** Built purely with modern Vanilla ECMAScript modules (ES2022) without requiring build runners, bundlers, or external framework runtimes.

---

## Key Features

### 1. Smart Shift Detection Engine
- Automatically classifies shifts into Morning, Noon, or Evening based on real-time overlap proportions with standard operational windows.
- Suggests start and end times rounded to whole hours (:00) derived from recent shift patterns.
- Automatically sorts shift cards chronologically (Monday through Sunday, prioritized by earliest start time).

### 2. Precision Wage Engine
- Computes gross and net earnings formatted to standard currency standards.
- Handles overnight shifts extending past midnight (00:00) with accurate date-boundary crossing calculations.
- Configurable overtime multipliers (1x, 1.5x, 2x, 3x) with integer-clean UI presentation.
- Supports shift-specific allowances, bonus additions, and itemized deductions.

### 3. Multi-Workplace Management
- Configure unlimited distinct work locations, each with its own independent hourly wage rate.
- Automated color-coding per workplace for immediate visual discrimination across lists, schedule views, and analytics.
- Default workplace assignments with cascaded history updates when renaming or updating workplace details.

### 4. Interactive Financial Analytics
- Real-time KPI summaries: total earnings, shift counts, total active hours, and averages.
- Multi-week income trajectory charts with smooth momentum-scrolling, dynamic label scaling, and auto-scroll positioning to the current week.
- Distribution breakdowns displaying earnings proportion per workplace.

### 5. High-Resolution Canvas Payslip Generator
- Client-side rendering of cryptographic-style shift slips and payroll statements using HTML5 Canvas.
- **One-Touch Clipboard Copy:** Directly copy rendered payslip images to the clipboard for instant pasting into messaging applications (Zalo, Messenger, Telegram, WhatsApp, Slack).
- **Lossless PNG Export:** Download standalone high-resolution images for archival.
- **Data Portability:** Full data export to CSV spreadsheets and structured JSON backups.

### 6. Cloud Synchronization and Row Level Security
- Flexible authentication via Username or Email address.
- Google OAuth 2.0 PKCE authentication flow with in-profile Google account linking.
- Self-service secure password recovery workflow.
- PostgreSQL Row Level Security (RLS) guaranteeing strict multi-tenant tenant isolation (`auth.uid() = user_id`).

### 7. Modern Liquid Glass Mossy Interface
- High-performance glassmorphism floating dock navigation inspired by modern iOS aesthetics.
- Integrated haptic feedback vibration patterns across interactive elements on supported mobile devices.
- Centered 3D squircle adaptive app icons compliant with Android WebAPK and iOS SpringBoard guidelines.
- Native Light and Dark theme synchronization responsive to system preferences.

---

## Architecture and Technology Stack

### Component Breakdown

| Layer | Technology | Purpose and Architecture Rationale |
| :--- | :--- | :--- |
| Core Application | Vanilla JavaScript (ES2022 ESM) | Native modular browser standards with zero compilation overhead |
| Design and Layout | Modern CSS3 (Variables, Grid, Flexbox) | Custom design tokens, glassmorphism, fluid typography, responsive layout |
| Cloud Database | Supabase Cloud (PostgreSQL 15) | Relational persistence with GoTrue Auth and Row Level Security |
| Offline and Caching | Service Worker API, Cache Storage | Full offline capability, asset caching, and standalone PWA lifecycle |
| Graphic Rendering | HTML5 Canvas API | High-DPI rasterization for payslip image generation |
| Vector Assets | Clean SVG and Alohe Avatars | Resolution-independent iconography optimized for minimal bundle payload |

---

## Project Directory Structure

```text
salary-tracker/
├── assets/
│   ├── avatars/             Vector avatar collection
│   ├── icons/               PWA icons, maskables, and favicons
│   └── poster.png           Official product release poster
├── css/
│   ├── base.css             Design tokens, typography, and theme variables
│   ├── components.css       Buttons, metric cards, dockbar, and week wheel
│   └── modals.css           Dialog sheets, modal overlays, and toast views
├── js/
│   ├── services/
│   │   └── supabase.js      Supabase client, authentication, and cloud sync
│   ├── ui/
│   │   ├── avatars.js       Avatar selection and rendering logic
│   │   ├── canvas-slip.js   HTML5 Canvas payslip generator
│   │   ├── chart.js         Financial analytics charts and graphs
│   │   ├── dialog.js        Confirmation modals and alert dialogs
│   │   ├── export.js        CSV and JSON data export handlers
│   │   ├── haptic.js        Mobile haptic vibration engine
│   │   ├── modals.js        Shift editing and settings modal workflows
│   │   ├── select.js        Custom accessible dropdown components
│   │   └── toast.js         Adaptive toast notification system
│   ├── app.js               Application entry point and lifecycle coordinator
│   ├── calculator.js        Wage arithmetic, shift sorting, and heuristics
│   ├── config.js            System constants and default color palettes
│   ├── i18n.js              Internationalization and currency formatters
│   ├── state.js             Centralized reactive state store
│   └── theme.js             Theme controller for Light and Dark modes
├── index.html               Semantic HTML5 application skeleton
├── manifest.json            Web App Manifest configuration
└── sw.js                    Service Worker for offline network caching
```

---

## Progressive Web App (PWA) Installation

Salary Tracker is distributed as an installable Progressive Web App. It operates natively on iOS, Android, macOS, Windows, and Linux without requiring distribution through third-party app stores:

### On iPhone and iPad (iOS Safari)
1. Open `https://aoe1920.github.io/salary-tracker/` in **Safari**.
2. Tap the **Share** button (the square icon with an upward arrow) in the bottom navigation bar.
3. Scroll down the action sheet and select **Add to Home Screen**.
4. Tap **Add** in the upper-right corner to complete installation.

### On Android (Google Chrome)
1. Navigate to the application URL in **Chrome**.
2. Tap the **three-dot menu** in the top-right corner.
3. Select **Install app** or **Add to Home screen**.
4. Confirm the installation prompt to integrate the app into your device app launcher.

### On Desktop (Google Chrome or Microsoft Edge)
1. Open the application URL in your desktop browser.
2. Click the **Install** icon located on the right side of the address bar.
3. Confirm to launch Salary Tracker in an isolated, dedicated desktop window.

---

## Local Development Setup

Because the application is constructed entirely with native ES Modules, no build toolchains or compilation steps are needed.

1. Clone the repository:
```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
```

2. Start a local static HTTP server:

Using Node.js:
```bash
npx serve .
```

Or using Python 3:
```bash
python -m http.server 8080
```

3. Open your browser and navigate to:
```text
http://localhost:8080
```

---

## Supabase Database Setup

To deploy a self-hosted or dedicated Supabase backend instance, execute the following SQL script in the Supabase **SQL Editor**:

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

## Security and Privacy Architecture

- **Row Level Security (RLS):** Database queries are isolated at the database engine level. Authenticated users can only read, write, or mutate rows matching their cryptographic session ID (`auth.uid()`).
- **Encrypted Transport:** All communication between clients and cloud endpoints is encrypted using HTTPS and TLS 1.3.
- **Hardened Authentication:** OAuth 2.0 PKCE flow prevents authorization code interception on public clients. Passwords are hash-encrypted using Bcrypt via GoTrue.
- **Offline Storage Isolation:** Local browser storage complies with the Same-Origin Policy and remains sandboxed within the host device.

---

## Contributing and License

Contributions, bug reports, and feature proposals are welcome via [GitHub Issues](https://github.com/aoe1920/salary-tracker/issues) and [Pull Requests](https://github.com/aoe1920/salary-tracker/pulls).

This project is licensed under the [MIT License](LICENSE).

<div align="center">
  <sub>Maintained by <a href="https://github.com/aoe1920">aoe1920</a></sub>
</div>
