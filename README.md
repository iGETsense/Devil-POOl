# 🔥 Devil Pool - Demon Time Event Platform

<div align="center">

![Demon Time](https://img.shields.io/badge/Demon%20Time-Pool%20Party-FF0000?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

**A premium event ticketing and reservation platform for exclusive pool party experiences**

[Live Demo](#) • [Features](#features) • [Installation](#installation) • [Backend Integration](#-backend-integration-guide)

</div>

---

## 📋 Overview

**Devil Pool** is a modern, full-featured event management platform designed for the "Demon Time" pool party series. The application provides a seamless ticket booking experience with QR code-based entry validation, mobile camera scanning, multiple pass tiers, and an elegant dark-themed UI.

### 🎯 Key Highlights

- **🎫 Multi-Tier Pass System**: Three distinct pass types (One Man, One Lady, Five Queens)
- **📱 QR Code Integration**: Camera-based scanning with real-time validation
- **👨‍💼 Admin Dashboard**: Secure admin panel with QR scanner and guest management
- **🌙 Dark Theme UI**: Stunning neon-accented design with gold typography
- **⚡ Lightning Fast**: Built on Next.js 15 with React 19
- **📱 Fully Responsive**: Optimized for all devices
- **🎨 Modern UI Components**: Powered by Radix UI and shadcn/ui

---

## ✨ Features

### 🎟️ Pass Management
- **ONE MAN Pass** - 15,000 FCFA: Individual entry for gentlemen
- **ONE LADY Pass** - 10,000 FCFA: Individual entry for ladies
- **FIVE QUEENS Pass** - 5,000 FCFA: Group entry for five ladies
- Real-time pass selection with visual cards
- Integrated payment flow (Orange Money & MTN MoMo)

### 🔐 Security & Validation
- Unique QR codes generated for each ticket
- Camera-based QR scanning with jsQR library
- Real-time validation (valid/invalid/already scanned)
- Session-based admin authentication
- No QR code = No entry policy

### 👨‍💼 Admin Dashboard
- **Password-only login** (no username required)
- **QR Code Scanner**: Camera access with permission request
- **Guest List Management**: Search, filter, and view all bookings
- **Statistics Dashboard**: Total guests, scanned entries, pending, revenue
- **No Navbar**: Clean, focused admin interface

### 🎨 User Experience
- Immersive hero section with high-quality imagery
- Smooth animations and transitions (loading spinner, scan animation)
- Interactive pass selection cards
- Mobile-first responsive design
- Dark mode optimized interface
- Confirmation page with downloadable QR code

### 🛠️ Technical Features
- Server-side rendering (SSR)
- Type-safe development with TypeScript
- Component-based architecture
- Dynamic imports for client-side components
- Camera API integration
- Real-time QR code detection
- Session storage for admin auth

---

## 🚀 Tech Stack

### Core Framework
- **[Next.js 15.2.4](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling
- **[TailwindCSS 4.1.9](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Form & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod 3.25.76](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Form validation integration

### Additional Libraries
- **[date-fns](https://date-fns.org/)** - Date utility library
- **[Recharts](https://recharts.org/)** - Chart library for analytics
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component
- **[@vercel/analytics](https://vercel.com/analytics)** - Web analytics

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:iGETsense/Devil-POOl.git
   cd Devil-POOl
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
demontimesite/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers & fonts
│   ├── page.tsx                 # Homepage with hero & passes preview
│   ├── globals.css              # Global styles, CSS variables & animations
│   │
│   ├── passes/                  # Pass selection & booking
│   │   ├── page.tsx            # All passes overview page
│   │   ├── one-man/
│   │   │   └── page.tsx        # ONE MAN pass details & payment
│   │   ├── one-lady/
│   │   │   └── page.tsx        # ONE LADY pass details & payment
│   │   └── five-queens/
│   │       └── page.tsx        # FIVE QUEENS pass details & payment
│   │
│   ├── reservation/             # Legacy reservation page
│   │   └── page.tsx
│   │
│   ├── confirmation/            # Post-payment confirmation
│   │   └── page.tsx            # QR code display & booking details
│   │
│   └── admin/                   # Admin panel (NO NAVBAR)
│       ├── layout.tsx          # Admin-specific layout with jsQR script
│       ├── login/
│       │   └── page.tsx        # Password-only admin login
│       └── dashboard/
│           └── page.tsx        # QR scanner + guest list management
│
├── components/                  # Reusable UI components
│   ├── ui/                     # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── navbar.tsx              # Main navigation (NOT in admin)
│   ├── theme-provider.tsx      # Theme context provider
│   ├── payment-form.tsx        # Payment form with Orange/MTN selection
│   └── qr-scanner.tsx          # Camera QR scanner component
│
├── types/                       # TypeScript type definitions
│   └── jsqr.d.ts               # jsQR library type declarations
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/                         # Utility functions
│   └── utils.ts
│
├── public/                      # Static assets
│   ├── hero-black-women-pool-2.jpg
│   ├── one-man-card.jpg
│   ├── one-lady-card.jpg
│   └── five-queens-card.jpg
│
├── components.json              # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Neon Red (`#FF0000`)
- **Accent**: Gold (`#FFD700`)
- **Background**: Black (`#000000`)
- **Surface**: Gray-900 (`#111827`)

### Typography
- **Headings**: Cinzel (serif) - Elegant, classical
- **Body**: System fonts - Optimized readability

### Components
All UI components follow the shadcn/ui design system with custom theming:
- Buttons with neon glow effects
- Cards with gradient borders
- Smooth hover animations
- Accessible focus states

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Tailwind Configuration
Custom CSS variables are defined in `app/globals.css`:
- `--neon-red`: Primary neon color
- `--font-cinzel`: Heading font family
- `--font-gothic`: Alternative font family

---

## 📱 Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage with hero section and pass preview | No |
| `/passes` | All available passes overview with cards | No |
| `/passes/one-man` | ONE MAN pass details & payment form | No |
| `/passes/one-lady` | ONE LADY pass details & payment form | No |
| `/passes/five-queens` | FIVE QUEENS pass details & payment form | No |
| `/confirmation` | QR code display & booking confirmation | No |
| `/admin/login` | Admin password-only login | No |
| `/admin/dashboard` | QR scanner + guest list management | Yes |

---

## 🔌 Backend Integration Guide

### 📋 Overview for Backend Team

This frontend is **ready for backend integration**. All UI components, forms, and flows are functional with **demo data**. Your task is to replace the demo data with real API calls.

### 🎯 Key Integration Points

#### 1️⃣ **Payment Processing** (`/app/passes/[pass-type]/page.tsx`)

**Component**: `PaymentForm` (`/components/payment-form.tsx`)

**Current State Variables**:
```typescript
const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
})
const [selectedOperator, setSelectedOperator] = useState<"orange" | "mtn" | null>(null)
```

**What to Replace**:
```typescript
// Line 27-32 in payment-form.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  // 🔴 REPLACE THIS with your API call:
  setTimeout(() => {
    console.log("Payment data:", { ...formData, operator: selectedOperator, pass: passName })
    router.push("/confirmation")
  }, 3000)
}
```

**Backend API Endpoint Needed**:
```typescript
POST /api/bookings/create
{
  "fullName": string,
  "phone": string,
  "passType": "ONE MAN" | "ONE LADY" | "FIVE QUEENS",
  "price": string,
  "paymentOperator": "orange" | "mtn"
}

Response:
{
  "success": boolean,
  "bookingId": string,
  "qrCode": string,
  "message": string
}
```

**Integration Steps**:
1. Create API route handler in `/app/api/bookings/create/route.ts`
2. Replace `setTimeout` with `fetch()` or `axios` call
3. Handle payment with Orange Money/MTN MoMo API
4. Generate unique QR code (format: `DT-PASS-XXXXXXX`)
5. Store booking in database
6. Return booking data
7. Redirect to `/confirmation` with booking ID

---

#### 2️⃣ **Confirmation Page** (`/app/confirmation/page.tsx`)

**Current Demo Data** (Line 13-23):
```typescript
const bookingData = {
  name: "John Doe",
  phone: "+237 6XX XXX XXX",
  passType: "ONE MAN",
  price: "15 000 FCFA",
  bookingId: "DT-2025-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...",
  eventDate: "Novembre 2025",
  eventLocation: "Pool Paradise, Douala",
  eventTime: "20h00 - 04h00"
}
```

**Backend API Endpoint Needed**:
```typescript
GET /api/bookings/:bookingId
Response:
{
  "id": string,
  "name": string,
  "phone": string,
  "passType": string,
  "price": string,
  "qrCode": string,  // QR code image URL or data
  "bookingDate": string,
  "eventDate": string,
  "eventLocation": string,
  "eventTime": string
}
```

**Integration Steps**:
1. Get `bookingId` from URL params or session storage
2. Fetch booking data from API
3. Replace demo data with API response
4. Display QR code (can use `qrcode.react` library or API-generated image)

---

#### 3️⃣ **Admin Login** (`/app/admin/login/page.tsx`)

**Current Auth** (Line 13):
```typescript
const ADMIN_PASSWORD = "DemonTime2025"  // 🔴 HARDCODED
```

**What to Replace** (Line 18-30):
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // 🔴 REPLACE THIS with your API call:
  setTimeout(() => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Mot de passe incorrect")
    }
    setIsLoading(false)
  }, 1000)
}
```

**Backend API Endpoint Needed**:
```typescript
POST /api/admin/login
{
  "password": string
}

Response:
{
  "success": boolean,
  "token": string,  // JWT token
  "message": string
}
```

**Integration Steps**:
1. Create secure admin authentication endpoint
2. Validate password against hashed value in database
3. Generate JWT token
4. Store token in `sessionStorage` or `httpOnly` cookie
5. Return success/error response

---

#### 4️⃣ **QR Code Scanner** (`/app/admin/dashboard/page.tsx`)

**Current Validation Logic** (Line 77-102):
```typescript
const handleScanQR = (data: string) => {
  // 🔴 Demo data - guests array is hardcoded
  const guest = guests.find(g => g.qrCode === data || g.id === data)
  
  if (guest) {
    if (guest.scanned) {
      setScanResult({ valid: false, guest, message: "⚠️ Déjà scanné!" })
    } else {
      setScanResult({ valid: true, guest, message: "✅ Valide!" })
    }
  } else {
    setScanResult({ valid: false, message: "❌ Invalide" })
  }
}
```

**Scanner Component** (`/components/qr-scanner.tsx`):
- **Line 83-84**: `const qrContent = code.data` - This variable stores the scanned QR code content
- **Line 85**: `console.log("QR Code scanné:", qrContent)` - Logs the scanned data
- **Line 89**: `onScan(qrContent)` - Sends data to parent component

**Backend API Endpoint Needed**:
```typescript
POST /api/admin/validate-qr
{
  "qrCode": string,
  "scannedBy": string,  // Admin ID
  "scannedAt": string   // ISO timestamp
}

Response:
{
  "valid": boolean,
  "alreadyScanned": boolean,
  "guest": {
    "id": string,
    "name": string,
    "phone": string,
    "passType": string,
    "bookingDate": string,
    "scanTime"?: string
  },
  "message": string
}
```

**Integration Steps**:
1. When QR code is scanned, `qrContent` variable contains the data
2. Send `qrContent` to your validation API
3. API checks if QR code exists in database
4. API checks if already scanned
5. If valid and not scanned, mark as scanned in DB
6. Return validation result
7. Display result to admin

---

#### 5️⃣ **Guest List Management** (`/app/admin/dashboard/page.tsx`)

**Current Demo Data** (Line 30-58):
```typescript
const [guests] = useState<Guest[]>([
  {
    id: "DT-2025-ABC123",
    name: "Jean Dupont",
    phone: "+237 6XX XXX XXX",
    passType: "ONE MAN",
    price: "15 000 FCFA",
    bookingDate: "2025-10-20",
    qrCode: "DT-PASS-ABC123",
    scanned: true,
    scanTime: "2025-10-22 20:30"
  },
  // ... more demo guests
])
```

**Backend API Endpoint Needed**:
```typescript
GET /api/admin/guests?search=&page=1&limit=50
Response:
{
  "guests": Guest[],
  "total": number,
  "page": number,
  "totalPages": number,
  "stats": {
    "total": number,
    "scanned": number,
    "pending": number,
    "revenue": number
  }
}
```

**Integration Steps**:
1. Replace `useState` with `useEffect` + API call
2. Fetch all bookings from database
3. Implement search/filter functionality
4. Calculate statistics (total, scanned, pending, revenue)
5. Update state with API data

---

### 🗄️ Database Schema Suggestion

```typescript
// Bookings Table
interface Booking {
  id: string                    // Primary key: "DT-2025-XXXXXXX"
  fullName: string
  phone: string
  passType: "ONE MAN" | "ONE LADY" | "FIVE QUEENS"
  price: number                 // In FCFA
  paymentOperator: "orange" | "mtn"
  paymentStatus: "pending" | "completed" | "failed"
  qrCode: string               // Unique QR code data
  qrCodeImage?: string         // QR code image URL
  scanned: boolean
  scanTime?: Date
  scannedBy?: string           // Admin ID
  bookingDate: Date
  createdAt: Date
  updatedAt: Date
}

// Admin Table
interface Admin {
  id: string
  password: string             // Hashed with bcrypt
  role: "admin" | "super_admin"
  createdAt: Date
  lastLogin?: Date
}
```

---

### 🔧 Environment Variables Needed

Create `.env.local` file:

```env
# Database
DATABASE_URL="your_database_connection_string"

# Payment APIs
ORANGE_MONEY_API_KEY="your_orange_money_key"
ORANGE_MONEY_API_SECRET="your_orange_money_secret"
MTN_MOMO_API_KEY="your_mtn_momo_key"
MTN_MOMO_API_SECRET="your_mtn_momo_secret"

# Admin
ADMIN_PASSWORD_HASH="your_bcrypt_hashed_password"
JWT_SECRET="your_jwt_secret_key"

# QR Code
QR_CODE_BASE_URL="https://api.qrserver.com/v1/create-qr-code/"
# Or use qrcode library for server-side generation

# App
NEXT_PUBLIC_SITE_URL="https://demontime.com"
NEXT_PUBLIC_EVENT_DATE="Novembre 2025"
NEXT_PUBLIC_EVENT_LOCATION="Pool Paradise, Douala"
NEXT_PUBLIC_EVENT_TIME="20h00 - 04h00"
```

---

### 📦 Recommended Backend Libraries

```json
{
  "dependencies": {
    "prisma": "^5.0.0",           // Database ORM
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",         // Password hashing
    "jsonwebtoken": "^9.0.0",     // JWT tokens
    "qrcode": "^1.5.0",           // QR code generation
    "axios": "^1.6.0"             // HTTP requests for payment APIs
  }
}
```

---

### 🚀 Quick Start for Backend Team

1. **Clone the repo** and install dependencies
2. **Run the frontend**: `pnpm dev` to see all flows
3. **Create API routes** in `/app/api/` directory
4. **Test each endpoint** with the frontend forms
5. **Replace demo data** with API calls one by one
6. **Test QR scanner** with real QR codes from your database

---

### 📞 Frontend Variables Reference

**Payment Form** (`payment-form.tsx`):
- `formData.fullName` - User's full name
- `formData.phone` - User's phone number
- `selectedOperator` - "orange" or "mtn"
- `passName` - Pass type (prop)
- `passPrice` - Pass price (prop)

**QR Scanner** (`qr-scanner.tsx`):
- `scannedData` - State variable storing QR code content
- `qrContent` - Local variable with scanned data (line 83)
- `onScan(qrContent)` - Callback sending data to parent

**Admin Dashboard** (`admin/dashboard/page.tsx`):
- `guests` - Array of all bookings
- `scanResult` - Current scan validation result
- `stats` - Dashboard statistics object

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Maintain component modularity
- Write descriptive commit messages

---

## 📄 License

This project is proprietary and confidential. All rights reserved © 2025 Demon Time.

---

## 👥 Team

**Demon Time Event Management**
- Event Planning & Coordination
- Technical Development
- Design & Branding

---

## 📞 Contact & Support

For inquiries about the event or technical support:
- **Email**: contact@demontime.com
- **Website**: [Coming Soon]
- **Social Media**: @DemonTime

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/)

---

<div align="center">

**Made with 🔥 by the Demon Time Team**

⭐ Star this repo if you like it!

</div>
