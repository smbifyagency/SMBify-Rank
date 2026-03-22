# LocalSite Builder

## Overview
LocalSite Builder is a web application designed to help local businesses create professional, SEO-optimized websites with integrated blog functionality. It provides an intuitive form-based interface for users to input business details, select templates, generate AI-powered blog content, and download complete website packages. The platform supports dynamic page creation for locations and services, comprehensive local SEO optimization with advanced schema markup, and an integrated blog system with AI content generation. The project aims to offer small and medium-sized businesses an affordable and robust online presence to enhance their market reach and visibility.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application employs a full-stack architecture with distinct frontend and backend components.

### Core Architecture
- **Frontend**: React-based Single-Page Application (SPA) built with Vite.
- **Backend**: Express.js REST API server.
- **Database**: PostgreSQL with Drizzle ORM.
- **UI Framework**: Tailwind CSS integrated with shadcn/ui components.

### Frontend Specifications
- **Technology Stack**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack Query.
- **Form Handling**: React Hook Form with Zod for validation.
- **Styling**: Tailwind CSS, utilizing CSS variables for theming.
- **UI Components**: shadcn/ui library built on Radix UI primitives.
- **Visual Design**: Features dynamic hero background colors, professional typography with gradient effects, glass morphism elements, enhanced card designs, distinct color schemes, and integrated FontAwesome icons.

### Backend Specifications
- **Technology Stack**: Express.js server with TypeScript.
- **ORM**: Drizzle ORM for PostgreSQL interactions.
- **Validation**: Zod schemas.
- **File Generation**: JSZip for downloadable website packages.

### System Design and Features
- **Website Schema**: Stores business data and template choices.
- **Business Categories**: Over 270 categories with competition indicators.
- **Template System**: 10 predefined, responsive templates.
- **Dynamic Pages**: Generation of multiple SEO-optimized, location-specific and service-specific HTML pages.
- **SEO Optimization**: Implements LocalBusiness, Organization, Service, FAQ, and Breadcrumb schema markup; advanced meta tags (title, description, Open Graph, Twitter Cards, geo-targeting); and optimized content structure for local keywords.
- **Tracking Code Injection System**: Admin-managed tracking codes (Google Analytics, Search Console, Facebook Pixel, Google Ads, Ahrefs, custom scripts) automatically injected into ALL generated website pages. Supports 5 placement locations (head, body_start, body_end, header, footer) with individual enable/disable controls. All HTML generators (main, location, service, blog archive, blog posts) inject tracking codes site-wide for consistent analytics and verification across all pages.
- **User Interface**: Features a compact FAQ form, integrated Google Maps embedding, and customizable Call-to-Action (CTA) buttons.
- **Live Preview**: Real-time website preview with desktop/mobile views.
- **AI Content Generation**: Automated population of website form fields, including hero sections, business descriptions, services, SEO content, FAQs, testimonials, meta tags, and comprehensive blog posts. Supports content generation for all dynamic pages (service and location pages).
- **Blog System**: Integrated blog functionality with preview, editing, rich text editor, and AI regeneration.
- **Role-Based Access Control**: Differentiates between "AI Users" (unlimited website creation, full AI API access) and "Manual Users" (limited website creation, manual form-only access).
- **Netlify Deployment**: Integration with Netlify for website deployment, including custom domain support.
- **Monetization**: Implemented Google AdSense monetization with admin management system. Public access model where users provide their own API keys (OpenAI, Gemini, Netlify, Unsplash) stored securely per session.

## External Dependencies

### Frontend Libraries
- `@radix-ui/*`
- `@tanstack/react-query`
- `@hookform/resolvers`
- `class-variance-authority`
- `cmdk`
- `date-fns`
- `embla-carousel-react`
- `lucide-react`
- `wouter`
- `zod`

### Backend Libraries
- `@neondatabase/serverless`
- `drizzle-orm`
- `drizzle-kit`
- `express`
- `express-session`
- `jszip`
- `zod`
- `connect-pg-simple`

### AI/External APIs
- OpenAI API
- Google Gemini API
- OpenRouter API
- Netlify API
- Unsplash API
- Google AdSense
- Google Maps Embed API