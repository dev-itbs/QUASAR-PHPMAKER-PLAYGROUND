<!-- src/components/UserManagementPage.vue -->
<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        :rows="users"
        :columns="columns"
        :loading="loading"
        row-key="user_id"
        :pagination="pagination"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-btn color="primary" label="New User" @click="showDialog = true" />
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            {{ getUserFullName(props.row) }}
          </q-td>
        </template>

        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.is_active ? 'positive' : 'negative'"
              text-color="white"
            >
              {{ props.row.is_active ? 'Active' : 'Inactive' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-group flat>
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                @click="editUser(props.row)"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row.user_id)"
              />
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ editingUser ? 'Edit' : 'New' }} User</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.username"
                  label="Username"
                  :rules="[(val) => !!val || 'Username is required']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.email"
                  label="Email"
                  type="email"
                  :rules="[
                    (val) => !!val || 'Email is required',
                    (val) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                      'Invalid email',
                  ]"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.first_name" label="First Name" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.last_name" label="Last Name" />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.user_level_id"
                  :options="userLevels"
                  option-label="name"
                  option-value="user_level_id"
                  label="User Level"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || 'User level is required']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.reports_to_user_id"
                  :options="users"
                  option-label="username"
                  option-value="user_id"
                  label="Reports To"
                  emit-value
                  map-options
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.mobile_number" label="Mobile Number" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.country" label="Country" />
              </div>
            </div>

            <q-toggle v-model="form.is_active" label="Active User" />

            <q-input
              v-model="form.profile"
              type="textarea"
              label="Profile"
              rows="3"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { UAC_DB } from '../databases/UAC_DB';
import {
  type User,
  type UserLevel,
  type UserFormData,
  getUserFullName,
} from '../databases/models/UAC';

const $q = useQuasar();

const users = ref<User[]>([]);
const userLevels = ref<UserLevel[]>([]);
const loading = ref(false);
const showDialog = ref(false);
const editingUser = ref<number | null>(null);

const form = ref<UserFormData>({
  username: '',
  email: '',
  first_name: null,
  last_name: null,
  country: null,
  is_active: true,
  user_level_id: null,
  reports_to_user_id: null,
  photo: null,
  mobile_number: null,
  profile: null,
});

const pagination = ref({
  sortBy: 'username',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

// Add the onRequest handler
const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;
  try {
    // Convert to API pagination params
    const params = {
      start: (page - 1) * rowsPerPage + 1,
      recperpage: rowsPerPage,
      order: sortBy || 'username',
      ordertype: descending ? 'DESC' : 'ASC',
    };

    // Load data
    const data = await UAC_DB('users').list(params);
    users.value = data;

    // Update pagination rowsNumber
    pagination.value = {
      ...props.pagination,
      rowsNumber: data.length, // If your API returns total count, use that instead
    };
  } catch (error) {
    console.error('Error loading users:', error);
    $q.notify({
      type: 'negative',
      message: 'Error loading users',
    });
  } finally {
    loading.value = false;
  }
};

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: (row) => getUserFullName(row),
    sortable: true,
  },
  { name: 'username', label: 'Username', field: 'username', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'is_active', label: 'Status', field: 'is_active', sortable: true },
  {
    name: 'user_level',
    label: 'User Level',
    field: (row) =>
      userLevels.value.find((ul) => ul.user_level_id === row.user_level_id)
        ?.name,
    sortable: true,
  },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
];

onMounted(async () => {
  await Promise.all([loadUsers(), loadUserLevels()]);
});

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await UAC_DB('users').list();
  } finally {
    loading.value = false;
  }
};

const loadUserLevels = async () => {
  try {
    userLevels.value = await UAC_DB('user_levels').list();
  } catch (error) {
    console.error('Error loading user levels:', error);
    $q.notify({
      type: 'negative',
      message: 'Error loading user levels',
    });
  }
};

const editUser = (user: User) => {
  editingUser.value = user.user_id;
  form.value = { ...user };
  showDialog.value = true;
};

const onSubmit = async () => {
  try {
    if (editingUser.value) {
      await UAC_DB('users').update(editingUser.value, form.value);
    } else {
      await UAC_DB('users').create(form.value);
    }
    showDialog.value = false;
    resetForm();
    await loadUsers();
  } catch (error) {
    console.error('User save error:', error);
    $q.notify({
      type: 'negative',
      message: 'Error saving user',
    });
  }
};

const confirmDelete = (id: number) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this user?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await UAC_DB('users').delete(id);
    await loadUsers();
  });
};

const resetForm = () => {
  form.value = {
    username: '',
    email: '',
    first_name: null,
    last_name: null,
    country: null,
    is_active: true,
    user_level_id: null,
    reports_to_user_id: null,
    photo: null,
    mobile_number: null,
    profile: null,
  };
  editingUser.value = null;
};
</script>
