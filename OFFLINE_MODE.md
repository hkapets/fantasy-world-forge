# Offline Mode Documentation

The Fantasy World Builder supports full offline functionality through Service Workers and IndexedDB.

## How It Works

### Service Worker
- Caches all static assets (JS, CSS, images)
- Caches audio files for background music
- Stores API responses for later use
- Serves cached content when offline

### Local Storage
- **IndexedDB**: Main data storage (via Dexie.js)
- **localStorage**: Settings and preferences
- **Dexie.js**: Structured database for complex queries

### Data Synchronization
When the user goes offline:
1. All reads use local cached data
2. All writes go to IndexedDB (locally)
3. Changes are marked as "pending"
4. When online, pending changes sync automatically

## Features

### Offline Access
- View all previously loaded worlds and characters
- Read saved notes and chronology
- Browse relationship maps and scenarios
- Play background music (cached tracks only)

### Offline Capabilities
- Create new worlds and characters (saved locally)
- Edit existing data
- Add notes and relationships
- Manage scenarios
- All changes persist in IndexedDB

### Automatic Sync
Once online:
- Pending changes sync to backend
- Conflict resolution if data was changed elsewhere
- Cache updates with latest data
- Visual indicator shows sync status

## Storage Quota

Browser storage limits (varies by browser):
- Desktop Chrome: 50MB+
- Mobile Chrome: 5-10MB
- Firefox: 50MB+
- Safari: 50MB

Use `OfflineManager.getCacheStats()` to check usage.

## Clearing Cache

Clear cached data in Settings:
- Clear Service Worker cache
- Clear IndexedDB
- Reset to fresh install

Programmatically:
```typescript
import { OfflineManager } from '@/hooks/useServiceWorker';

await OfflineManager.clearCache();
```

## Detecting Online/Offline Status

```typescript
import { useServiceWorker } from '@/hooks/useServiceWorker';

const status = useServiceWorker();
console.log(status.isOnline); // true or false
```

Or use native browser API:
```typescript
if (navigator.onLine) {
  console.log('Online');
} else {
  console.log('Offline');
}
```

## API Response Caching

Cached API responses:
- Character lists
- World data
- Relationship data
- Chronology events
- Scenario information

**Note:** Not cached:
- Real-time updates from other users
- Authentication tokens (security)
- File uploads (requires network)

## Service Worker Updates

The app automatically checks for updates every minute. If a new version is available:
1. Visual indicator appears
2. User can reload to apply update
3. Old cache is cleaned up

## Best Practices

1. **Before large edits**: Ensure you're online or have stable connection
2. **External exports**: Download backups regularly
3. **Monitor storage**: Check quota before adding large images
4. **Cache management**: Clear old caches if running low on storage

## Troubleshooting

### Service Worker not registering
- Check browser console for errors
- Ensure HTTPS (or localhost for dev)
- Clear browser cache and try again

### Offline mode not working
- Enable Service Workers in browser settings
- Check if localStorage/IndexedDB is enabled
- Try private/incognito mode (disables SW)

### Slow offline performance
- Too much cached data
- IndexedDB indexes need optimization
- Clear cache and restart

## Testing Offline Mode

1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from the throttling dropdown
4. Refresh page
5. App should load from cache
6. All features should work locally
