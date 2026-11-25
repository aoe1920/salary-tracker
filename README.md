<div align="center">

![Salary Tracker](assets/poster.png)

# Salary Tracker

**Quản lý ca làm thông minh, theo dõi thu nhập & xuất phiếu lương tức thì**

Ứng dụng web tiến bộ (PWA) hoạt động ngoại tuyến (Offline-First) dành cho người đi làm thêm, freelancer và người làm nhiều nơi. Giúp ghi chép ca làm, tính giờ tăng ca (OT) chính xác và xuất phiếu lương chi tiết trong tích tắc.

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

- **Tính giờ & tăng ca (OT) chuẩn xác:** Tự động phân loại ca (Sáng / Chiều / Tối), xử lý ca đêm qua ngày, khấu trừ giờ nghỉ, phụ cấp, giảm trừ và tính hệ số OT từ `1.5x` đến `3x`.
- **Đa nơi làm việc & Chốt mức lương lịch sử:** Phân biệt nơi làm việc theo mã màu riêng biệt; lưu snapshot mức lương tại thời điểm tạo ca, giúp việc điều chỉnh lương tương lai không làm sai lệch thống kê các tuần trước đó.
- **Phiếu lương HD & Xuất dữ liệu đa định dạng:** Kết xuất phiếu lương đồ họa sắc nét bằng HTML5 Canvas (tải ảnh PNG hoặc sao chép nhanh vào clipboard), xuất báo cáo bảng tính CSV (chuẩn UTF-8 BOM hiển thị chuẩn tiếng Việt trên Excel), hỗ trợ sao lưu và phục hồi toàn bộ dữ liệu qua JSON.
- **Offline-First & Đồng bộ Cloud tức thì:** Phản hồi 0ms trên thiết bị với Service Worker và LocalStorage; tự động đồng bộ đám mây qua Supabase PostgreSQL kèm Row Level Security (RLS) bảo mật tuyệt đối và đối soát mốc thời gian để tránh xung đột dữ liệu.

---

## Cài đặt như một ứng dụng (PWA)

- **iOS (Safari):** Bấm biểu tượng **Chia sẻ (Share)** → Chọn **Thêm vào MH chính (Add to Home Screen)** → Bấm **Thêm (Add)**.
- **Android (Chrome):** Bấm biểu tượng **Menu (⋮)** → Chọn **Cài đặt ứng dụng (Install app)**.
- **Máy tính (Chrome / Edge):** Bấm biểu tượng **Cài đặt (Install)** ở thanh địa chỉ trình duyệt.

---

## Công nghệ & Khởi chạy nhanh

Không phụ thuộc vào công cụ build hay bundler — ứng dụng chạy trực tiếp bằng **ES2022 Native Modules**, **CSS3**, **HTML5 Canvas**, **Service Worker** và **Supabase (PostgreSQL + GoTrue Auth + RLS)**.

```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
npx serve .
```

Mở trình duyệt tại `http://localhost:3000`.

---

## Thiết lập Cơ sở dữ liệu (Tự lưu trữ / Self-Host)

Chạy đoạn mã SQL sau trong Supabase SQL Editor để khởi tạo bảng dữ liệu, chính sách bảo mật Row Level Security và các hàm xác thực:

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

## Bản quyền

Phát hành theo giấy phép [MIT License](LICENSE).
