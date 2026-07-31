<template>
  <footer class="app-footer">
    <div class="footer-content">
      <span class="copyright">
        © {{ currentYear }} Askrindo. Hak Cipta Dilindungi.
      </span>
      <span class="credits">
        Made by <b>bingqiu-exe</b>
      </span>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background-color: #fafafa;
  border-top: 1px solid #f1f5f9;
  padding: 16px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
}

.credits b {
  color: #475569;
}
</style>