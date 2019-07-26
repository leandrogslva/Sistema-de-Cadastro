<template>
  <v-app style="height: 700px">
      <header-app ></header-app>
      <router-view></router-view>
  </v-app>
</template>

<script>
import header from './components/header.vue';

export default {
    components: {
      'header-app': header,
  }
}
</script>

<style>
</style>
