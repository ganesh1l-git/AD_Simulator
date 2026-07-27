# IADES — Indian Air Defence Educational Simulator

IADES is an interactive, educational Air Defense Command-and-Control (C2) simulation platform designed to visualize and calculate interception vectors, radar envelopes, and target detection metrics. It features a high-fidelity visual radar console, procurement tracking, and interactive scenario maps.

---

## 📂 Project Architecture

This project is configured as a Monorepo managed by [Turborepo](https://turbo.build/):

- **`apps/web`**: Next.js 15 (Turbopack) frontend dashboard containing the radar sweep simulator, interactive sector maps, target encyclopedia, and procurement panels.
- **`apps/server`**: Express.js REST API providing database endpoints for simulations, system procurement catalogs, and operator roster stats.
- **`packages/shared`**: Shared TypeScript libraries containing physics calculations and math formulas (e.g. `calculateInterceptionProbability` and radar RCS detections).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (React), Zustand (Global UI State), SVG/HTML5 canvas animations.
- **Backend**: Node.js, Express.js.
- **Database**: Prisma ORM with relational SQL backends.
- **Build System**: Turborepo, TypeScript, TailwindCSS.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18 or later
- **Package Manager**: npm (v9+)
- **Database**: PostgreSQL / SQLite (configured via environment settings)

### 2. Installation
Clone the repository and install workspace dependencies:
```bash
npm install
```

### 3. Environment Setup
Configure your environment variables by copying `.env.example` to `.env` in the root folder:
```bash
cp .env.example .env
```
Ensure your database connection string and ports are set correctly.

### 4. Database Setup
Sync database schemas and apply migrations:
```bash
npx prisma db push
```

### 5. Running the Application
Spin up the development server for both the Next.js frontend and Express backend simultaneously:
```bash
npm run dev
```
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)

---

## 📡 Key Features

### 1. Tactical Command & Control (C2) Console
- **Real-time Radar Sweep**: Live SVG scanning board plotting range rings up to 400km and tracking dynamic threat vectors.
- **Airspace Sector Coverage**: Interactive map of defensive fronts (Northern, Western, Eastern, etc.) with real-time airspace security evaluations.
- **Weapons Override Master Switch**: Supports `SAFE` (locks salvoes), `HOLD` (manual firing locks), and `AUTO-FIRE` (automated defense interception) protocols.
- **IFF & Telemetry**: Real-time DMS Latitude/Longitude coordinate tracking, MGRS grid conversion, Squawk transponder monitoring, and target trails.

### 2. Systems Encyclopedia & Threat Profiles
- Interactive reference cards detailing performance envelopes for S-400 Triumf, Barak-8, Akash SAM, and point-defense systems.
- In-depth aerodynamic target profiles covering RCS sizes and hypersonic velocities.

---

## 🛡️ Disclaimer
*This platform is designed strictly for educational and visualization purposes. All physics formulas, ranges, and target probability figures are desensitized approximations sourced from publicly available literature.*
