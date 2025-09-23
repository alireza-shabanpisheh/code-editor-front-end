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
│   │   ├── FileExplorer.vue
│   │   ├── TabSystem.vue
│   │   ├── ErrorHandler.vue
│   │   └── LoadingSpinner.vue
│   ├── services/           # سرویس‌های API
│   │   └── api.ts
│   ├── stores/             # Pinia stores
│   │   └── editor.ts
│   ├── views/              # صفحات اصلی
│   │   └── CodeEditorView.vue
│   └── router/             # تنظیمات مسیریابی
├── public/                 # فایل‌های استاتیک
└── dist/                   # فایل‌های ساخته شده
```

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
