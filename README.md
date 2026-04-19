# 🏟️ OmniFlow: Next-Gen Intelligent Stadium Experience

[![Production Backend](https://img.shields.io/badge/Production-Backend-0ea5e9?style=for-the-badge&logo=google-cloud)](https://api-gateway-613466328958.us-central1.run.app)
[![Attendee App](https://img.shields.io/badge/Live-Attendee_App-14b8a6?style=for-the-badge&logo=vercel)](https://attendee-613466328958.us-central1.run.app)
[![Admin Dashboard](https://img.shields.io/badge/Admin-Dashboard-8b5cf6?style=for-the-badge&logo=nextdotjs)](https://physical-event-expriment.vercel.app/)

OmniFlow is a high-fidelity, end-to-end event management ecosystem designed for massive venues (100,000+ attendees). It eliminates friction in the attendee journey through real-time telemetry, predictive crowd analytics, and a photorealistic spatial digital twin.

---

## 🚀 Live Deployments

| Interface | URL | Description |
| :--- | :--- | :--- |
| **Admin Control Center** | [physical-event-expriment.vercel.app](https://dashboard-bqcgo2zaia-uc.a.run.app/) | Global command center for crowd intelligence and infrastructure monitoring. |
| **Attendee Mobile Experience** | [attendee-613466328958.us-central1.run.app](https://attendee-613466328958.us-central1.run.app) | Premium mobile app with live match scores, weather, and smart routing. |
| **Scalable API Gateway** | [api-gateway-613466328958.us-central1.run.app](https://api-gateway-613466328958.us-central1.run.app) | Centralized microservice hub orchestrating real-time telemetry. |

---

## ✨ Key Features

### 🏢 Digital Twin Command Center
- **Spatial 3D Visualization**: Photorealistic stadium layout with real-time zone-based density heatmap.
- **Predictive Analytics**: Machine learning models predicting queue wait times and exit velocities.
- **Real-Time Simulation**: 100% live telemetry for crowd demographic and queue intelligence.

### 📱 Premium Attendee Experience
- **One-Handed Navigation**: Custom-built bottom tab navigation for seamless use in crowded environments.
- **Live Match Hub**: Real-time cricket score ticker (GT vs CSK) and live Ahmedabad weather data.
- **Smart Routing**: Autonomous wayfinding that avoids high-density zones in real-time.

### 🔐 Enterprise Architecture
- **Microservices Orchestration**: Centralized API Gateway managing service-to-service communication.
- **Cloud Native**: Fully containerized and deployed on Google Cloud Run with auto-scaling capabilities.
- **SQL Digital Twin**: Comprehensive database schema designed for millisecond-latency spatial queries.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (Turbopack), TypeScript, Framer Motion, Vanilla CSS.
- **Design System**: Glassmorphism UI, Premium White Theme, Custom SVG Iconography.
- **Infrastructure**: Docker, Google Cloud Run, Vercel, Supabase (SQL).
- **APIs**: OpenWeather API, Live Match Telemetry (Mock), Custom Spatial Engine.

---

## 📂 Project Structure

```bash
├── apps
│   ├── dashboard      # Admin Control Center (Next.js)
│   └── attendee       # Mobile Attendee App (Next.js)
├── services
│   └── api-gateway    # Centralized Microservice Hub (Express)
├── infrastructure
│   └── db             # SQL Schemas & Database Config
└── scripts            # Automated Build & Deployment Pipelines
```

---

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+ & npm
- Docker (for local microservice testing)
- Google Cloud CLI (for deployment)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/Tktirth/physical-event-expriment.git
   cd physical-event-expriment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dashboard:
   ```bash
   cd apps/dashboard && npm run dev
   ```
4. Start the attendee app:
   ```bash
   cd apps/attendee && npm run dev
   ```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---


