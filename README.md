# Dovuto — Monorepo

> **Ciò che è dovuto, non si dimentica.**

SaaS cross-platform per la gestione di scadenze fiscali e personali italiane.

---

## Piattaforme

| App | Stack | Status |
|-----|-------|--------|
| **Web** | React + Vite + Tailwind | ✅ Pronto |
| **iOS** | Expo + React Native + NativeWind | 🚧 In sviluppo |
| **Android** | Expo + React Native + NativeWind | 🚧 In sviluppo |
| **Desktop** | Tauri v2 + Web | 🚧 In sviluppo |

---

## Struttura

```
dovuto-monorepo/
├── apps/
│   ├── web/          # React + Vite (già deployato)
│   ├── mobile/       # Expo Router + NativeWind
│   └── desktop/      # Tauri v2 wrapper
├── packages/
│   ├── data/         # Tipi, mock data, utility condivise
│   └── hooks/        # React hooks condivisi
├── .github/
│   └── workflows/    # CI/CD (web→Vercel, mobile→EAS, desktop→GitHub Releases)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Setup rapido

### Prerequisiti
- Node.js 20+
- pnpm 9+
- Rust (per desktop): https://rustup.rs
- Expo CLI: `npm i -g expo-cli eas-cli`

### Installazione

```bash
git clone https://github.com/lucaiolienrico/dovuto.git
cd dovuto
pnpm install
```

### Sviluppo

```bash
# Web (http://localhost:5173)
pnpm web

# Mobile (Expo Go o simulatore)
pnpm mobile

# Desktop (finestra nativa)
pnpm desktop
```

---

## Web

```bash
cd apps/web
pnpm dev          # sviluppo
pnpm build        # build produzione → dist/
```

Deploy: **Vercel** — automatico su ogni push a `main` via GitHub Actions.

---

## Mobile (iOS + Android)

```bash
cd apps/mobile
pnpm start                    # Expo Go (dev)
pnpm ios                      # Simulatore iOS (richiede Xcode)
pnpm android                  # Emulatore Android (richiede Android Studio)
pnpm build:preview            # EAS Build preview (entrambe le piattaforme)
pnpm build:production         # EAS Build production
```

### EAS Build (prima volta)

```bash
eas login
eas build:configure
eas build --profile preview --platform all
```

### Secrets necessari su EAS / GitHub
- `EXPO_TOKEN` — ottenibile da expo.dev/accounts/settings/access-tokens
- Certificati iOS (gestiti automaticamente da EAS)
- Keystore Android (generato automaticamente da EAS)

---

## Desktop (Tauri)

### Prerequisiti Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Linux aggiuntivi:
sudo apt-get install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

```bash
cd apps/desktop
pnpm dev          # dev con hot-reload (avvia anche web in background)
pnpm build        # build installer nativo
```

**Output:**
- macOS: `apps/desktop/src-tauri/target/release/bundle/dmg/*.dmg`
- Windows: `apps/desktop/src-tauri/target/release/bundle/nsis/*.exe`
- Linux: `apps/desktop/src-tauri/target/release/bundle/appimage/*.AppImage`

### Release desktop
```bash
git tag v0.1.0
git push origin v0.1.0
# GitHub Actions costruisce automaticamente per tutti i sistemi operativi
```

---

## CI/CD

| Trigger | Action |
|---------|--------|
| Push `main` (apps/web o packages/) | Deploy → Vercel |
| Push `main` (apps/mobile o packages/) | EAS Build preview (iOS + Android) |
| Push tag `v*` | Tauri release (macOS .dmg, Windows .exe, Linux .AppImage) |

### Secrets GitHub richiesti

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
EXPO_TOKEN
TAURI_SIGNING_PRIVATE_KEY
TAURI_SIGNING_PRIVATE_KEY_PASSWORD
```

---

## Design System

```ts
// Palette condivisa tra tutte le piattaforme
colors = {
  primary:  '#4f46e5',   // indigo-600
  success:  '#10b981',   // emerald-500
  warning:  '#f59e0b',   // amber-500
  danger:   '#f43f5e',   // rose-500
  bg:       '#f8fafc',   // slate-50
  surface:  '#ffffff',
  text:     '#0f172a',   // slate-900
  muted:    '#64748b',   // slate-500
}
// Typography: DM Sans (web + mobile)
// Border radius: 16-20px (mobile), 20-24px (web)
// Touch targets: ≥44pt iOS, ≥48dp Android
```

---

## Admin Panel

```
URL:       /admin
Email:     admin@dovuto.it
Password:  admin2024
```

---

## Roadmap

- [x] Web app (React + Vite)
- [x] Admin panel
- [x] Monorepo Turborepo
- [x] packages/data (TypeScript)
- [x] packages/hooks (condivisi)
- [x] apps/mobile scaffolding
- [x] Tab navigator + schermate base
- [x] Tauri desktop config
- [x] CI/CD GitHub Actions
- [ ] Supabase Auth (tutti i client)
- [ ] Stripe checkout live
- [ ] Push notifications production (APNS + FCM)
- [ ] Biometria (FaceID / Fingerprint)
- [ ] Widgets iOS + Android
- [ ] App Store + Play Store submission

---

## Licenza

MIT — © 2024 Dovuto
