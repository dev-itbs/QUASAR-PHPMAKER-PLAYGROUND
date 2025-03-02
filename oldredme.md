# Quasar App (quasar-phpmaker-playground)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# PHPMakerService

Workspace: Collecting workspace information

Based on your workspace, I'll create a detailed tutorial on how to add new databases and models following the established pattern:

# Database Integration Tutorial

## Database Structure Pattern

The project uses a modular database approach with the following structure:

```
src/databases/
├── base/
│   └── PHPMakerService.ts    # Base service for API operations
├── models/
│   ├── UAC/                  # User Access Control models
│   │   ├── index.ts
│   │   ├── User.ts
│   │   └── UserLevel.ts
│   └── KIOSK/               # Kiosk models
│       ├── index.ts
│       └── Kiosk.ts
├── config.ts                # Database configurations
├── UAC_DB.ts               # UAC database service
└── KIOSK_DB.ts            # KIOSK database service
```

## Step-by-Step Guide to Add a New Database

### 1. Add Database Configuration

First, add your new database configuration in

config.ts

:

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

Add proxy configuration in

quasar.config.js

:

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

## Usage Example

### Create a Management Page

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { NEW_DB } from '../databases/NEW_DB';
import { MyModel } from '../databases/models/NEW';

// Use the database service
const items = ref<MyModel[]>([]);

const loadItems = async () => {
  items.value = await NEW_DB('my_models').list();
};

// CRUD operations
const createItem = async (data: Partial<MyModel>) => {
  await NEW_DB('my_models').create(data);
};

const updateItem = async (id: number, data: Partial<MyModel>) => {
  await NEW_DB('my_models').update(id, data);
};

const deleteItem = async (id: number) => {
  await NEW_DB('my_models').delete(id);
};
</script>
```

## Key Features of the Database System

1. **Base Service**:

PHPMakerService

provides standard CRUD operations:

-

list()

: Get all records

-

get(id)

: Get single record

-

create(data)

: Create new record

-

update(id, data)

: Update existing record

-

delete(id)

: Delete record

-

bulkDelete(ids)

: Delete multiple records

-

export()

: Export data

-

search(params)

: Search records

2. **Type Safety**: The system uses TypeScript interfaces to ensure type safety:

   ```typescript
   // Example type-safe usage
   const userService = UAC_DB('users'); // Typed as User model
   const kioskService = KIOSK_DB('kiosks'); // Typed as Kiosk model
   ```

3. **API Response Format**: All responses follow the

ApiResponse

interface:

```typescript
interface ApiResponse<T> {
  success: boolean;
  version: string;
  action?: string;
  failureMessage?: string;
  totalRecordCount?: number;
  [key: string]: any;
}
```

4. **Pagination Support**:

PaginationParams

interface for list operations:

```typescript
interface PaginationParams {
  start?: number;
  recperpage?: number;
  order?: string;
  ordertype?: 'ASC' | 'DESC';
}
```

## Best Practices

1. Always create interfaces for your models
2. Use the base PHPMakerService for consistency
3. Keep models organized in their respective database folders
4. Export all models through the

index.ts

file 5. Follow the established naming conventions 6. Use TypeScript for type safety 7. Implement proper error handling 8. Use the provided pagination system

This pattern allows for easy scalability and maintenance of multiple databases while keeping the codebase consistent and type-safe.