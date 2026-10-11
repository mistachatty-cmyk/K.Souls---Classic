# 1. Development
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run dev
# Access: http://localhost:5173 & on mobile: http://<PC_IP>:5173

# 2. Testing on device
# Same dev server, connect mobile device on same network

# 3. Build for distribution
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kinetic-souls run build

# 4. Share with testers
# Upload dist/ to Netlify/Vercel and share link

# 5. Phone app (PWA - easiest)
# Add manifest.json and meta tags (I can do this for you)
# Users install from browser