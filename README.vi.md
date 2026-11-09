<div align="center">

![Salary Tracker Poster](assets/poster.png)

# Salary Tracker

**Ứng dụng tính lương ca và theo dõi tài chính cá nhân thế hệ mới**  
*The Modern, Precision Shift Scheduling and Wage Tracking PWA*

[![Live Demo](https://img.shields.io/badge/Demo-aoe1920.github.io%2Fsalary--tracker-3b82f6?style=flat-square&logo=googlechrome&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Version](https://img.shields.io/badge/Release-v2.0.0-10b981?style=flat-square)](https://github.com/aoe1920/salary-tracker/releases)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20iOS%20%7C%20Android%20%7C%20Web-6366f1?style=flat-square&logo=pwa&logoColor=white)](https://aoe1920.github.io/salary-tracker/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ESM-f59e0b?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

<p align="center">
  <a href="https://aoe1920.github.io/salary-tracker/"><strong>Trải nghiệm ứng dụng trực tiếp</strong></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <strong>Tiếng Việt</strong>
</p>

</div>

---

## Mục lục

- [Tổng quan sản phẩm](#tổng-quan-sản-phẩm)
- [Tính năng cốt lõi](#tính-năng-cốt-lõi)
- [Kiến trúc kỹ thuật và Công nghệ](#kiến-trúc-kỹ-thuật-và-công-nghệ)
- [Cấu trúc mã nguồn](#cấu-trúc-mã-nguồn)
- [Hướng dẫn cài đặt PWA](#hướng-dẫn-cài-đặt-pwa)
- [Khởi chạy môi trường cục bộ](#khởi-chạy-môi-trường-cục-bộ)
- [Thiết lập Cơ sở dữ liệu Supabase](#thiết-lập-cơ-sở-dữ-liệu-supabase)
- [Mô hình Bảo mật và Quyền riêng tư](#mô-hình-bảo-mật-và-quyền-riêng-tư)
- [Giấy phép](#giấy-phép)

---

## Tổng quan sản phẩm

Salary Tracker là giải pháp phần mềm chuyên dụng được thiết kế nhằm tự động hóa quy trình quản lý thời gian làm việc và tính toán thu nhập cho người lao động theo ca. Ứng dụng giải quyết triệt để các hạn chế của phương pháp ghi chép thủ công và bảng tính truyền thống:

- **Loại bỏ sai số tính toán:** Tự động trừ giờ nghỉ, xử lý chính xác các ca làm việc kéo dài qua đêm qua mốc 00:00 và áp dụng hệ số tăng ca (OT).
- **Hỗ trợ làm việc đa cơ sở:** Cho phép thiết lập mức đơn giá theo giờ riêng biệt cho từng nơi làm việc mà không bị nhầm lẫn.
- **Hoạt động liên tục (Offline-First):** Vận hành độc lập ngay cả khi thiết bị mất kết nối mạng, tự động đồng bộ hai chiều với cơ sở dữ liệu đám mây khi có kết nối trở lại.
- **Chia sẻ dữ liệu tức thì:** Tự động kết xuất phiếu chấm công chuẩn định dạng hình ảnh độ nét cao để gửi trực tiếp cho người quản lý.

---

## Tính năng cốt lõi

### 1. Động cơ nhận diện ca làm thông minh (Smart Shift Engine)
- Tự động phân loại ca làm thành Ca Sáng, Ca Chiều hoặc Ca Tối dựa trên thuật toán tính tỷ lệ giao thoa thời gian thực tế, loại bỏ thao tác chọn ca thủ công.
- Tự động gợi ý khung giờ vào và giờ ra làm tròn đến mốc giờ chẵn (:00) dựa trên lịch sử làm việc gần nhất.
- Tự động sắp xếp danh sách các thẻ ca theo đúng trình tự thời gian (Thứ 2 đến Chủ Nhật, ưu tiên giờ bắt đầu sớm hơn).

### 2. Động cơ tính lương chuẩn xác (Precision Wage Engine)
- Tính toán thu nhập theo đơn vị tiền tệ chuẩn `đ` và đơn giá theo giờ `đ/h`.
- Xử lý chính xác các ca làm việc kéo dài qua đêm (ví dụ: bắt đầu lúc 22:00 hôm trước và kết thúc lúc 04:00 sáng hôm sau).
- Hỗ trợ các mức hệ số tăng ca linh hoạt (1x, 1.5x, 2x, 3x) với giao diện hiển thị gọn gàng, loại bỏ phần thập phân khi hệ số là số nguyên.
- Hỗ trợ cộng tiền phụ cấp, tiền thưởng và trừ các khoản khấu trừ trực tiếp cho từng ca làm việc.

### 3. Quản lý đa cơ sở làm việc (Multi-Workplace System)
- Quản lý không giới hạn số lượng cơ sở làm việc với đơn giá theo giờ độc lập.
- Hệ thống định danh màu sắc trực quan cho từng cơ sở, đồng bộ xuyên suốt từ danh sách ca làm đến biểu đồ thống kê.
- Cho phép chỉnh sửa thông tin, đổi đơn vị làm việc mặc định và xóa nơi làm việc với cơ chế đồng bộ tự động trên toàn bộ lịch sử dữ liệu.

### 4. Biểu đồ thống kê và Báo cáo tài chính (Interactive Analytics)
- Bảng chỉ số tổng hợp thời gian thực: Tổng thu nhập, tổng số ca làm việc, tổng số giờ làm và giá trị trung bình trên từng ca.
- Biểu đồ tiến trình thu nhập theo tuần với cơ chế thanh cuộn ngang mượt mà, hỗ trợ làm tròn nhãn tuần khi lượng dữ liệu lớn và tự động cuộn đến tuần mới nhất.
- Biểu đồ phân bổ tỷ trọng thu nhập đóng góp từ từng cơ sở làm việc theo tỷ lệ phần trăm.

### 5. Kết xuất Phiếu Chấm Công và Chia sẻ (Canvas Payslip)
- Động cơ vẽ đồ họa HTML5 Canvas tạo phiếu chấm công với độ sắc nét cao (HiDPI / Retina).
- Tính năng sao chép hình ảnh trực tiếp vào bộ nhớ tạm (Clipboard), cho phép dán ngay vào các ứng dụng liên lạc như Zalo, Messenger, Telegram.
- Hỗ trợ tải phiếu lương định dạng ảnh PNG chất lượng cao về thiết bị.
- Hỗ trợ xuất dữ liệu ra tệp định dạng CSV và sao lưu JSON toàn diện.

### 6. Đồng bộ đám mây và Bảo mật dữ liệu (Cloud Sync and RLS)
- Đăng nhập linh hoạt bằng Tên người dùng (Username) hoặc địa chỉ Email.
- Tích hợp xác thực Google OAuth 2.0 PKCE một chạm và hỗ trợ liên kết tài khoản Google trực tiếp trong phần cài đặt hồ sơ.
- Cơ chế khôi phục mật khẩu tự phục vụ qua email an toàn.
- Cơ chế phân quyền cấp hàng (Row Level Security - RLS) trên PostgreSQL: người dùng chỉ có quyền đọc và ghi dữ liệu của chính mình.

### 7. Trải nghiệm PWA và Giao diện Liquid Glass Mossy
- Hoạt động độc lập và mượt mà trên nền tảng di động và máy tính thông qua Service Worker Cache API.
- Thanh điều hướng nổi phong cách Liquid Glass Mossy với hiệu ứng tán xạ ánh sáng và độ mờ quang học tự nhiên.
- Tích hợp phản hồi xúc giác rung (Haptic Feedback) trên các thiết bị di động hỗ trợ.
- Tối ưu hóa biểu tượng PWA 3D hiển thị cân đối chính giữa trên cả Android WebAPK và iOS SpringBoard.
- Hỗ trợ chuyển đổi chế độ Sáng / Tối (Light / Dark mode) đồng bộ với tùy biến hệ thống.

---

## Kiến trúc kỹ thuật và Công nghệ

### Bảng công nghệ sử dụng

| Tầng kiến trúc | Công nghệ | Mục đích và Vai trò |
| :--- | :--- | :--- |
| Core Frontend | Vanilla JavaScript (ES2022 Modules) | Kiến trúc module thuần không phụ thuộc công cụ đóng gói (Zero-bundler) |
| Giao diện người dùng | Modern CSS3 (Variables, Grid, Flexbox) | Thiết kế hệ thống Design Tokens, Glassmorphism và Responsive Layout |
| Backend và Cơ sở dữ liệu | Supabase Cloud (PostgreSQL 15) | Lưu trữ đám mây, xác thực GoTrue Auth và bảo mật Row Level Security |
| Ngoại tuyến và Ứng dụng | Service Worker API, Cache Storage | Hỗ trợ cài đặt PWA độc lập và khả năng vận hành ngoại tuyến hoàn toàn |
| Đồ họa và Kết xuất | HTML5 Canvas API | Tạo phiếu chấm công độ phân giải cao và kết xuất đồ họa không qua thư viện ngoài |
| Biểu tượng và Đồ họa | SVG thuần và Bộ nhân vật Alohe | Biểu tượng vector sắc nét, tối ưu dung lượng và kích thước tải trang |

---

## Cấu trúc mã nguồn

```text
salary-tracker/
├── assets/
│   ├── avatars/             Thư viện hình ảnh đại diện vector
│   ├── icons/               Bộ biểu tượng ứng dụng PWA và Favicon
│   └── poster.png           Hình ảnh giới thiệu chính thức của sản phẩm
├── css/
│   ├── base.css             Biến hệ thống, thiết lập giao diện và kiểu chữ
│   ├── components.css       Thành phần giao diện: nút bấm, dockbar, thẻ ca
│   └── modals.css           Hộp thoại tương tác, bảng biểu và thông báo
├── js/
│   ├── services/
│   │   └── supabase.js      Kết nối máy chủ, xác thực và đồng bộ dữ liệu
│   ├── ui/
│   │   ├── avatars.js       Điều phối lựa chọn ảnh đại diện
│   │   ├── canvas-slip.js   Động cơ kết xuất phiếu chấm công bằng Canvas
│   │   ├── chart.js         Biểu đồ phân tích tài chính và thời gian
│   │   ├── dialog.js        Hộp thoại xác nhận và cảnh báo
│   │   ├── export.js        Xuất tệp dữ liệu CSV và JSON
│   │   ├── haptic.js        Phản hồi rung xúc giác trên thiết bị di động
│   │   ├── modals.js        Điều khiển các hộp thoại nghiệp vụ
│   │   ├── select.js        Thành phần tùy chọn tùy biến
│   │   └── toast.js         Hệ thống thông báo trạng thái
│   ├── app.js               Điểm nhập chính và khởi tạo ứng dụng
│   ├── calculator.js        Thuật toán tính lương, phân loại ca và sắp xếp
│   ├── config.js            Hằng số cấu hình hệ thống
│   ├── i18n.js              Bản địa hóa ngôn ngữ và định dạng tiền tệ
│   ├── state.js             Quản lý trạng thái tập trung
│   └── theme.js             Quản lý chủ đề giao diện Sáng và Tối
├── index.html               Khung giao diện HTML5 chuẩn ngữ nghĩa
├── manifest.json            Cấu hình Web App Manifest chuẩn PWA
└── sw.js                    Service Worker điều phối bộ nhớ đệm ngoại tuyến
```

---

## Hướng dẫn cài đặt PWA

Salary Tracker là ứng dụng Progressive Web App (PWA), có thể cài đặt và sử dụng độc lập trên mọi thiết bị mà không cần thông qua kho ứng dụng:

### Trên iPhone hoặc iPad (iOS Safari)
1. Mở liên kết `https://aoe1920.github.io/salary-tracker/` trên trình duyệt **Safari**.
2. Nhấn vào biểu tượng **Chia sẻ (Share)** hình vuông có mũi tên hướng lên ở thanh công cụ phía dưới.
3. Cuộn danh sách tác vụ và chọn **Thêm vào MH chính (Add to Home Screen)**.
4. Nhấn **Thêm (Add)** ở góc trên bên phải để hoàn tất cài đặt.

### Trên điện thoại Android (Google Chrome)
1. Mở liên kết trên bằng trình duyệt **Chrome**.
2. Nhấn vào biểu tượng **Menu ba chấm** ở góc trên bên phải màn hình.
3. Chọn **Cài đặt ứng dụng (Install app)** hoặc **Thêm vào màn hình chính**.
4. Xác nhận cài đặt để hệ thống tự động tạo biểu tượng ứng dụng trên màn hình.

### Trên máy tính (Google Chrome hoặc Microsoft Edge)
1. Truy cập địa chỉ ứng dụng trên trình duyệt máy tính.
2. Nhấn vào biểu tượng **Cài đặt ứng dụng (Install)** trên thanh địa chỉ.
3. Xác nhận để ứng dụng mở trong một cửa sổ độc lập tương tự phần mềm máy tính chuyên dụng.

---

## Khởi chạy môi trường cục bộ

Do ứng dụng được xây dựng theo kiến trúc JavaScript ES Modules thuần, dự án không yêu cầu cài đặt trình biên dịch hay thực hiện quy trình đóng gói mã nguồn.

1. Tải kho mã nguồn về máy tính:
```bash
git clone https://github.com/aoe1920/salary-tracker.git
cd salary-tracker
```

2. Khởi chạy máy chủ HTTP tĩnh:

Sử dụng Node.js:
```bash
npx serve .
```

Hoặc sử dụng Python 3 có sẵn trên hệ điều hành:
```bash
python -m http.server 8080
```

3. Mở trình duyệt và truy cập vào địa chỉ:
```text
http://localhost:8080
```

---

## Thiết lập Cơ sở dữ liệu Supabase

Để triển khai máy chủ lưu trữ riêng bằng Supabase, hãy thực thi đoạn mã SQL sau trong bảng điều khiển SQL Editor của Supabase:

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

## Mô hình Bảo mật và Quyền riêng tư

- **Cách ly dữ liệu cấp hàng:** Cơ chế Row Level Security (RLS) của PostgreSQL đảm bảo mỗi người dùng chỉ có thể truy vấn và thao tác trên bản ghi có mã định danh `user_id` trùng khớp với phiên xác thực `auth.uid()`.
- **Mã hóa truyền tải:** Toàn bộ quá trình trao đổi dữ liệu với máy chủ đám mây Supabase được mã hóa qua kênh truyền HTTPS và TLS 1.3.
- **Xác thực bảo mật:** Sử dụng giao thức OAuth 2.0 với Proof Key for Code Exchange (PKCE) cho xác thực Google và mã hóa mật khẩu an toàn qua GoTrue.
- **Dự phòng dữ liệu ngoại tuyến:** Dữ liệu lưu trữ cục bộ tại trình duyệt được bảo vệ bởi ranh giới nguồn gốc (Same-Origin Policy), không chia sẻ với bất kỳ bên thứ ba nào.

---

## Giấy phép

Dự án được phân phối dưới giấy phép [MIT](LICENSE). Mọi đóng góp, báo cáo lỗi và yêu cầu tính năng đều được tiếp nhận thông qua [GitHub Issues](https://github.com/aoe1920/salary-tracker/issues) và [Pull Requests](https://github.com/aoe1920/salary-tracker/pulls).

<div align="center">
  <sub>Phát triển bởi <a href="https://github.com/aoe1920">aoe1920</a></sub>
</div>
