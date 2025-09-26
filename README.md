# Code Editor - Frontend

یک Code Editor شبیه VS Code با Vue.js که قابلیت ایجاد، ویرایش و مدیریت فایل‌های HTML، CSS و JavaScript را دارد.

## ویژگی‌ها

- 🗂 مدیریت فایل‌ها و فولدرها
- 📝 ویرایشگر کد با syntax highlighting
- 🗂 File Explorer با ساختار درختی
- 📑 سیستم Tab برای فایل‌های باز
- 💾 ذخیره فایل‌ها
- 🔄 ارتباط با Backend API
- ⚡ Hot reload در حالت توسعه

## تکنولوژی‌های استفاده شده

- **Vue 3** - Framework اصلی
- **TypeScript** - Type Safety
- **Pinia** - State Management
- **Vue Router** - مدیریت مسیرها
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Axios** - HTTP Client

## پیش‌نیازها

- Node.js (نسخه 20 یا بالاتر)
- npm یا yarn

## نصب و راه‌اندازی

### 1. نصب dependencies

```sh
npm install
```

### 2. اجرا در حالت توسعه

```sh
npm run dev
```

### 3. ساخت برای پروداکشن

```sh
npm run build
```

## ساختار پروژه

```
front-end/
├── src/
│   ├── components/         # کامپوننت‌های Vue
│   │   ├── CodeEditor.vue
│   │   ├── CodeEditorLayout.vue
│   │   ├── FileExplorer.vue
│   │   ├── FileTreeNode.vue
│   │   ├── TabSystem.vue
│   │   ├── TabItem.vue
│   │   ├── InputModal.vue
│   │   ├── ErrorHandler.vue
│   │   └── LoadingSpinner.vue
│   ├── composables/        # منطق قابل استفاده مجدد
│   │   ├── useCodeEditor.ts
│   │   ├── useFileIcons.ts
│   │   ├── useFileValidation.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useModal.ts
│   │   └── index.ts
│   ├── services/           # سرویس‌های API
│   │   └── api.ts
│   ├── stores/             # Pinia stores
│   │   └── editor.ts
│   ├── views/              # صفحات اصلی
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   └── CodeEditorView.vue
│   └── router/             # تنظیمات مسیریابی
│       └── index.ts
├── public/                 # فایل‌های استاتیک
└── dist/                   # فایل‌های ساخته شده
```

## معماری کد

### Composables

پروژه از معماری composition API استفاده می‌کند و منطق اصلی در composables جداگانه قرار دارد:

- **useCodeEditor**: مدیریت ویرایشگر کد، syntax highlighting، و formatting
- **useFileIcons**: مدیریت آیکون‌های فایل‌ها
- **useFileValidation**: اعتبارسنجی نام فایل‌ها و پوشه‌ها
- **useKeyboardShortcuts**: مدیریت میانبرهای صفحه‌کلید
- **useModal**: مدیریت modal ها و ورودی‌ها

### کامپوننت‌ها

کامپوننت‌ها تمیز و قابل خواندن هستند و فقط UI را مدیریت می‌کنند:

- منطق پیچیده به composables منتقل شده
- کد تکراری کاهش یافته
- خوانایی بهبود یافته

## Backend

این پروژه نیاز به یک Backend API دارد که در پوشه `../backend` قرار دارد.

### راه‌اندازی Backend

```sh
cd ../backend
npm install
npm run dev
```

Backend روی پورت 3001 اجرا می‌شود.

## استفاده

1. Backend را روی پورت 3001 راه‌اندازی کنید
2. Frontend را روی پورت مورد نظر اجرا کنید
3. وارد صفحه Code Editor شوید
4. شروع به ایجاد و ویرایش فایل‌ها کنید

## دستورات مفید

```sh
# اجرا در حالت توسعه
npm run dev

# بررسی نوع‌ها
npm run type-check

# ساخت پروژه
npm run build

# فرمت کردن کد
npm run format
```

## IDE پیشنهادی

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## تنظیمات Vite

برای اطلاعات بیشتر در مورد تنظیمات، [مستندات Vite](https://vite.dev/config/) را مطالعه کنید.
