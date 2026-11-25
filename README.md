<div align="center">

![Salary Tracker](assets/poster.png)

# Salary Tracker

**Quản lý ca làm thông minh, theo dõi thu nhập & xuất phiếu lương tức thì**

Ứng dụng PWA hoạt động offline-first dành cho người làm thêm, freelancer và nhân sự làm việc tại nhiều cơ sở. Hỗ trợ ghi chép ca làm việc, tính tiền làm thêm giờ chuẩn xác và xuất phiếu lương trong tích tắc.

[![Live Demo](https://img.shields.io/badge/Demo-aoe1920.github.io%2Fsalary--tracker-3b82f6?style=flat-square&logo=googlechrome&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
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

## Tính năng nổi bật

- **Tính giờ & OT chuẩn xác:** Tự động nhận diện ca sáng, chiều hoặc tối, xử lý trơn tru ca đêm qua ngày, khấu trừ giờ nghỉ, phụ cấp, giảm trừ và tính hệ số tăng ca từ 1.5x đến 3x.
- **Quản lý nhiều nơi làm việc & Lưu snapshot lương:** Mỗi nơi làm việc có mã màu riêng biệt, tự động lưu snapshot mức lương tại thời điểm tạo ca để việc điều chỉnh lương sau này không làm thay đổi số liệu các tuần cũ.
- **Xuất phiếu lương HD & Dữ liệu linh hoạt:** Tạo phiếu lương sắc nét bằng HTML5 Canvas để tải ảnh PNG hoặc copy nhanh vào clipboard. Hỗ trợ xuất file CSV chuẩn UTF-8 xem mượt mà trên Excel, kèm tính năng backup và khôi phục toàn bộ dữ liệu qua JSON.
- **Offline-First & Cloud Sync:** Thao tác mượt mà với độ trễ 0ms nhờ Service Worker và LocalStorage. Tự động đồng bộ hai chiều lên Supabase PostgreSQL qua Row Level Security và kiểm tra timestamp để tránh xung đột dữ liệu.

---

## Cài đặt PWA

- **iOS Safari:** Nhấn nút Share → chọn Add to Home Screen.
- **Android Chrome:** Mở menu ba chấm → chọn Install app.
- **Desktop Chrome / Edge:** Nhấn biểu tượng Install ngay trên thanh địa chỉ.

---

## Tech Stack & Quickstart

Chạy trực tiếp không cần build hay bundler với ES2022 Native Modules, CSS3, HTML5 Canvas, Service Worker và Supabase.

```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
npx serve .
```

Mở trình duyệt tại `http://localhost:3000`.

---

## Cấu hình Database & Self-Host

Chạy đoạn mã sau trong Supabase SQL Editor để khởi tạo bảng dữ liệu, chính sách RLS và các hàm hỗ trợ auth:

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

Dự án phát hành theo giấy phép [MIT License](LICENSE).
