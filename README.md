# Tether — Private Couples Connection

Connection without the anxiety. Intimacy without the effort.  
A private, calm connection layer between two partners.

Tether is a mobile-first web app (PWA + Capacitor Android) for couples to share ephemeral moments, save memories to a private vault, collect shared ideas, and signal emotional availability — all with a calm, low-pressure design.

## Features

- **Home** — Vibe check / emotional availability (Overwhelmed, Free to Talk, Thinking of You), latest moments, and quick capture.
- **Moments** — Ephemeral photo, video, or voice notes that expire (48h).
- **Vault** — Save special moments permanently with notes.
- **Idea Jar** — Shared list of dates, places, activities, future plans.
- **Privacy** — Biometric-style intimacy lock, stealth mode, calendar DND, hide media previews.
- **Real-time sync** — Firebase Firestore listeners for live updates between partners.
- **PWA + Android** — Installable on web; Capacitor Android APK via GitHub Actions.

## Tech Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- Firebase (Auth + Firestore)
- Capacitor 8 (Android)
- vite-plugin-pwa

## Getting Started

```bash
# Install
npm install --legacy-peer-deps

# Dev
npm run dev

# Production build
npm run build

# Preview
npm run preview
```

Open http://localhost:3000.

### Firebase

The app expects a Firebase project configured via `firebase-applet-config.json` (and optional `.env`).  
Firestore rules are included in `firestore.rules` and are intentionally permissive for the demo/seeded data model.

### Android

```bash
npm run build
npx cap sync android
# Then open android/ in Android Studio or use the GitHub Actions workflow
```

A persistent debug keystore is committed so APKs can be installed over previous builds.  
The CI workflow (`.github/workflows/build-android.yml`) builds a debug APK and publishes it to a rolling `apk-build` release.

## Demo Data

On first load the app seeds demo users (Sanjay & Alexandria), moments, vault items, and ideas.  
You can switch partner perspective from the header.

## License

Private / internal for now.
