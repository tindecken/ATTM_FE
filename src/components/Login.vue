<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container>
      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="username"
            label="User Name *"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Username is required']"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password *"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Password is required']"
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

    <q-footer reveal bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          @Tindecken 2020
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'Login',
  components: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const username = ref('');
    const password = ref('');
    const err = ref('');
    const onSubmit = async () => {
      const actionPayload = {
        username: username.value,
        password: password.value,
      };
      try {
        await context.root.$store.dispatch('auth/login', actionPayload);
        const redirectUrl = `/${context.root.$route.query.redirect || 'home'}`;
        context.root.$router.replace(redirectUrl);
      } catch (error) {
        err.value = error.message || 'Failed to authenticate, try later.';
        context.root.$q.notify({ message: err.value });
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
    };
  },
});
</script>
