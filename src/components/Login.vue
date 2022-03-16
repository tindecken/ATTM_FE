<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container class="row justify-center">
      <div class="col-auto">
        <div>{{ userStore.Username }}</div>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          style="min-width: 400px"
          class="q-mt-xl"
        >
          <q-input
            filled
            v-model="username"
            label="User Name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Username is required',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
            ]"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </q-page-container>
    <q-footer reveal bordered class="text-white" style="height: 24px">
      Tindecken
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../pinia/userStore';

export default defineComponent({
  name: 'Login',
  components: {},
  setup() {
    const $q = useQuasar();
    const $route = useRoute();
    const $router = useRouter();
    const username = ref('');
    const password = ref('');
    const err = ref('');
    const userStore = useUserStore();
    const onSubmit = async () => {
      const actionPayload = {
        Username: username.value,
        Password: password.value,
      };
      try {
        await userStore.login(actionPayload);
        const redirectUrl = `/${$route.query.redirect || 'home'}`;
        void $router.replace(redirectUrl);
        $q.notify({
          type: 'positive',
          message: 'Login success !',
        });
      } catch (error: any) {
        err.value = error.data.message || 'Failed to authenticate, try later.';
        $q.notify({
          type: 'warning',
          message: err.value,
        });
      }
    };
    function onReset() {
      username.value = '';
      password.value = '';
    }
    return {
      username,
      password,
      onSubmit,
      onReset,
      userStore,
    };
  },
});
</script>
