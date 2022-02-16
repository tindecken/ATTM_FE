<template>
    <router-view/>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, onBeforeMount } from 'vue';
import { Dark } from 'quasar';
import { useUserStore } from './pinia/userStore'
import { useTestClientStore } from './pinia/testClientStore'

export default defineComponent({
  name: 'App',
  setup() {
    const $store = useStore()
    const userStore = useUserStore()
    const testClientStore = useTestClientStore()
    userStore.$subscribe(() => {
      localStorage.setItem('user', JSON.stringify({
        Id: userStore.Id,
        Token: userStore.Token,
        Username: userStore.Username,
        Role: userStore.Role,
        Email: userStore.Email,
        DidAutoLogout: userStore.DidAutoLogout,
      }))
    })
    testClientStore.$subscribe(() => {
      localStorage.setItem('testClient', JSON.stringify(
        {
          testClients: testClientStore.testClients,
          selectedTestClient: testClientStore.selectedTestClient,
        },
      ))
    })
    onBeforeMount(() => {
      const theme = $store.getters['global/darkTheme'];
      Dark.set(theme);
    });
  },
});
</script>
