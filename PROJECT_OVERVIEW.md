# Kitchen SAAS Application - Complete Project Overview

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Core Components](#core-components)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [State Management](#state-management)
- [Styling and UI](#styling-and-ui)
- [Deployment Configuration](#deployment-configuration)

## Project Overview

Kitchen SAAS is an advanced 3D modeling application for kitchen design and planning. The application provides spatial visualization tools, AI-powered design assistance, and project management capabilities for kitchen designers and clients. It features a modern Next.js 16 frontend with TypeScript, Redux Toolkit for state management, MongoDB for data persistence, and NextAuth for authentication.

## Technology Stack

### Frontend Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript

### State Management
- **Redux Toolkit 2.11.2** - State management solution
- **React-Redux 9.2.0** - React bindings for Redux

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Database & Backend
- **MongoDB** - NoSQL database
- **Mongoose 9.1.2** - MongoDB object modeling
- **Next.js API Routes** - Server-side endpoints

### Authentication
- **NextAuth.js 4.24.13** - Authentication library
- **bcryptjs 3.0.3** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Sonner** - Toast notifications
- **UUID** - Unique identifier generation

## Directory Structure

```
kitchen-saas/
├── scripts/
│   └── seed.ts                 # Database seeding script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── measurements/
│   │   │   ├── projects/
│   │   │   └── settings/
│   │   ├── api/               # API routes
│   │   │   ├── auth[...nextauth]/
│   │   │   ├── generate/
│   │   │   ├── health/
│   │   │   └── projects/
│   │   ├── login/             # Login page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── kitchen/           # Kitchen design components
│   │   ├── modals/            # Modal components
│   │   ├── project-details/   # Project detail components
│   │   └── ui/                # Base UI components
│   ├── lib/                   # Application libraries
│   │   ├── features/          # Redux feature slices
│   │   │   ├── kitchens/      # Kitchen slice
│   │   │   └── ui/            # UI slice
│   │   ├── StoreProvider.tsx  # Redux store provider
│   │   ├── dbConnect.ts       # Database connection
│   │   ├── store.ts           # Redux store configuration
│   │   └── hooks.ts           # Custom React hooks
│   ├── models/                # Mongoose models
│   │   ├── Kitchen.ts         # Kitchen model
│   │   ├── Project.ts         # Project model
│   │   └── User.ts            # User model
│   ├── types/                 # TypeScript type definitions
│   │   └── kitchen.ts         # Kitchen-related types
│   └── proxy.ts               # Proxy configuration
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Database Models

### User Model (`src/models/User.ts`)
Manages user authentication and authorization:
- `_id`: ObjectId - Unique identifier
- `name`: String - User's display name
- `email`: String - User's email (unique)
- `password`: String - Hashed password
- `role`: String - User role ('admin' | 'user')
- `image`: String - Profile image URL

Features:
- Password hashing with bcrypt
- Role-based access control
- Email validation

### Project Model (`src/models/Project.ts`)
Manages project metadata:
- `_id`: ObjectId - Unique identifier
- `name`: String - Project name
- `client`: String - Client name
- `status`: String - Project status
- `progress`: Number - Progress percentage
- `img`, `url`, `github`: String - Project links
- `stars`: Number - Rating count
- `tags`: Array<String> - Project tags
- `owner`: ObjectId - Reference to User
- `timestamps`: createdAt, updatedAt

### Kitchen Model (`src/models/Kitchen.ts`)
Stores spatial design data:
- `_id`: ObjectId - Unique identifier
- `userId`: ObjectId - Reference to User (optional for seeding)
- `projectId`: ObjectId - Reference to Project
- `progress`: Number - Design progress
- `clientName`, `phone`, `address`: String - Client information
- `status`: String - Design status
- `walls`: Array - Wall definitions with dimensions
- `obstacles`: Array - Spatial obstacles (windows, doors, etc.)
- `appliances`: Array - Kitchen appliances
- `standards`: Object - Kitchen design standards
- `totalPrice`: Number - Estimated price
- `material`, `color`: String - Design attributes
- `generatedDesign`: Mixed - AI-generated design data
- `designHistory`: Array - Design history with timestamps

## API Endpoints

### Authentication (`/api/auth/[...nextauth]/route.ts`)
- Handles user authentication with NextAuth
- Supports credentials provider
- Admin account with special credentials
- Password encryption and verification

### Project Management (`/api/projects/`)

#### GET `/api/projects`
- Fetches all projects for the dashboard
- Seeding: Removed inline auto-seed; use `scripts/seed.ts` or the admin-only `POST /api/seed` to populate initial/demo data.
- Returns project metadata

#### POST `/api/projects`
- Creates new project and associated kitchen
- Requires authentication (TODO: implement in production)
- Returns created kitchen data

#### GET `/api/projects/[id]`
- Fetches specific project and its kitchen
- Returns both project and kitchen data

#### PUT `/api/projects/[id]`
- Updates kitchen spatial data
- Syncs project timestamp
- Upsert behavior for kitchen creation

#### DELETE `/api/projects/[id]`
- Deletes project and associated kitchen
- Returns success confirmation

#### PATCH `/api/projects/[id]`
- Updates project metadata
- Syncs relevant fields to kitchen
- Returns updated project

### AI Features (`/api/generate/`)
- `design/route.ts` - Generates AI-powered kitchen designs
- `image/route.ts` - Image generation endpoints
- `kitchen/route.ts` - Kitchen-specific AI operations

### Health Check (`/api/health/route.ts`)
- Validates application health
- Checks database connectivity

## Core Components

### Dashboard Components (`src/components/dashboard/`)
- **AICommandCenter**: AI-powered command interface
- **AICommandInput**: Natural language command input
- **EmptyDashboard**: Placeholder for empty states
- **MagicStatsCard**: Statistics cards with animations
- **ProjectGrid**: Grid layout for project cards
- **SidebarContainer**: Navigation sidebar container
- **SidebarGroup**: Grouped navigation items
- **SidebarLink**: Navigation links
- **SidebarProfile**: User profile in sidebar
- **sidebar.tsx**: Complete sidebar implementation

### Kitchen Design Components (`src/components/kitchen/`)
- **AIDesignGenerator**: AI-powered design generation
- **DraggableObstacle**: Draggable spatial obstacles
- **ElevationEngine**: 3D elevation rendering engine
- **ObstacleLayer**: Layer for spatial obstacles
- **ObstacleToolbox**: Toolbox for adding obstacles
- **PropertiesPanel**: Property editing panel
- **SpatialCanvas**: Canvas for spatial visualization
- **SpatialControls**: 3D navigation controls
- **SpatialEditor**: Main spatial editor component
- **SpatialInspector**: Inspector for selected objects
- **SpatialNode**: Node representation in spatial system
- **SpatialRegistry**: Registry for spatial components
- **WallManager**: Wall management utilities
- **WallNavigator**: Wall navigation tools

### Project Detail Components (`src/components/project-details/`)
- **ProjectHero**: Hero section for project details
- **ProjectInfo**: Project information display

### Modal Components (`src/components/modals/`)
- **FormButton**: Form submission button
- **GlobalCreateProjectModal**: Global project creation modal
- **ModalWrapper**: Modal wrapper component
- **ProjectForm**: Project creation form

### UI Components (`src/components/ui/`)
- **SignalLost**: Connection loss indicator
- **badge.tsx**: Badge component
- **button.tsx**: Button component
- **card.tsx**: Card component
- **dialog.tsx**: Dialog/popup component
- **input.tsx**: Input component
- **scroll-area.tsx**: Scrollable area component
- **separator.tsx**: Separator component

## State Management

### Redux Store (`src/lib/store.ts`)
Centralized state management using Redux Toolkit:
- **Root Reducer**: Combines all feature reducers
- **App Store**: Configured store with middleware
- **Type Definitions**: RootState, AppDispatch, AppStore types

### Feature Slices

#### Kitchen Slice (`src/lib/features/kitchens/kitchenSlice.ts`)
Manages all kitchen-related state:
- **State Properties**:
  - `items`: Array of kitchen projects
  - `currentKitchen`: Currently selected kitchen
  - `currentProject`: Current project data
  - `selectedObstacleId`: Selected obstacle ID
  - `activeWallIndex`: Active wall index
  - `loading`: Loading state
  - `error`: Error state

- **Async Thunks**:
  - `fetchAllKitchens`: Fetch all projects
  - `fetchKitchenById`: Fetch specific kitchen
  - `saveKitchen`: Save kitchen changes
  - `addProjectThunk`: Add new project
  - `deleteProjectThunk`: Delete project
  - `patchProjectThunk`: Update project metadata

- **Reducers**:
  - `setSelectedObstacle`: Set selected obstacle
  - `updateObstaclePosition`: Update obstacle position
  - `updateObstacleDetails`: Update obstacle details
  - `addObstacle`: Add new obstacle
  - `setActiveWallIndex`: Set active wall
  - `addWall`: Add new wall
  - `updateWall`: Update wall properties
  - `removeWall`: Remove wall
  - `applyDesign`: Apply AI design

#### UI Slice (`src/lib/features/ui/uiSlice.ts`)
Manages UI state:
- `isModalOpen`: Modal visibility state
- Actions: `openModal`, `closeModal`, `toggleModal`

### Store Provider (`src/lib/StoreProvider.tsx`)
Provides Redux store to the application:
- Initializes store with `makeStore`
- Wraps children with Provider
- Integrates with NextAuth SessionProvider

## Frontend Pages

### Dashboard Pages (`src/app/(dashboard)/`)
- **Dashboard Page**: Main dashboard with project overview
- **Inventory Page**: Inventory management
- **Measurements Page**: Measurement tools
- **Projects Page**: Project listing
- **Settings Page**: User settings

### Project Pages (`src/app/(dashboard)/projects/[id]/`)
- **Dynamic Route**: Loads specific project by ID
- **Spatial Editor**: 3D kitchen design interface
- **Project Details**: Project information display

### Authentication Pages (`src/app/login/`)
- **Login Page**: User authentication interface
- **NextAuth Integration**: Secure authentication flow

## Styling and UI

### Global Styles (`src/app/globals.css`)
- Tailwind CSS base styles
- Custom CSS variables
- Responsive design utilities

### Theme Management
- **ThemeProvider**: Context for theme management
- **ThemeToggle**: Component for switching themes
- Dark/light mode support

### Animation and Effects
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling
- **Custom Animations**: Project-specific effects

## Environment Configuration

### Required Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: NextAuth secret key
- `GOOGLE_GEMINI_API_KEY`: Google Gemini API key (for AI features)

### Next.js Configuration (`next.config.ts`)
- React compiler plugin
- Experimental features
- Asset optimization

### TypeScript Configuration (`tsconfig.json`)
- Strict type checking
- Path aliases (`@/*` → `./src/*`)
- Module resolution settings

## Deployment Configuration

### Production Ready Features
- Database connection pooling
- Error boundaries
- Authentication middleware
- API rate limiting
- Session management

### Build Process
- Next.js static export capability
- Optimized bundle sizes
- Tree shaking for unused code
- Image optimization

## Security Features

### Authentication
- Secure password hashing
- Session management
- Role-based access control
- JWT token handling

### Input Validation
- Type-safe inputs
- Sanitization of user data
- Rate limiting on API endpoints

### Database Security
- Mongoose schema validation
- Index optimization
- Query sanitization

## Performance Optimizations

### Caching Strategies
- Database query caching
- API response caching
- Component memoization

### Bundle Optimization
- Code splitting
- Lazy loading of components
- Tree shaking

### Database Optimization
- Proper indexing
- Efficient queries
- Connection pooling

## Testing Strategy

### Unit Tests
- Component testing
- Redux store testing
- API endpoint testing

### Integration Tests
- End-to-end workflows
- Authentication flows
- Database operations

## Future Enhancements

### Planned Features
- Real-time collaboration
- Advanced 3D rendering
- VR/AR integration
- Advanced AI design capabilities
- Mobile application
- Offline support
- Advanced reporting

### Scalability Considerations
- Microservices architecture
- CDN integration
- Database sharding
- Load balancing