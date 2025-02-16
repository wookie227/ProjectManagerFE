<template>
  <n-layout>
    <Header />
    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header
  }
};
</script>
