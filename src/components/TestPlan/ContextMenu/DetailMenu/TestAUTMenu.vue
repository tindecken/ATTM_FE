<template>
  <base-menu>
    <template #default>
    </template>
  </base-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseMenu from './BaseMenu.vue'

export default defineComponent({
  name: 'TestAUTMenu',
  props: {
  },
  components: { BaseMenu },
  setup() {
    return {
    }
  },
})
</script>
