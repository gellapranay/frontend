# Antarmarg Frontend (Last-Meter Intelligence)

Enterprise React + TypeScript web application for universal intelligent indoor navigation, multi-gate routing, and dynamic last-meter delivery management.

## Tech Stack
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Modern Dark Aesthetic (Midnight Navy `#0B1220`, Cyan `#67E8F9`)
- **Animations**: Framer Motion, HTML5 Interactive Graph Canvas
- **Maps**: React Leaflet, CartoDB Dark Matter
- **Icons & Visuals**: Lucide React, Recharts

## Environment Variables
Create `.env` or set in Render:
```env
VITE_API_URL=https://your-backend-service.onrender.com/api
```
*(Leave empty for local development to use the Vite proxy to `http://localhost:8080`)*

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

## Deploy on Render (Static Site)
1. In Render Dashboard, click **New +** > **Static Site**.
2. Connect repository: `https://github.com/gellapranay/frontend.git`.
3. Configure settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://<YOUR-RENDER-BACKEND-SERVICE>.onrender.com/api`
5. Click **Create Static Site**.
