# JobsNest — Recruitment Agency Website

A high-performance, dark-themed recruitment agency website for **JobsNest** (Bangalore, India), built with a modern bento grid layout, interactive 3D WebGL background mesh, live IST clock, dynamic candidate search & filter, direct WhatsApp integration, and responsive recruiter contact hub.

---

## 📁 Project Structure

The website is structured into three clean, maintainable files:

```
JobsNest/
├── index.html       # Semantic HTML5 layout and accessibility attributes
├── style.css        # Custom dark-theme styling, glassmorphism, responsive grids & animations
├── script.js        # Interactive logic, Three.js 3D mesh, IST clock, search filter & form actions
└── README.md        # Documentation and running guide
```

---

## ✨ Features

- **3D Glass Mesh Backdrop (`Three.js`)**: Real-time deformable organic icosahedron with glass physical material, wireframe overlay, mouse-tracking reaction, and scroll parallax.
- **Live Bangalore Clock (IST)**: Displays real-time Indian Standard Time (`BLR HH:MM IST`), updating automatically.
- **Dual-Funnel Bento Hero**:
  - **Job Seekers**: Live interactive search bar with instant keyword filtering, category chips (IT, Sales, Customer Support, Finance, Healthcare, Freshers), WhatsApp one-click application links, and transparent 10% fee notice.
  - **Employers**: Key hiring metrics (12 days average time to hire, 3–5 profiles, Pan-India reach, ₹0 employer fee) with quick brief triggers.
- **Dynamic Recruiter Contact Hub**:
  - One-click phone calling with a dedicated **Copy** button.
  - Direct WhatsApp link opening pre-composed chat with JobsNest.
  - Direct Email with a dedicated **Copy** button.
  - Animated SVG Map of India with pulsating geolocation dot on Bengaluru (`12.97°N, 77.59°E`) and office hours.
  - Interactive multi-role contact form (switches placeholders and validation between Job Seeker and Employer).
- **Service Bento Grid**: Permanent hiring, Bulk & volume hiring, and Career placement.
- **Interactive 4-Step Process Timeline**: Brief, Source & screen, Shortlist, and Offer & join with progress bars.
- **Interactive Card 3D Tilt**: Micro-perspective tilt and radial specular light highlight that follows the cursor.
- **Floating WhatsApp Action Button (FAB)**: Quick-access button anchored to the bottom right for instant inquiries.
- **Fully Responsive & Accessible**: Supports desktop, tablet, and mobile screens, and respects `prefers-reduced-motion`.

---

## 🚀 How to Run

### Option 1: Direct File Open
Double-click `index.html` in File Explorer or open it in your browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Option 2: VS Code Live Server
1. Open this folder in VS Code.
2. Right-click `index.html` and click **"Open with Live Server"**.

### Option 3: Local HTTP Server (Python / Node.js)
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```
Then visit `http://localhost:3000` in your browser.
