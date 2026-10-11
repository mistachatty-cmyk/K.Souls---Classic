# Kinetic Souls - Cache Fix Documentation

## Problem: Old Version Loading After Updates

### Symptoms
- Browser shows old version of the game even after running `npm run build`
- Changes to code don't appear in the browser
- Browser console may show no errors, but features are missing
- Works fine in other browsers or incognito mode

### Root Cause
**Browser caching**. The browser is loading cached JavaScript files instead of fetching the new build.

### Fixes

### 1. Quick Fix (Applied)
Added cache-busting query parameter to the script source:
```html
<script type="module" src="/src/main.tsx?v=2"></script>
```
Change the number after `?v=` each time you make changes.

### 2. Hard Refresh
Press **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac) to force refresh.

### 3. Clear Browser Cache
- Chrome: DevTools → Network tab → Check "Disable cache" checkbox
- Or: Settings → Privacy → Clear browsing data → Cached images and files

### 4. Incognito/Private Mode
Open in private/incognito window - caches are disabled by default.

### 5. Vite Server Restart
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 6. For Production Build
After `npm run build`, the `dist` folder should be served fresh. If using a static server:
```bash
npx serve dist
```

## Prevention
- Enable "Disable cache" in DevTools Network tab while developing
- Use incognito mode for testing
- Increment the cache-buster version number in index.html when needed