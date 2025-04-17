## Cấu trúc dự án

Tuân thủ đúng cấu trúc đã định với các thư mục chính như:

- `app/`: Cấu trúc App Router của Next.js cho routing
- `components/`: Thành phần giao diện
- `hooks/`: Hook tùy chỉnh
- `services/`: Service gọi API
- `stores/`: Quản lý trạng thái
- `utils/`: Hàm tiện ích
- `types/`: Định nghĩa kiểu TypeScript
- `styles/`: CSS và theme
- `lib/`: Thư viện và tiện ích
- `config/`: Cấu hình ứng dụng
- `assets/`: Tài nguyên (hình ảnh, icons)
- `providers/`: Context provider
- `context/`: React Context API

## Quy tắc phát triển

### 1. Cấu trúc API (`/src/app/api`)
- Tổ chức theo RESTful API với các endpoint riêng biệt.
- Sử dụng route handler của Next.js 13+.
- Hỗ trợ các route động (`[id]`) để xử lý tài nguyên cụ thể.

### 2. Providers (`/src/providers`)
- Chứa các Context Provider cho ứng dụng.
- Quản lý state global như auth, theme, toast.
- Redux Provider kết nối Redux với React.

### 3. Config (`/src/config`)
- Tập trung các cấu hình ứng dụng.
- Routes định nghĩa đường dẫn để dễ dàng thay đổi.
- Constants lưu các hằng số toàn cục.

### 4. Context (`/src/context`)
- Định nghĩa các React Context.
- Tách biệt logic state management khỏi UI.

### 5. Styles mở rộng (`/src/styles`)
- Tổ chức CSS theo mục đích sử dụng:
  - `Variables`: chứa các CSS variables.
  - `Animations`: chứa các định nghĩa animation.

### 6. Types mở rộng (`/src/types`)
- Cấu trúc đầy đủ cho tất cả model dữ liệu.
- Định nghĩa interface cho API request/response.
- Type Redux cho các state, action.

### 7. Components (`/src/components`)
- Tách riêng các component có thể tái sử dụng.
- Mỗi component có logic riêng biệt.

### 8. Group Routes (`/src/app/(group)`)
- Nhóm các route có cùng layout.
- Tối ưu hiệu suất và UX nhất quán.

### 9. Test Configs
- Jest cho unit testing.
- Playwright cho end-to-end testing.
- Chạy lệnh `npm test` để thực hiện unit test.
- Đảm bảo đạt ít nhất 80% code coverage.

### 10. Gọi API
- Sử dụng `axiosInstances` đã được cấu hình sẵn để gọi API backend.
- Gọi API route của Next.js bằng `fetch`.
- Với các yêu cầu bảo mật, gọi thông qua API của Next.js bằng các services để tương tác với API backend.
- Với các yêu cầu ít bảo mật, có thể gọi trực tiếp API backend.

### Khi nào nên gọi API ở client và server
- **Client**:
  - Dùng cho các tác vụ tương tác trực tiếp với người dùng (ví dụ: cập nhật dữ liệu theo thời gian thực).
  - Giảm tải cho server và cải thiện hiệu suất nếu không cần bảo mật cao.
  
- **Server**:
  - Dùng cho các tác vụ cần bảo mật, xử lý dữ liệu quan trọng hoặc kết nối với cơ sở dữ liệu.
  - Giảm nguy cơ lộ thông tin nhạy cảm trên client.

### Khi nào nên gọi API từ backend vòng qua API route của Next.js
- Dùng khi cần bảo mật dữ liệu hoặc logic xử lý phức tạp.
- Dùng để che giấu endpoint backend và xử lý xác thực.
- Dùng để đồng bộ dữ liệu hoặc thực hiện các tác vụ cron job.

### 11. Sử dụng Assets
- Lưu trữ hình ảnh tĩnh và icons trong thư mục `assets/`.
- Ưu tiên tối ưu kích thước và định dạng ảnh (WebP, AVIF).
- Sử dụng tên tệp có ý nghĩa, viết thường và phân tách bằng dấu gạch ngang.

### 12. Sử dụng Public
- Các tệp dùng cho SEO hoặc favicon nên đặt trong `public/`.
- Lưu trữ hình ảnh tĩnh dùng chung, không qua xử lý của Webpack.

### 13. Chạy ESLint
- Sử dụng ESLint để kiểm tra và định dạng mã nguồn.
- Chạy lệnh `npm run lint` trước khi commit để đảm bảo mã sạch.

# Cấu Trúc Dự Án

├── src/                                   # Thư mục mã nguồn chính
│   ├── app/                               # Cấu trúc App Router
│   │   ├── (main)/                        # Nhóm route chính
│   │   │   ├── layout.tsx                 # Layout chính
│   │   │   └── page.tsx                   # Trang chủ
│   │   ├── api/                           # Route API
│   │   │   └── route.ts                   # Định nghĩa endpoint API
│   │   ├── (auth)/                        # Route xác thực
│   │   │   ├── layout.tsx                 # Layout xác thực
│   │   │   ├── login/                     # Route đăng nhập
│   │   │   │   └── page.tsx               # Trang đăng nhập
│   │   │   └── register/                  # Route đăng ký
│   │   │       └── page.tsx               # Trang đăng ký
│   │   └── dashboard/                     # Route bảng điều khiển
│   │       ├── layout.tsx                 # Layout dashboard
│   │       ├── page.tsx                   # Trang tổng quan
│   │       ├── transactions/              # Quản lý giao dịch
│   │       │   ├── page.tsx               # Danh sách giao dịch
│   │       │   └── [id]/                  # Chi tiết giao dịch
│   │       │       └── page.tsx           # Trang chi tiết giao dịch
│   │       ├── wallet/                    # Quản lý ví
│   │       │   ├── page.tsx               # Tổng quan ví
│   │       │   └── transfer/              # Chuyển tiền
│   │       │       └── page.tsx           # Trang chuyển tiền
│   │       └── profile/                   # Hồ sơ người dùng
│   │           └── page.tsx               # Trang hồ sơ
│   │
│   ├── assets/                            # Thư mục tài nguyên
│   │   ├── images/                        # Hình ảnh giao diện
│   │   └── icons/                         # Biểu tượng giao diện
│   │
│   ├── components/                        # Thành phần dùng chung
│   │   ├── ui/                            # Thành phần UI (nút, form, modal...)
│   │   ├── layout/                        # Thành phần layout (header, footer...)
│   │   └── pages/                         # Thành phần dành riêng cho từng trang
│   │       ├── home/                      # Thành phần trang chủ
│   │       ├── login/                     # Thành phần trang đăng nhập
│   │       ├── dashboard/                 # Thành phần dashboard
│   │       ├── wallet/                    # Thành phần quản lý ví
│   │       └── transactions/              # Thành phần quản lý giao dịch
│   │
│   ├── hooks/                             # Hook tùy chỉnh
│   │   ├── useAuth.ts                     # Hook xác thực
│   │   ├── useToast.ts                    # Hook thông báo
│   │   ├── useTheme.ts                    # Hook quản lý giao diện
│   │   └── useWallet.ts                   # Hook tương tác ví blockchain
│   │
│   ├── lib/                               # Thư viện và tiện ích
│   │   ├── api.ts                         # Cấu hình client API
│   │   ├── auth.ts                        # Hàm xác thực
│   │   ├── blockchain.ts                  # Tương tác blockchain
│   │   └── validation.ts                  # Xác thực dữ liệu form
│   │
│   ├── middleware.ts                      # Middleware kiểm soát truy cập
│   │
│   ├── services/                          # Các service giao tiếp API
│   │   ├── authService.ts                 # Service xác thực
│   │   ├── userService.ts                 # Service quản lý người dùng
│   │   ├── walletService.ts               # Service quản lý ví
│   │   └── transactionService.ts          # Service giao dịch
│   │
│   ├── stores/                            # Quản lý trạng thái
│   │   └── redux/                         # Cấu hình Redux Toolkit
│   │       ├── store.ts                   # Cấu hình store
│   │       ├── hooks.ts                   # Hook Redux tùy chỉnh
│   │       └── slices/                    # Redux slices
│   │           ├── authSlice.ts           # Trạng thái xác thực
│   │           ├── userSlice.ts           # Trạng thái người dùng
│   │           ├── walletSlice.ts         # Trạng thái ví
│   │           └── transactionSlice.ts    # Trạng thái giao dịch
│   │
│   ├── styles/                            # Định dạng giao diện
│   │   ├── globals.css                    # CSS toàn cục
│   │   └── themes/                        # Các chủ đề
│   │       ├── dark.css                   # Chế độ tối
│   │       └── light.css                  # Chế độ sáng
│   │
│   ├── types/                             # Định nghĩa kiểu TypeScript
│   │   ├── index.ts                       # Export tất cả types
│   │   ├── auth.ts                        # Type xác thực
│   │   ├── user.ts                        # Type người dùng
│   │   ├── wallet.ts                      # Type ví
│   │   └── transaction.ts                 # Type giao dịch
│   │
│   └── utils/                             # Hàm tiện ích
│       ├── format.ts                      # Định dạng dữ liệu (ngày, tiền tệ)
│       ├── crypto.ts                      # Mã hóa, băm
│       └── validation.ts                  # Kiểm tra dữ liệu
│
├── public/                                # File tĩnh
│   ├── favicon.ico                        # Biểu tượng trang
│   ├── robots.txt                         # File robots
│   └── images/                            # Hình ảnh tĩnh
│       ├── logo.png                       # Logo ứng dụng
│       └── background.jpg                 # Hình nền
│
├── .env.local                             # Biến môi trường local
├── .env.development                       # Biến môi trường development
├── .env.production                        # Biến môi trường production
│
├── .gitignore                             # Cấu hình Git Ignore
├── package.json                           # Phụ thuộc và scripts
├── next.config.js                         # Cấu hình Next.js
├── postcss.config.js                      # Cấu hình PostCSS
├── tailwind.config.js                     # Cấu hình TailwindCSS
├── tsconfig.json                          # Cấu hình TypeScript
└── README.md                              # Tài liệu dự án# next15
