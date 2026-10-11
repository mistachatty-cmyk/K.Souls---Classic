# Code Citations

## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/Banno/jha-design/blob/e61f0348442db9138a9b3696677407c0b7865d37/src/examples/banno-web.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/drewp/maps/blob/1e8b6d9c3cb3221ea8f33f027e2f14d6ec2524f8/v4/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/Banno/jha-design/blob/e61f0348442db9138a9b3696677407c0b7865d37/src/examples/banno-web.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/drewp/maps/blob/1e8b6d9c3cb3221ea8f33f027e2f14d6ec2524f8/v4/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


## License: unknown
https://github.com/Banno/jha-design/blob/e61f0348442db9138a9b3696677407c0b7865d37/src/examples/banno-web.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/drewp/maps/blob/1e8b6d9c3cb3221ea8f33f027e2f14d6ec2524f8/v4/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/drewp/maps/blob/1e8b6d9c3cb3221ea8f33f027e2f14d6ec2524f8/v4/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/Banno/jha-design/blob/e61f0348442db9138a9b3696677407c0b7865d37/src/examples/banno-web.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/drewp/maps/blob/1e8b6d9c3cb3221ea8f33f027e2f14d6ec2524f8/v4/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/sumitmah/sumitmah.github.io/blob/7b4fad054f2d48329154dae8f7703a67f141cdd2/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: unknown
https://github.com/Banno/jha-design/blob/e61f0348442db9138a9b3696677407c0b7865d37/src/examples/banno-web.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```


## License: MIT
https://github.com/mithunck/rtodashboard/blob/582584dbf0b5dde57e5f3961a09730daca1aec2a/build/index.html

```
Here's your complete launch strategy for all platforms:

## 🚀 Launch Strategy for Kinetic Souls

### **1. Local Development & Browser Testing** (Fastest)

**Start the dev server:**
```bash
cd C:\Users\glory\Dev\Kinetic-Souls
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Access: **`http://localhost:5173`**

**Or use VS Code task:**
- Press **Ctrl+Shift+B** → Select "Dev: Kinetic Souls Game"

✅ Hot reload on every change  
✅ Works on desktop browsers  
✅ Responsive design already enabled (see viewport meta tag)

---

### **2. Mobile Testing (Touch Support)**

#### **A. Test on Mobile Device (Same Network)**

Start the dev server with network access:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
```

Then access from mobile: **`http://<YOUR_PC_IP>:5173`**

Example: `http://192.168.1.100:5173`

**Find your PC IP:**
```powershell
ipconfig | Select-String "IPv4"
```

✅ Real-time testing on actual phone  
✅ Full touch support (already in the game code)  
✅ Hot reload works over network

#### **B. Test Locally (Desktop Emulation)**
- Open dev tools in browser: **F12**
- Click responsive design mode: **Ctrl+Shift+M**
- Select "iPhone 12", "Pixel 5", etc.
- Test with mouse (simulates touch)

---

### **3. Build for Distribution to Testers**

**Create optimized production build:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build
```

Output location: `artifacts/kinetic-souls/dist/`

**Deploy and share:**
1. Upload `dist/` folder to web host (Netlify, Vercel, GitHub Pages, etc.)
2. Share link with testers
3. Works on all devices/browsers without installation

**Quick free hosting options:**
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Push to repo, enable Pages
- **Vercel**: Connect repo, auto-deploys

---

### **4. Launch as Phone Application**

You have **3 options**:

#### **Option A: Web App (Easiest) - No App Store Needed**

Make it installable as an app without coding:

```bash
cat > C:\Users\glory\Dev\Kinetic-Souls\artifacts\kinetic-souls\public\manifest.json << 'EOF'
{
  "name": "Kinetic Souls",
  "short_name": "KineticSouls",
  "description": "2D 1v1 retro battle game",
  "start_url": "/",
  "display": "fullscreen",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF
```

Update `index.html` head:
```html
<meta name="theme-color" content="#000000">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kinetic Souls">
```

**Users install by
```

