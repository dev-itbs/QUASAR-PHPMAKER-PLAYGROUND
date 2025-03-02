<!-- src/pages/LoginPage.vue -->
<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="Username"
            :disable="loading"
            outlined
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            :disable="loading"
            outlined
          />

          <div class="q-mt-md">
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              :loading="loading"
              class="full-width"
            />
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = computed(() => authStore.loading);

const form = ref({
  username: '',
  password: '',
});

const onSubmit = async () => {
  try {
    await authStore.login(form.value);
    const redirectPath = (route.query.redirect as string) || '/';
    router.push(redirectPath);
  } catch (error) {
    console.error('Login error:', error);
  }
};
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>
