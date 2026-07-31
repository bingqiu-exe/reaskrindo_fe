<template>
  <div id="app-wrapper" class="app-wrapper">
    <Navbar />

    <main class="main-content">
      <router-view />
    </main>

    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const route = useRoute();

const showFooter = computed(() => {
  return route.meta?.hideFooter !== true;
});
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>