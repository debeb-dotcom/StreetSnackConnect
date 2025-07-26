# SupplyLink - Supply Chain Management Platform

## Overview

SupplyLink is a full-stack web application built for supply chain management, connecting vendors with suppliers for efficient product sourcing and ordering. The platform features role-based access for vendors, suppliers, and admins, with comprehensive product management, order tracking, and verification systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **UI Framework**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with shadcn/ui design system
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Session Management**: In-memory storage with localStorage persistence

### Authentication System
- Simple email/password authentication
- Role-based access control (vendor, supplier, admin)
- Client-side token storage in localStorage
- Protected routes with role-based redirects

## Key Components

### Database Schema
- **Users**: Core user management with roles (vendor/supplier/admin)
- **Suppliers**: Business profile extension for supplier users
- **Categories**: Product categorization system
- **Products**: Supplier inventory management
- **Orders**: Transaction and fulfillment tracking
- **Reviews**: Rating and feedback system

### Role-Based Dashboards
- **Vendor Dashboard**: Product browsing, price comparison, order management
- **Supplier Dashboard**: Product management, order fulfillment
- **Admin Dashboard**: User verification, platform analytics

### Core Features
- Product catalog with category-based organization
- Geolocation-based supplier discovery
- Real-time price comparison across suppliers
- Order lifecycle management with status tracking
- Supplier verification system
- Review and rating system

## Data Flow

### Authentication Flow
1. User submits login/registration form
2. Client validates with Zod schemas
3. Server authenticates against PostgreSQL
4. User data and supplier profile (if applicable) returned
5. Client stores user data in localStorage and context

### Product Management Flow
1. Suppliers create/update products through dashboard
2. Data validated with shared Zod schemas
3. Products stored in PostgreSQL with category relationships
4. Real-time updates via React Query invalidation
5. Vendors browse products with filtering and search

### Order Processing Flow
1. Vendors place orders through product interface
2. Order data validated and stored with status tracking
3. Suppliers receive orders in their dashboard
4. Status updates propagated through React Query
5. Order completion triggers review system

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production build optimization
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Development Setup
- Uses Vite dev server with HMR for frontend
- TSX for running TypeScript server code
- Shared schema between client and server
- Environment-based configuration

### Production Build
- Vite builds client-side React application
- ESBuild bundles server code for Node.js
- Static assets served from `/dist/public`
- Server runs on Node.js with Express

### Database Management
- Drizzle migrations in `/migrations` directory
- Schema definitions in `/shared/schema.ts`
- Database URL configuration via environment variables
- PostgreSQL dialect with Neon Database provider

### File Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

The application uses a monorepo structure with clear separation between frontend, backend, and shared code, enabling type safety across the full stack while maintaining modularity and scalability.