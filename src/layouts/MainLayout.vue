<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Quasar App </q-toolbar-title>

        <!-- Add user menu -->
        <q-space />
        <q-btn-dropdown
          v-if="isAuthenticated"
          flat
          color="white"
          icon="person"
          class="q-ml-sm"
        >
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <!-- Show these links only when authenticated -->
        <template v-if="isAuthenticated">
          <EssentialLink
            v-for="link in authenticatedLinks"
            :key="link.title"
            v-bind="link"
          />
        </template>

        <!-- Show these links when not authenticated -->
        <template v-if="!isAuthenticated">
          <EssentialLink
            v-for="link in publicLinks"
            :key="link.title"
            v-bind="link"
          />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

// Public links (visible when not logged in)
const publicLinks: EssentialLinkProps[] = [
  {
    title: 'Login',
    caption: 'Login to access the system',
    icon: 'login',
    link: '/#/login',
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
];

// Authenticated links (visible when logged in)
const authenticatedLinks: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    caption: 'Overview',
    icon: 'dashboard',
    link: '/',
  },
  {
    title: 'Kiosk',
    caption: 'Kiosk Managament',
    icon: 'shopping_cart',
    link: '/#/kiosk-management',
  },
  {
    title: 'Users',
    caption: 'User Mangement',
    icon: 'people',
    link: '/#/user-management',
  },
  // Add other authenticated links here
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function handleLogout() {
  try {
    // Show confirmation dialog
    $q.dialog({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      await authStore.logout();

      $q.notify({
        type: 'positive',
        message: 'Successfully logged out',
        position: 'top',
      });

      // Redirect to login page
      router.push('/login');
    });
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Logout failed',
      position: 'top',
    });
  }
}
</script>

<style lang="scss">
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>
