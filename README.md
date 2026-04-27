<div align="center">

# ⚔️ Sword Art Online Web

**A Browser MMORPG Landing, Account & Community Portal**

Official website and community portal for the upcoming browser MMORPG inspired by **Sword Art Online**.
The project combines a cinematic landing page, localized authentication flows, support ticketing, live forum features, news, legal pages, and staff/admin tooling — all built with a lightweight multi-page architecture for strong SEO, fast load times, and tight Firebase integration.

[![Vite](https://img.shields.io/badge/Vite-v6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Playwright](https://img.shields.io/badge/Playwright-Test-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Production](https://img.shields.io/badge/Production-sao--web--76b55.web.app-00C853?style=for-the-badge&logo=firebase&logoColor=white)](https://sao-web-76b55.web.app/)

</div>

---

## ⚡ Особенности (Features)

<table>
<tr>
<td width="50%">

### 🎮 Пользовательская часть и community
- 🏠 **Кинематографичная главная страница** — hero-лендинг, локализованный интерфейс и CTA для будущего запуска игры.
- 🔐 **Аккаунт игрока** — регистрация, логин, сброс пароля, смена email и настройка профиля через Firebase Auth.
- 🎫 **Система поддержки** — отправка тикетов, страница `my-tickets`, чат внутри тикета и staff/admin-инструменты.
- 📰 **Новости и форум** — живые данные из Firestore, категории, треды, ответы и staff-controlled forum visibility/posting mode.
- 🌍 **8 языков интерфейса** — RU, EN, DE, FR, PL, ES, CZ, IT.

</td>
<td width="50%">

### 🚀 Производительность и качество
- **Zero Heavy Frameworks** — без React/Vue/Tailwind на публичном сайте; только HTML + TypeScript + Custom CSS.
- **Multi-Page Vite Architecture** — каждая страница собирается как отдельная entry point с минимальным runtime overhead.
- **Lazy Firebase on Landing** — Firebase/Auth/Waitlist не попадают в критический initial load главной страницы.
- **Mobile-Lite Mode** — на мобильных устройствах отключаются тяжёлые фоновые видео и fullpage snap-scroll для лучшего Lighthouse.
- **Security-First Hosting** — CSP, HSTS, X-Frame-Options, cache headers и rules-enforced Firestore access.

</td>
</tr>
</table>

---

## 🛠 Технологический стек

| Слой | Технология | Зачем |
|:-----|:-----------|:------|
| **Build** | **Vite 6** | Быстрый dev server, удобная MPA-сборка и production bundling. |
| **Language** | **TypeScript 5** | Строгая типизация, безопасный рефакторинг, меньше runtime-ошибок. |
| **UI** | **Vanilla TS + HTML Multi-Page** | SEO-friendly страницы без тяжёлого SPA-runtime. |
| **Styling** | **Custom CSS** + CSS Variables | Собственная визуальная система без лишней зависимости от UI-frameworks. |
| **i18n** | **Custom translation engine** | Централизованные словари и локализация всех ключевых экранов. |
| **Auth** | **Firebase Auth** | Регистрация, вход, reset password, action links и сессии. |
| **Database** | **Cloud Firestore** | Профили, новости, форум, support tickets и realtime subscriptions. |
| **Functions** | **Firebase Cloud Functions** | Fan-out уведомлений и серверная логика для support flows. |
| **Testing** | **Playwright** | Smoke/e2e покрытие ключевых пользовательских и staff flows. |
| **Hosting** | **Firebase Hosting** | Прод CDN, clean URLs, security headers и простой deploy pipeline. |

> 💡 **Фокус на Lighthouse & Core Web Vitals:** главная страница оптимизирована через deferred media, lazy Firebase bootstrap, mobile-lite режим и долгоживущий cache для hashed assets.

---

## 📂 Структура проекта

```text
sao-web/

├── public/                    # статические ассеты (hero media, images, favicon, prepaint scripts)
├── src/
│   ├── lib/                   # shared runtime code (auth, firebase, i18n, support, forum, ui)
│   ├── pages/                 # entry points для каждой HTML-страницы
│   ├── styles/                # base styles, components, page-level CSS
│   ├── translations/          # словари локализации по страницам
│   └── types/                 # общие TypeScript интерфейсы
│
├── functions/                 # Firebase Cloud Functions (support notifications / fan-out)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── tests/                     # Playwright tests
├── scripts/                   # seed / admin utility scripts
├── *.html                     # multi-page templates (index, login, support, forum, etc.)
├── firebase.json              # hosting + firestore + functions config
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── storage.rules              # Firebase Storage rules
├── .firebaserc                # Firebase project alias
├── .env.example               # template for VITE_FIREBASE_* config
├── vite.config.ts             # Vite MPA config + chunk splitting
├── tsconfig.json
└── package.json
```

---

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка окружения
```bash
copy .env.example .env.local
```

Заполни `.env.local` значениями из **Firebase Console → Project Settings → Your apps**:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Разработка (Local Server)
```bash
npm run dev
```

### 4. Проверка и production build
```bash
npm run typecheck
npm run build
npm run preview
```

### 5. Тесты
```bash
npm run test
# или отдельно
npm run test:e2e
```

---

## ☁️ Деплой (Firebase)

Проект уже настроен для деплоя на Firebase Hosting и Firestore.

```bash
# Авторизация в Firebase
npm run firebase:login

# Production deploy
npm run deploy

# Preview channel deploy
npm run deploy:preview

# Локальный hosting emulator
npm run firebase:serve
```

**Текущий production URL:**  
`https://sao-web-76b55.web.app/`

Дополнительно:
- `npm run deploy:rules` — деплой только Firestore rules
- `npm run deploy:indexes` — деплой только Firestore indexes

---

## 📈 Последние оптимизации

- **Landing Bundle Split:** Firebase/Auth/Waitlist вынесены из критического initial load главной страницы.
- **Mobile-Lite Homepage Mode:** на экранах `<= 768px` и при `Save-Data` отключаются фоновые видео и JS snap-scroll.
- **Support System Expansion:** реализованы `my-tickets`, `ticket`, `admin-tickets`, staff triage и internal support flows.
- **Custom Auth Action Page:** `auth-action.html` заменяет стандартный Firebase action handler и локализует reset/verify flows.
- **Forum Control Plane:** staff может управлять `publicVisible` и `postingEnabled` через Firestore settings document.
- **Security Hardening:** добавлены CSP, HSTS, cache headers, X-Frame-Options, Referrer-Policy и Permissions-Policy.

---

<div align="center">

## License

**License not specified** — по умолчанию права не передаются третьим лицам, пока в репозиторий не добавлен явный `LICENSE` файл.

Made for the **Sword Art Online Web** community.

</div>
