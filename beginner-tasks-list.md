# Beginner Tasks List: Getting Started with Quasar-PHPMaker Integration

This is a structured set of progressive tasks designed to help new developers become familiar with the Quasar-PHPMaker project structure. Each task builds on the previous one, guiding you through connecting to databases, displaying data, and implementing CRUD operations.

## Prerequisites
- Development environment set up (Node.js, npm/yarn installed)
- Access to PHPMaker backend or ability to create one
- Basic understanding of TypeScript and Vue.js

## Task 1: Connect to an Existing Database
**Objective:** Connect the application to an existing PHPMaker database.

1. **Review the existing database connections**
   - Study `src/databases/config.ts` to understand how connections are configured
   - Examine `src/databases/UAC_DB.ts` and `src/databases/KIOSK_DB.ts` as examples

2. **Configure a new database connection**
   - Create a new entry in `DB_CONFIGS` in `src/databases/config.ts` for an existing database
   - Set up the proxy in `quasar.config.ts` for local development

3. **Test the connection**
   - Create a simple script to test the connection
   - Verify in browser console that no connection errors occur

**Deliverable:** Successfully connected application to a database with correct configuration.

## Task 2: Define Data Models
**Objective:** Create TypeScript interfaces for existing PHPMaker tables.

1. **Analyze the database schema**
   - Use PHPMaker interface or database tools to examine table structure
   - Identify primary keys, data types, and relationships

2. **Create model interfaces**
   - Create a new folder `src/databases/models/YOUR_DB/` 
   - Define TypeScript interfaces for each table
   - Create an `index.ts` file to export all models with proper typing

**Example:**
```typescript
// src/databases/models/INVENTORY/Product.ts
export interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
}

// src/databases/models/INVENTORY/index.ts
export * from './Product';

export interface INVENTORYModels {
  products: Product;
  // Add other models
}
```

**Deliverable:** Complete set of TypeScript interfaces representing the database schema.

## Task 3: Create a Database Service
**Objective:** Implement a service to interact with the database.

1. **Create a database service file**
   - Create a file `src/databases/YOUR_DB.ts`
   - Implement the service using PHPMakerService

2. **Example:**
```typescript
// src/databases/INVENTORY_DB.ts
import { PHPMakerService } from './base/PHPMakerService';
import { DB_CONFIGS } from './config';
import type { INVENTORYModels } from './models/INVENTORY';

export function INVENTORY_DB<T extends keyof INVENTORYModels>(model: T) {
  return new PHPMakerService<INVENTORYModels[T]>(
    DB_CONFIGS.INVENTORY_DB.baseUrl,
    model.toLowerCase()
  );
}
```

**Deliverable:** Functional database service that can be used to access the database.

## Task 4: Create a List Table Component
**Objective:** Display data from the database in a table.

1. **Create a new page component**
   - Create a file `src/pages/ProductListPage.vue`
   - Implement a table using q-table to display products

2. **Load data using your database service**
   - Use the service created in Task 3 to fetch data
   - Implement pagination, sorting, and filtering

3. **Add the page to routing**
   - Update `src/router/routes.ts` to include your new page

**Example skeleton:**
```vue
<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        :rows="products"
        :columns="columns"
        :loading="loading"
        row-key="product_id"
        :pagination="pagination"
        @request="onRequest"
      >
        <!-- Table content -->
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { INVENTORY_DB } from 'src/databases/INVENTORY_DB';
import { Product } from 'src/databases/models/INVENTORY';

// Table data and methods
</script>
```

**Deliverable:** A functional page displaying database records in a table with pagination.

## Task 5: Implement a Registration Form
**Objective:** Create a form to add new records to the database.

1. **Create a form component**
   - Create a new component or add to existing page
   - Implement form fields based on your data model
   - Add validation for required fields

2. **Connect form submission to database service**
   - Use the `create` method from your database service
   - Handle success and error states
   - Provide user feedback with q-notify

**Example for a dialog form:**
```vue
<q-dialog v-model="showDialog">
  <q-card style="min-width: 500px">
    <q-card-section>
      <div class="text-h6">Add New Product</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <!-- Form fields -->
        <q-input
          v-model="form.name"
          label="Product Name"
          :rules="[(val) => !!val || 'Name is required']"
        />
        <!-- More fields -->
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Save" type="submit" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</q-dialog>
```

**Deliverable:** Working form for adding new records with validation.

## Task 6: Complete CRUD Operations
**Objective:** Implement the full set of CRUD operations.

1. **Add edit functionality**
   - Create a form for editing existing records
   - Populate the form with selected record data
   - Update records using the database service

2. **Implement delete functionality**
   - Add delete buttons to the table
   - Create a confirmation dialog
   - Remove records using the database service

3. **Implement view details**
   - Create a view to display full record details
   - Fetch individual records using the database service

**Example for delete confirmation:**
```javascript
const confirmDelete = (id: number) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this record?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await INVENTORY_DB('products').delete(id);
      loadData(); // Refresh table
      $q.notify({
        type: 'positive',
        message: 'Record successfully deleted',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error deleting record',
      });
    }
  });
};
```

**Deliverable:** Complete CRUD functionality for the selected database table.

## Task 7: Add Navigation and Integration
**Objective:** Integrate your new pages into the main application.

1. **Update the main navigation**
   - Add links to your new pages in `MainLayout.vue`
   - Set appropriate icons and labels

2. **Add access control (if applicable)**
   - Ensure pages respect authentication
   - Add route guards if needed

**Example for adding navigation links:**
```typescript
// Add to authenticatedLinks in MainLayout.vue
{
  title: 'Products',
  caption: 'Product Management',
  icon: 'inventory',
  link: '/#/products',
},
```

**Deliverable:** Fully integrated pages with proper navigation.

## Task 8: Implement Bulk Operations (Advanced)
**Objective:** Add functionality for operations on multiple records.

1. **Add selection capability to the table**
   - Enable row selection in q-table
   - Add a toolbar for bulk actions

2. **Implement bulk delete**
   - Create a method to delete multiple records
   - Use the `bulkDelete` method from the database service

3. **Implement other bulk actions**
   - Add capability to update status for multiple records
   - Implement export functionality

**Deliverable:** Enhanced functionality with bulk operations.

## Task 9: Add Search and Filtering
**Objective:** Implement search and advanced filtering.

1. **Add a search bar**
   - Implement a search input above the table
   - Connect it to the database service's search method

2. **Add advanced filters**
   - Create filter controls for different fields
   - Implement filtering logic with the API

**Deliverable:** Improved user experience with search and filtering capabilities.

## Task 10: Testing and Refinement
**Objective:** Ensure your implementation is robust and user-friendly.

1. **Test all CRUD operations**
   - Verify each operation works correctly
   - Test edge cases and validation

2. **Improve error handling**
   - Add comprehensive error messages
   - Implement proper error recovery

3. **Enhance the user interface**
   - Add loading indicators
   - Improve form layouts
   - Add confirmations for important actions

**Deliverable:** A polished, fully-functional module integrated into the application.

---

## Additional Resources

- Refer to the project documentation for detailed information about the architecture
- Study the existing implementations of `UserManagementPage.vue` and `KioskManagmentPage.vue`
- Review the `PHPMakerService.ts` to understand available methods

## Tips for Success

- Start with a simple table before adding complexity
- Test database connections early to ensure everything is configured correctly
- Use browser developer tools to debug API calls
- Validate form data before submission to prevent errors
- Follow existing code patterns and naming conventions
- Leverage Quasar components for consistent UI
