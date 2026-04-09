# Pomodoro App

A productivity application based on the Pomodoro Technique. Manage tasks, track time, and view reports.

## Tech Stack

- **React 18** + **TypeScript** — UI framework with type safety
- **Vite** — fast build tool with HMR
- **React Router v6** — SPA routing
- **Firebase v11** (modular SDK) — Authentication + Realtime Database
- **Recharts** — data visualization for reports
- **CSS Modules** — scoped component styles
- **Vitest** + **React Testing Library** — testing

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Features

- **Task Management** — Create, edit, delete tasks with categories and priorities
- **Pomodoro Timer** — Configurable work/break cycles with visual countdown
- **Daily/Global Lists** — Organize tasks by day or keep them in a global backlog
- **Reports** — Day/week/month analytics with stacked bar charts
- **Authentication** — Email/password login via Firebase Auth
- **Settings** — Customize pomodoro durations and iteration counts
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Accessible** — ARIA attributes, keyboard navigation, screen reader support

## Project Structure

```
src/
├── components/     # Shared UI (Header, Modal, Notification, Layout)
├── context/        # React Contexts (Auth, Settings, Notification)
├── hooks/          # Custom hooks (useTasks)
├── pages/          # Page components (TaskList, Timer, Settings, Reports, Auth)
├── services/       # Firebase API layer
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
├── styles/         # Global styles and CSS variables
└── test/           # Test setup
```
