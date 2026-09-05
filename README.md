# 🚀 MicroLink | Enterprise Hyper-Local Micro-Gig Platform (Gujarat Edition)

[![Primary Server URL](https://img.shields.io/badge/Primary_Server-connect--dash--shine.onrender.com-4F46E5?style=for-the-badge&logo=render)](https://connect-dash-shine.onrender.com/)
![MicroLink Banner](https://img.shields.io/badge/MicroLink-Gujarat_Micro--Gigs-6366F1?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3+-646CFF?style=for-the-badge&logo=vite)
![Security Shield](https://img.shields.io/badge/Security-Aadhaar_e--KYC-059669?style=for-the-badge)

🌐 **Primary Server URL**: [https://connect-dash-shine.onrender.com](https://connect-dash-shine.onrender.com/)  
📦 **GitHub Repository**: [https://github.com/12402040601079-hub/connect-dash-shine.git](https://github.com/12402040601079-hub/connect-dash-shine.git)

**MicroLink** is an enterprise-grade, high-traffic, hyper-local micro-gig marketplace designed specifically for **Gujarat & India**. Built on React 18, TypeScript, Vite, and Tailwind CSS, it offers physical presence verification, dynamic AI economics, multilingual vernacular support, real-time vehicle telemetry, and GST-compliant invoicing in a sleek, light-mode-default responsive application.

---

## ✨ Key Pillar Features

### 🛡️ 1. Trust, Anti-Fraud & Physical Presence
- **🇮🇳 DigiLocker / Aadhaar e-KYC Verification**: Instant 12-digit UID verification with simulated OTP authentication and issuance of an official gold **Govt. Verified** Trust Badge.
- **📍 Geo-Fenced QR & 4-Digit OTP Handshake**: Requester and Helper perform a physical check-in using a dynamic QR code & secret OTP validated within 50m GPS bounds.
- **🤖 AI Vision Work Proof Engine**: Before & After photo verification with simulated AI image quality inspection before escrow funds release.

### 🤖 2. Smart AI Dispatch & Multilingual Bridge
- **⚡ AI Dynamic Fare & ETA Estimator**: Pricing engine calculating base rates, urgency multipliers (1.25x for urgent), distance, and traffic. Includes a 1-click **₹9 Digit/Acko Gig Protection Insurance** add-on.
- **🗣️ Multilingual Translation Bridge**: Instant bi-directional translation for **English ⇄ Gujarati ⇄ Hindi** with pre-compiled vernacular gig chips (e.g., *"હું 10 મિનિટમાં પહોંચી રહ્યો છું"*).

### 🗺️ 3. Real-Time Telemetry & Safety Beacon
- **📍 Gujarat Multi-City Telematics**: Live animated tracking across **Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, and Bhavnagar** with speed, battery, and ETA telemetry.
- **🚨 1-Tap WhatsApp SOS Beacon**: Encodes driver GPS coordinates and live status into an emergency dispatch link for trusted contacts.
- **📞 Masked WebRTC Audio Calling**: Privacy-preserving in-app VoIP calling with animated sound wave visualization.

### 📄 4. Fintech & GST Tax Compliance
- **🧾 GST Tax Invoice Generator**: Automatic calculation under SAC Code 9987 with 9% CGST + 9% SGST breakdown, platform fees, and 1-click printable PDF receipts.

---

## 🌐 Live Server & Deployment Architecture

- **Primary Server**: [https://connect-dash-shine.onrender.com](https://connect-dash-shine.onrender.com/)
- **Container Build**: Powered by Docker + Nginx (`Dockerfile` & `nginx.conf` included) for zero-downtime rolling updates.
- **Cloud Fallbacks**: Pre-configured for Render, Vercel (`vercel.json`), Netlify (`netlify.toml`), and GitHub Actions (`.github/workflows/ci-cd.yml`).

---

## 📐 Layout & Responsive Spacing

- **Standardized Container**: Centered `max-w-[1180px]` geometry across Dashboard, Post Task, Track, and Chat views (`margin: 0 auto`, `padding: 0 28px 48px`).
- **Calm UI Aesthetics**: Default Light Mode with gentle micro-interactions (0.15s hover transitions) without distracting jittering animations.

---

## 📁 Repository Structure

```
connect-dash-shine/
├── .github/workflows/    # CI/CD automated build workflow
├── dist/                 # Production build assets
├── src/
│   ├── components/
│   │   ├── brand/       # 3D Isometric AppLogo & Brand assets
│   │   ├── ui/          # Accessible UI components, category scrollers
│   │   ├── workflow/    # Modals (Aadhaar KYC, QR Handshake, AI Work Proof, GST Invoice, WebRTC)
│   │   └── ErrorBoundary.tsx # Production error guard shield
│   ├── services/
│   │   ├── aiEstimator.ts  # Dynamic fare & ETA algorithm
│   │   ├── invoice.ts      # GST invoice & SAC code calculations
│   │   ├── translator.ts   # Gujarati/Hindi/English translation engine
│   │   ├── tasks.ts        # Task data provider & mock APIs
│   │   └── security.ts     # Anti-fake auth & validation
│   ├── App.tsx          # Main router & theme provider
│   └── index.css        # Global CSS & design tokens
├── .env.example          # Environment variables template (Keys protected)
├── Dockerfile            # Container deployment image
├── nginx.conf            # Production Nginx SPA & Gzip server config
├── vercel.json           # 1-Click Vercel deployment config
├── netlify.toml          # 1-Click Netlify deployment config
└── README.md             # Platform overview & deployment guide
```

---

## ⚙️ Environment Configuration

For security, `.env` is **strictly ignored in `.gitignore`**. To configure environment variables locally or on your server, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Define the following environment variables:

```ini
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_MAPS_API_KEY="your-google-maps-key"
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/12402040601079-hub/connect-dash-shine.git
   cd connect-dash-shine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` in your browser.

4. **Verify TypeScript & Production Build**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📜 Complete System Documentation
For deeper technical architectural specifications, component hierarchies, and API specs, consult [`DOCUMENTATION.md`](file:///c:/new%20noom/connect-dash-shine/DOCUMENTATION.md).

---

## 📄 License
Licensed under the [MIT License](LICENSE).
