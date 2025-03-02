<!-- src/components/KioskManagementPage.vue -->
<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        :rows="kiosks"
        :columns="columns"
        :loading="loading"
        row-key="kiosk_id"
        :pagination="pagination"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-btn color="primary" label="New Kiosk" @click="showDialog = true" />
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
                @click="editKiosk(props.row)"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row.kiosk_id)"
              />
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 700px">
        <q-card-section>
          <div class="text-h6">{{ editingKiosk ? 'Edit' : 'New' }} Kiosk</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.name"
                  label="Kiosk Name"
                  :rules="[(val) => !!val || 'Name is required']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.location_name"
                  label="Location Name"
                  :rules="[(val) => !!val || 'Location name is required']"
                />
              </div>
            </div>

            <q-input
              v-model="form.address"
              type="textarea"
              label="Address"
              rows="2"
              :rules="[(val) => !!val || 'Address is required']"
            />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.latitude"
                  label="Latitude"
                  type="number"
                  step="any"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.longitude"
                  label="Longitude"
                  type="number"
                  step="any"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.marker_id"
                  label="Marker ID"
                  type="number"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.assistant_id"
                  label="Assistant ID"
                  type="number"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.weather_api_key"
                  label="Weather API Key"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.weather_location_id"
                  label="Weather Location ID"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.background_image"
                  label="Background Image"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.logo_image" label="Logo Image" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.video" label="Video" />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.security_code"
                  label="Security Code"
                  :type="showPassword ? 'text' : 'password'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-toggle v-model="form.is_active" label="Active Kiosk" />
              </div>
            </div>
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
import { KIOSK_DB } from '../databases/KIOSK_DB';
import { type Kiosk, type KioskFormData } from '../databases/models/KIOSK';

const $q = useQuasar();

const kiosks = ref<Kiosk[]>([]);
const loading = ref(false);
const showDialog = ref(false);
const showPassword = ref(false);
const editingKiosk = ref<number | null>(null);

const form = ref<KioskFormData>({
  name: '',
  location_name: '',
  address: '',
  latitude: 0,
  longitude: 0,
  marker_id: null,
  background_image: null,
  logo_image: null,
  video: null,
  assistant_id: null,
  weather_api_key: null,
  weather_location_id: null,
  is_active: true,
  security_code: null,
});

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  {
    name: 'location_name',
    label: 'Location',
    field: 'location_name',
    sortable: true,
  },
  { name: 'address', label: 'Address', field: 'address' },
  { name: 'is_active', label: 'Status', field: 'is_active', sortable: true },
  { name: 'created_at', label: 'Created', field: 'created_at', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
];

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;
  try {
    const params = {
      start: (page - 1) * rowsPerPage + 1,
      recperpage: rowsPerPage,
      order: sortBy || 'name',
      ordertype: descending ? 'DESC' : 'ASC',
    };

    const data = await KIOSK_DB('kiosks').list(params);
    kiosks.value = data;

    pagination.value = {
      ...props.pagination,
      rowsNumber: data.length,
    };
  } catch (error) {
    console.error('Error loading kiosks:', error);
    $q.notify({
      type: 'negative',
      message: 'Error loading kiosks',
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadKiosks();
});

const loadKiosks = async () => {
  loading.value = true;
  try {
    kiosks.value = await KIOSK_DB('kiosks').list();
  } catch (error) {
    console.error('Error loading kiosks:', error);
    $q.notify({
      type: 'negative',
      message: 'Error loading kiosks',
    });
  } finally {
    loading.value = false;
  }
};

const editKiosk = (kiosk: Kiosk) => {
  editingKiosk.value = kiosk.kiosk_id;
  form.value = { ...kiosk };
  showDialog.value = true;
};

const onSubmit = async () => {
  try {
    if (editingKiosk.value) {
      await KIOSK_DB('kiosks').update(editingKiosk.value, form.value);
    } else {
      await KIOSK_DB('kiosks').create(form.value);
    }
    showDialog.value = false;
    resetForm();
    await loadKiosks();
    $q.notify({
      type: 'positive',
      message: `Kiosk successfully ${
        editingKiosk.value ? 'updated' : 'created'
      }`,
    });
  } catch (error) {
    console.error('Kiosk save error:', error);
    $q.notify({
      type: 'negative',
      message: 'Error saving kiosk',
    });
  }
};

const confirmDelete = (id: number) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this kiosk?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await KIOSK_DB('kiosks').delete(id);
      await loadKiosks();
      $q.notify({
        type: 'positive',
        message: 'Kiosk successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting kiosk:', error);
      $q.notify({
        type: 'negative',
        message: 'Error deleting kiosk',
      });
    }
  });
};

const resetForm = () => {
  form.value = {
    name: '',
    location_name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    marker_id: null,
    background_image: null,
    logo_image: null,
    video: null,
    assistant_id: null,
    weather_api_key: null,
    weather_location_id: null,
    is_active: true,
    security_code: null,
  };
  editingKiosk.value = null;
};
</script>
