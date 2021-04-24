<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container class="row justify-center">
      <div class="col-auto">
        <q-form @submit="onSubmit" @reset="onReset" style="min-width: 400px" class="q-mt-xl">
          <q-input
            filled
            v-model="username"
            label="User Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Username is required']"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password"
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
    <q-footer reveal bordered class="text-white" style="height: 24px">
      Tindecken
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
        context.root.$q.notify({
          type: 'positive',
          message: 'Login success !',
        });
      } catch (error) {
        err.value = error.data.message || 'Failed to authenticate, try later.';
        context.root.$q.notify({
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
    };
  },
});
</script>
