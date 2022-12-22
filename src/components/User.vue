<template>
  <q-btn flat :label="userStore.Username">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="logout">
          <q-item-section
            ><span><q-icon name="exit_to_app" class="q-mr-sm" />Logout</span></q-item-section
          >
          <!-- <q-btn flat size="sm" icon="exit_to_app" label="Logout" /> -->
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../pinia/userStore';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const logout = () => {
  userStore.$reset();
  const redirectUrl = `/${$route.query.redirect || 'login'}`;
  void $router.replace(redirectUrl);
};
</script>
