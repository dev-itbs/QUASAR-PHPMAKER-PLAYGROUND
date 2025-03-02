# Quasar-PHPMaker Integration Documentation

## Table of Contents
- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Setup](#project-setup)
- [Database Integration](#database-integration)
- [Authentication](#authentication)
- [Key Features](#key-features)
- [Components](#components)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Future Development](#future-development)

## Introduction

This project integrates a Quasar frontend with PHPMaker-generated API backends. It provides a structured framework for building modern web applications that interact with PHPMaker's API endpoints, offering a type-safe and organized approach to development.

## Project Overview

The application is built using:
- **Quasar Framework v2**: A Vue.js framework for building responsive Single Page Applications
- **TypeScript**: For type-safe development
- **Pinia**: For state management
- **Vue Router**: For navigation
- **Axios**: For API communication
- **PHPMaker**: As the backend API generator

The project follows a modular approach with clear separation of concerns between UI components, API services, database models, and application state.

## Architecture

### Directory Structure

```
src/
├── boot/                   # Initialization modules
│   └── axios.ts            # Axios configuration
├── components/             # Vue components
├── databases/              # Database integration layer
│   ├── base/               # Base services
│   │   └── PHPMakerService.ts  # Generic service for API operations
│   ├── models/             # Data models
│   │   ├── UAC/            # User Access Control models
│   │   └── KIOSK/          # Kiosk-related models
│   ├── config.ts           # Database configurations
│   ├── UAC_DB.ts           # UAC database service
│   └── KIOSK_DB.ts         # KIOSK database service
├── layouts/                # Application layouts
│   └── MainLayout.vue      # Main application layout with navigation
├── pages/                  # Application pages
├── router/                 # Route definitions
├── services/               # Additional service modules
├── stores/                 # Pinia stores
│   └── auth.ts             # Authentication store
└── types/                  # TypeScript type definitions
```

### Data Flow

1. **User Interface**: Vue components in `pages/` and `components/` folders
2. **State Management**: Pinia stores in the `stores/` folder manage application state
3. **API Integration**: Database services in `databases/` folder handle API requests
4. **Backend Communication**: PHPMaker-generated API endpoints receive and process requests

## Project Setup

### Prerequisites

- Node.js (v14+)
- Yarn or npm
- PHPMaker backend with API endpoints enabled

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd quasar-phpmaker-playground

# Install dependencies
yarn
# or
npm install
```

### Configuration

The project uses Vite environment variables for configuration, defined in `quasar.config.ts`:

```typescript
env: {
  VITE_API_URL: ctx.dev ? '' : 'https://dict-r8-kiosk.itbsstudio.com',
  ENCRYPTION_KEY: 'superrandomkeyyoucanneverguess', // encryption for indexed db
},
```

For local development, the project is configured to use proxies to avoid CORS issues:

```typescript
devServer: {
  port: 9000,
  proxy: {
    // User Access Control application
    '/UAC': {
      target: 'http://dict-kiosk.local',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/UAC': '/UAC',
      },
    },
    '/KIOSK': {
      target: 'http://dict-kiosk.local',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/KIOSK': '/KIOSK',
      },
    },
  },
},
```

### Running the Application

```bash
# Start development server
yarn quasar dev
# or
npx quasar dev

# Build for production
yarn quasar build
# or
npx quasar build
```

## Database Integration

The project uses a modular database approach with a clean abstraction layer for API operations.

### Database Configuration

Database endpoints are configured in `src/databases/config.ts`:

```typescript
export const DB_CONFIGS = {
  UAC_DB: {
    baseUrl: '/UAC/api',
  },
  KIOSK_DB: {
    baseUrl: '/KIOSK/api',
  },
} as const;
```

### Models

Data models are defined using TypeScript interfaces in `src/databases/models/` and organized by database:

```typescript
// src/databases/models/UAC/User.ts
export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  // Other properties...
}
```

### Service Layer

The `PHPMakerService` class provides a generic implementation of CRUD operations for all models:

```typescript
// Example usage
const userService = UAC_DB('users');
const users = await userService.list();
const user = await userService.get(1);
const newUser = await userService.create(userData);
await userService.update(1, updatedData);
await userService.delete(1);
```

## Authentication

The application uses JWT-based authentication with PHPMaker's built-in authentication API.

### Authentication Store

Authentication state is managed by a Pinia store in `src/stores/auth.ts`:

```typescript
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    loading: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(credentials) { /* ... */ },
    async logout() { /* ... */ },
    // Other actions...
  },
});
```

### Route Guards

Protected routes are secured with navigation guards in `src/router/index.ts`:

```typescript
Router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});
```

## Key Features

### Type-Safe API Integration

The project uses TypeScript interfaces to provide type safety for API operations:

```typescript
// Type-safe database service usage
const kioskService = KIOSK_DB('kiosks'); // Typed as Kiosk model
const userService = UAC_DB('users');     // Typed as User model
```

### Modular Database Approach

Each database is encapsulated with its own service and models, allowing for clear organization and scalability.

### Robust CRUD Operations

The PHPMakerService provides comprehensive CRUD operations:

- **list()**: Get all records with optional pagination
- **get(id)**: Get a single record by ID
- **create(data)**: Create a new record
- **update(id, data)**: Update an existing record
- **delete(id)**: Delete a record
- **bulkDelete(ids)**: Delete multiple records
- **export()**: Export data
- **search(params)**: Search records with custom parameters

### Responsive UI Components

Quasar components are used throughout the application, providing a responsive and consistent UI:

- Q-tables for data display with sorting and pagination
- Q-forms for data input with validation
- Q-dialogs for confirmations and modal forms
- Q-notifications for user feedback

## Components

### Main Layout (`MainLayout.vue`)

The main layout includes:
- Header with application title and user menu
- Side drawer with navigation links
- Responsive design that adapts to different screen sizes

### User Management (`UserManagementPage.vue`)

A complete CRUD interface for managing user data:
- List users in a table with sorting and pagination
- Create new users
- Edit existing user data
- Delete users with confirmation

### Kiosk Management (`KioskManagmentPage.vue`)

Similar to the User Management component, but for kiosk data:
- List kiosks with status indicators
- Add/edit kiosk information
- Delete kiosks with confirmation

### Login Page (`LoginPage.vue`)

A simple login form that interacts with the authentication store.

## Adding a New Database

Follow these steps to add a new database integration:

### 1. Add Database Configuration

First, add your new database configuration in `src/databases/config.ts`:

```typescript
export const DB_CONFIGS = {
  UAC_DB: {
    baseUrl: '/UAC/api',
  },
  KIOSK_DB: {
    baseUrl: '/KIOSK/api',
  },
  // Add your new database
  NEW_DB: {
    baseUrl: '/NEW/api',
  },
} as const;
```

### 2. Create Model Interfaces

Create a new folder for your models in `src/databases/models/NEW/`:

```typescript
// src/databases/models/NEW/MyModel.ts
export interface MyModel {
  id: number;
  name: string;
  // ... other fields
}

// src/databases/models/NEW/index.ts
export * from './MyModel';

export interface NEWModels {
  my_models: MyModel;
  // Add other models
}
```

### 3. Create Database Service

Create a new database service file:

```typescript
// src/databases/NEW_DB.ts
import { PHPMakerService } from './base/PHPMakerService';
import { DB_CONFIGS } from './config';
import type { NEWModels } from './models/NEW';

export function NEW_DB<T extends keyof NEWModels>(model: T) {
  return new PHPMakerService<NEWModels[T]>(
    DB_CONFIGS.NEW_DB.baseUrl,
    model.toLowerCase()
  );
}
```

### 4. Update Dev Server Configuration

Add proxy configuration in `quasar.config.ts`:

```javascript
devServer: {
  proxy: {
    '/NEW': {
      target: 'http://your-backend.local',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/NEW': '/NEW',
      },
    },
  },
},
```

## Best Practices

### 1. Type Safety

Always use TypeScript interfaces for models and API responses to ensure type safety.

```typescript
// Good
interface User {
  user_id: number;
  username: string;
  // Other properties...
}

// Avoid
const user: any = { /* ... */ };
```

### 2. Service Abstraction

Use the provided service layer to interact with the API rather than making direct axios calls.

```typescript
// Good
const users = await UAC_DB('users').list();

// Avoid
const { data } = await api.get('/UAC/api/list/users');
```

### 3. State Management

Use Pinia stores for state that needs to be shared across components.

```typescript
// Good
const authStore = useAuthStore();
if (authStore.isAuthenticated) { /* ... */ }

// Avoid
if (localStorage.getItem('token')) { /* ... */ }
```

### 4. Error Handling

Implement proper error handling for API calls and user feedback.

```typescript
try {
  await userService.create(userData);
  $q.notify({
    type: 'positive',
    message: 'User created successfully',
  });
} catch (error) {
  console.error('Error creating user:', error);
  $q.notify({
    type: 'negative',
    message: 'Failed to create user',
  });
}
```

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the API:

1. Check the API URL configuration in `quasar.config.ts`
2. Ensure the proxy settings are correct for development
3. Verify that the PHPMaker API is running and accessible
4. Check browser console for CORS or network errors

### Authentication Problems

If you're experiencing authentication issues:

1. Check that the token is being correctly stored in localStorage
2. Verify that the X-Authorization header is being set on API requests
3. Confirm that the PHPMaker API's JWT authentication is properly configured

### Type Errors

If you encounter TypeScript errors:

1. Ensure your model interfaces match the API's actual data structure
2. Check that you're using the correct model type with each database service
3. Run `tsc --noEmit` to verify type correctness across the project

## Future Development

Potential enhancements for the project:

1. Implement file upload functionality for user photos and other media
2. Add support for real-time data with WebSockets
3. Enhance the authentication system with role-based access control
4. Implement data caching for improved performance
5. Add comprehensive unit and integration tests
6. Create a mobile app version using Quasar's Capacitor integration

## Conclusion

This Quasar-PHPMaker integration provides a robust foundation for building modern web applications with a strong focus on type safety, code organization, and developer experience. By following the patterns established in this project, you can efficiently develop and maintain complex applications that leverage PHPMaker's API capabilities with a modern frontend framework.
