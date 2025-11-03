# Desktop Build Setup

This project can be packaged as a desktop application using either **Electron** or **Tauri**.

## Option 1: Tauri (Recommended)

Tauri uses the system's native webview, resulting in smaller bundle sizes (~30-50MB vs ~150MB with Electron).

### Setup
```bash
npm install -D @tauri-apps/cli @tauri-apps/api
```

### Development
```bash
npm run tauri:dev
```

### Build
```bash
npm run tauri:build
```

Outputs will be in `src-tauri/target/release/`.

**Requirements:**
- Windows: Visual Studio Build Tools 2019+
- macOS: Xcode Command Line Tools
- Linux: libssl-dev, libwebkit2gtk-4.1-dev, curl, wget, libappindicator3-dev, patchelf

## Option 2: Electron

Electron bundles Chromium, resulting in larger downloads but more control.

### Setup
```bash
npm install -D electron electron-builder electron-is-dev
```

### Development
```bash
npm run dev          # Start Vite dev server in terminal 1
npm run electron     # Start Electron in terminal 2
```

### Build
```bash
npm run electron:build
```

Outputs will be in `dist/`.

## Environment Configuration

Create `.env` files for each platform:

```env
# .env.tauri
VITE_APP_ENV=tauri

# .env.electron
VITE_APP_ENV=electron
```

## Key Features for Desktop

- File system access (with appropriate permissions)
- Native window controls
- Offline-first functionality (Service Worker)
- Local database (IndexedDB + Dexie.js)

## Code Detection

Detect platform at runtime:

```typescript
// Detect if running in desktop environment
const isDesktop = () => {
  return !!(window as any).electron ||
         (window.__TAURI__ !== undefined);
};

// Detect specific platform
const isElectron = () => (window as any).electron !== undefined;
const isTauri = () => (window as any).__TAURI__ !== undefined;
```

## Auto-Update (Optional)

### Tauri
```bash
npm install -D tauri-plugin-updater
```

### Electron
```bash
npm install -D electron-updater
```

## Signing & Notarization

For production releases:
- **macOS**: Requires codesigning certificate (Apple Developer)
- **Windows**: Optional code signing certificate
- **Linux**: GPG signing for packages
