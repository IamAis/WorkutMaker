#Problemi
Il tasto Inizia a Creare > Crea Nuova Scheda è scollegato
La mail è opzionale ma va messa per forza
I clienti nn sono importabili | In alternativa se si inserisce un Cliente che nn abbiamo gia caricato. Il sistema ignora
Servono delle possibili modifiche di stile del'export
C'è la filigrana
la modalità giorno è troppo chiara

# Fitness Coach Workout Manager

A comprehensive full-stack application for fitness coaches to create, manage, and share workout plans with their clients.

## Project Overview

This is a React-based fitness management application with an Express.js backend. The app allows fitness coaches to:
- Create and manage client profiles
- Design detailed workout routines with exercises, sets, reps, and rest periods
- Organize workouts by days and weeks
- Generate PDF workout plans
- Track client progress

## Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Theme**: Dark/light mode support with next-themes

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Development**: tsx for hot reloading
- **Storage**: In-memory storage (configurable for database)
- **API**: RESTful endpoints under `/api` prefix

### Key Features
- **Multi-week workout planning**: Organize exercises by days and weeks
- **Exercise management**: Detailed exercise tracking with sets, reps, load, rest periods
- **Client management**: Store and organize client information
- **PDF generation**: Export workout plans as PDFs
- **Responsive design**: Mobile-first design with bottom navigation
- **Theme support**: Light and dark mode

## Project Structure

```
├── client/src/           # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and configuration
├── server/              # Backend Express application
│   ├── index.ts         # Main server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage interface
│   └── vite.ts          # Vite development setup
└── shared/              # Shared types and schemas
    └── schema.ts        # Zod schemas and TypeScript types
```

## Data Models

### Core Entities
- **Exercise**: Individual exercise with sets, reps, load, rest
- **Day**: Collection of exercises for a training day
- **Week**: Collection of days with a week number
- **Workout**: Complete workout plan with multiple weeks
- **Client**: Client profile information
- **CoachProfile**: Coach information and branding

### Validation
All data validation uses Zod schemas defined in `shared/schema.ts` with automatic TypeScript type inference.

## Development

### Commands
- `npm run dev`: Start development server (Express + Vite)
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: TypeScript type checking

### Environment
- Development server runs on port 5000
- Frontend and backend served from same port in development
- Hot reloading enabled for both frontend and backend

## Security & Best Practices

- Client/server separation with clear API boundaries
- Input validation using Zod schemas
- Type-safe development with TypeScript
- CORS and security headers configured
- Environment-based configuration

## Recent Changes

**Enhanced User Interface** (August 6, 2025)
- Created comprehensive main menu with navigation cards
- Added workout deletion functionality with confirmation dialogs
- Enhanced PDF export with coach profile branding
- Implemented image upload for exercises
- All menu buttons properly linked to respective pages
- Added floating action button for quick workout creation

**Migration from Replit Agent** (August 6, 2025) 
- Successfully migrated project to Replit environment
- Verified all dependencies are properly installed
- Confirmed server starts correctly on port 5000
- All core functionality working as expected

**Enhanced Workout Management** (August 6, 2025)
- Added nome scheda (workout name) field for better identification
- Implemented client selection from existing clients database
- Enhanced workout cards to display workout names prominently  
- Improved light mode visibility with better contrast and colors
- Updated glass-effect styling for better readability in day mode

**PDF Customization System** (August 6, 2025)
- Fixed optional email fields validation (truly optional now)
- Added customizable line color selector for PDF exports
- Implemented removable "Generato con FitTracker Pro" watermark
- Enhanced settings page with PDF personalization section
- Updated coach profile schema with pdfLineColor and showWatermark fields
- Removed large watermark, kept only small footer text controllable via settings

## User Preferences

- Language: Italian (UI text in Italian)
- Professional fitness coaching application
- Mobile-responsive design priority