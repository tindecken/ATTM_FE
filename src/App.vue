<template>
    <router-view/>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import { Dark } from 'quasar';
import { useUserStore } from './pinia/userStore'
import { useTestClientStore } from './pinia/testClientStore'
import { useGlobalStore } from './pinia/globalStore';

export default defineComponent({
  name: 'App',
  setup() {
    const globalStore = useGlobalStore()
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
    globalStore.$subscribe(() => {
      localStorage.setItem('global', JSON.stringify({
        darkTheme: globalStore.darkTheme,
      }))
      Dark.set(globalStore.darkTheme);
    })
    onBeforeMount(() => {
      const user = localStorage.getItem('user')
      if (user) {
        userStore.Id = JSON.parse(user).Id
        userStore.Token = JSON.parse(user).Token
        userStore.Username = JSON.parse(user).Username
        userStore.Role = JSON.parse(user).Role
        userStore.Email = JSON.parse(user).Email
        userStore.DidAutoLogout = JSON.parse(user).DidAutoLogout
      }
      const globalStorage = localStorage.getItem('global')
      if (globalStorage) {
        globalStore.darkTheme = JSON.parse(globalStorage).darkTheme
      }
    });
  },
});
</script>
