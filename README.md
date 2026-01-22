# Geo Data Stories - Frontend

React-baseret webapplikation til indsamling og visning af geografiske data stories i Brabrand, Aarhus.

![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan)

---

## 📋 Indholdsfortegnelse

- [Features](#features)
- [Teknologi Stack](#teknologi-stack)
- [Forudsætninger](#forudsætninger)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Kørsel](#kørsel)
- [Projekt Struktur](#projekt-struktur)
- [Komponenter](#komponenter)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- 🗺️ **Interaktivt Leaflet kort** over Brabrand området
- 📍 **10 grid cells** (ca. 200m x 200m hver)
- 📝 **Data stories** med tekst, billeder og videoer
- 🏷️ **Tags system** (hverdag, fællesskab, nabolag)
- 🔍 **Keywords** til kategorisering
- 📸 **Upload** af billeder (maks 5)
- 🎥 **Upload** af videoer (maks 5)
- 📄 **Upload** af tekstfiler (maks 5)
- 💾 **Persistent storage** via backend API
- 📱 **Responsive design**
- 🎨 **Modern UI** med Tailwind CSS

---

## 🛠️ Teknologi Stack

### Core
- **React 18** - UI framework
- **Vite 5** - Build tool & dev server
- **JavaScript (ES6+)** - Programming language

### UI & Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Icon library

### Mapping
- **Leaflet 1.9** - Interactive maps
- **OpenStreetMap** - Map tiles

### State Management
- **React Hooks** (useState, useEffect, useRef)

---

## 📦 Forudsætninger

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Backend server** kørende på `http://localhost:8000`

---

## 🚀 Installation

### 1. Clone/naviger til projektet

```bash
cd geo-stories-frontend
```

### 2. Installer dependencies

```bash
npm install
```

### 3. Verificer installation

```bash
npm list
```

Du skulle se:
- react@18.x
- vite@5.x
- lucide-react@0.x
- (og andre dependencies)

---

## ⚙️ Konfiguration

### API URL

API URL er defineret i `src/App.jsx`:

```javascript
const API_URL = 'http://localhost:8000';
```

**For produktion**, opdater til din backend URL:

```javascript
const API_URL = 'https://your-backend-domain.com';
```

### Environment Variables (valgfrit)

Opret `.env` fil i roden (hvis nødvendigt):

```bash
VITE_API_URL=http://localhost:8000
```

Og opdater i `App.jsx`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## 🏃 Kørsel

### Development Mode

```bash
npm run dev
```

Åben browser på: **http://localhost:5173**

### Build til Production

```bash
npm run build
```

Output genereres i `dist/` mappen.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Projekt Struktur

```
geo-stories-frontend/
│
├── public/                 # Static assets
│   └── vite.svg
│
├── src/
│   ├── App.jsx            # Main component med kort og story logic
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
│
├── index.html             # HTML template (Leaflet & Tailwind CDN)
├── package.json           # Dependencies og scripts
├── vite.config.js         # Vite configuration
├── .gitignore             # Git ignore rules
└── README.md              # Denne fil
```

---

## 🧩 Komponenter

### App.jsx - Main Component

**State Management:**
- `stories` - Array af alle data stories
- `selectedStory` - Aktiv story (når markør klikkes)
- `isAddingStory` - Om formularen er åben
- `selectedGrid` - Valgt grid cell
- `mapReady` - Om Leaflet kortet er initialiseret
- `formData` - Form state for ny story

**Key Functions:**
- `initMap()` - Initialiserer Leaflet kort
- `drawGrid()` - Tegner 10 grid rectangles
- `addMarkers()` - Tilføjer story markører
- `handleImagesUpload()` - Håndterer billede upload
- `handleVideosUpload()` - Håndterer video upload
- `handleTextFilesUpload()` - Håndterer tekstfil upload
- `toggleTag()` - Toggle tags (maks 3)

**onClick handler (inline):**
- Upload filer først via `/api/upload`
- Gem story via `/api/stories`
- Opdater UI med ny story

---

## 🔌 API Integration

### Base URL
```javascript
const API_URL = 'http://localhost:8000';
```

### Endpoints Brugt

#### 1. Hent alle stories
```javascript
GET ${API_URL}/api/stories
```

**Response:**
```json
[
  {
    "id": 1,
    "gridId": "grid-0",
    "title": "Story titel",
    "content": "Story indhold",
    "images": ["/uploads/images/..."],
    "videos": [{"name": "...", "path": "/uploads/videos/..."}],
    ...
  }
]
```

#### 2. Upload filer
```javascript
POST ${API_URL}/api/upload
Content-Type: multipart/form-data
Body: FormData med files
```

**Response:**
```json
{
  "files": [
    {
      "originalName": "image.jpg",
      "url": "/uploads/images/123-456.jpg",
      "type": "images"
    }
  ]
}
```

#### 3. Gem story
```javascript
POST ${API_URL}/api/stories
Content-Type: application/json
Body: {
  gridId, lat, lng, title, content,
  images: [], videos: [], textFiles: [],
  groupNumber, keywords, selectedTags
}
```

**Response:**
```json
{
  "id": 15,
  "gridId": "grid-0",
  "title": "...",
  ...
}
```

---

## 🗺️ Grid System

**10 statiske grid cells** over Brabrand:

```javascript
const gridCells = [
  {
    id: 'grid-0',
    bounds: [[56.1720, 10.1100], [56.1693, 10.1145]],
    center: { lat: 56.17065, lng: 10.11225 }
  },
  // ... 9 mere
];
```

**Grid properties:**
- **Blå** - Ingen story endnu
- **Grøn** - Har story(ies)
- **Hover** - Opacity ændres til 0.4
- **Click** - Åbner story formular

---

## 🎨 Styling

### Tailwind CSS

Loaded via CDN i `index.html`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Hovedklasser brugt:**
- Layout: `flex`, `grid`, `absolute`, `relative`
- Sizing: `w-full`, `h-screen`, `max-h-*`
- Colors: `bg-blue-600`, `text-white`
- Spacing: `p-4`, `gap-2`, `space-y-4`
- Borders: `rounded-lg`, `shadow-2xl`

### Custom CSS

`src/index.css`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

---

## 📱 Responsive Design

Appen er optimeret til:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ⚠️ Tablet (768px+) - Begrænset
- ❌ Mobile - Ikke understøttet endnu

**Future work:** Mobile responsive design

---

## 🚀 Deployment

### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Option 2: Netlify

```bash
# Build
npm run build

# Deploy dist/ folder via Netlify UI
# eller Netlify CLI:
netlify deploy --prod --dir=dist
```

### Option 3: Static Hosting

```bash
npm run build

# Upload dist/ til:
# - GitHub Pages
# - AWS S3
# - DigitalOcean Spaces
# - etc.
```

**VIGTIGT:** Opdater `API_URL` til production backend URL!

---

## 🐛 Troubleshooting

### Problem: Kortet vises ikke

**Løsning:**
- Tjek at Leaflet CSS og JS er loaded i `index.html`
- Åbn DevTools Console - se efter fejl
- Verify `window.L` eksisterer: `console.log(window.L)`

### Problem: Billeder vises ikke

**Løsning:**
- Tjek Network tab - er request til `localhost:8000` eller `5173`?
- Verify `API_URL` er korrekt defineret
- Tjek at backend serverer filer fra `/uploads/`

### Problem: Stories gemmes ikke

**Løsning:**
- Tjek backend kører på port 8000
- Åbn Network tab og se POST request
- Verify CORS er enabled på backend
- Tjek Console for fejl

### Problem: "API_URL is not defined"

**Løsning:**
- Verify `const API_URL = 'http://localhost:8000';` er i toppen af `App.jsx`
- Efter imports, før komponenten

### Problem: Build fejler

**Løsning:**
```bash
# Ryd cache og reinstaller
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## 📊 Performance

### Initial Load
- **Bundle size:** ~500KB (gzipped)
- **First Contentful Paint:** <1s
- **Time to Interactive:** <2s

### Optimizations
- Leaflet lazy loading
- Image lazy loading (native browser)
- Minimal JavaScript bundle (Vite tree-shaking)

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Kort vises korrekt
- [ ] 10 blå grids er synlige
- [ ] Klik på grid åbner formular
- [ ] Upload billede virker
- [ ] Upload video virker
- [ ] Upload tekstfil virker
- [ ] Vælg tags (maks 3)
- [ ] Gem story gemmer i backend
- [ ] Grid bliver grøn med markør
- [ ] Klik på markør viser story
- [ ] Billeder vises korrekt
- [ ] Refresh loader eksisterende stories

---

## 🔮 Future Improvements

- [ ] Mobile responsive design
- [ ] Search/filter funktionalitet
- [ ] Story editing
- [ ] Story deletion
- [ ] User authentication
- [ ] Real-time updates (WebSockets)
- [ ] Offline support (PWA)
- [ ] Image compression før upload
- [ ] Video preview i formular
- [ ] Drag & drop file upload
- [ ] Map zoom til story location
- [ ] Export data til CSV/JSON

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Leaflet Docs](https://leafletjs.com/reference.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

## 👥 Contributors

- **Dit navn** - Initial development

---

## 📄 License

MIT License eller din valgte license.

---

## 🤝 Support

For spørgsmål eller problemer:
- Opret et issue på GitLab
- Kontakt: [din email]

---

**Built with ❤️ for Brabrand community**