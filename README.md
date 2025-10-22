# 🔥 Devil Pool - Demon Time Event Platform

<div align="center">

![Demon Time](https://img.shields.io/badge/Demon%20Time-Pool%20Party-FF0000?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

**A premium event ticketing and reservation platform for exclusive pool party experiences**

[Live Demo](#) • [Features](#features) • [Installation](#installation) • [Tech Stack](#tech-stack)

</div>

---

## 📋 Overview

**Devil Pool** is a modern, full-featured event management platform designed for the "Demon Time" pool party series. The application provides a seamless ticket booking experience with QR code-based entry validation, multiple pass tiers, and an elegant dark-themed UI that captures the essence of exclusive nightlife events.

### 🎯 Key Highlights

- **🎫 Multi-Tier Pass System**: Three distinct pass types (One Man, One Lady, Five Queens)
- **📱 QR Code Integration**: Secure entry validation system
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

### 🔐 Security & Validation
- Unique QR codes for each ticket
- No QR code = No entry policy
- Secure reservation system

### 🎨 User Experience
- Immersive hero section with high-quality imagery
- Smooth animations and transitions
- Interactive pass selection cards
- Mobile-first responsive design
- Dark mode optimized interface

### 🛠️ Technical Features
- Server-side rendering (SSR)
- Type-safe development with TypeScript
- Component-based architecture
- Form validation with Zod
- Modern React hooks
- Optimized image loading

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
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage with hero & passes
│   ├── passes/              # Pass selection pages
│   │   ├── one-man/
│   │   ├── one-lady/
│   │   ├── five-queens/
│   │   └── page.tsx
│   ├── reservation/         # Reservation flow
│   │   └── page.tsx
│   └── globals.css          # Global styles & CSS variables
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui components
│   ├── navbar.tsx           # Navigation component
│   └── theme-provider.tsx   # Theme context provider
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                     # Utility functions
│   └── utils.ts
├── public/                  # Static assets
│   └── *.jpg                # Event images
├── styles/                  # Additional stylesheets
├── components.json          # shadcn/ui configuration
├── next.config.mjs          # Next.js configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
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

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero section and pass preview |
| `/passes` | All available passes overview |
| `/passes/one-man` | ONE MAN pass details & booking |
| `/passes/one-lady` | ONE LADY pass details & booking |
| `/passes/five-queens` | FIVE QUEENS pass details & booking |
| `/reservation` | Reservation form and checkout |

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
