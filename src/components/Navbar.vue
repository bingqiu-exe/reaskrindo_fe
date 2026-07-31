<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/home/">
          <img src="@/assets/logo-askrindo-ifg.png" alt="Logo" class="logo-image" />
        </router-link>
      </div>

      <!-- Navigation & Dropdowns Wrapper -->
      <div class="nav-right">
        <!-- ASUM Dropdown -->
        <div class="header-actions" ref="asumDropdownRef">
          <button @click.stop="toggleDropdown('asum')" class="nav-dropdown-btn" :class="{ 'active': activeDropdown === 'asum' || startsWith('/spread-asum') }">
            <span>Asum</span>
            <ChevronDownIcon class="chevron-icon" />
          </button>
          
          <div v-if="activeDropdown === 'asum'" class="dropdown-menu">
            <router-link to="/spread-asum/premi" class="dropdown-item" @click="closeDropdowns">Premi</router-link>
            <router-link to="/spread-asum/klaim" class="dropdown-item" @click="closeDropdowns">Klaim</router-link>
          </div>
        </div>

        <!-- Finance Dropdown -->
        <div class="header-actions" ref="financeDropdownRef">
          <button @click.stop="toggleDropdown('finance')" class="nav-dropdown-btn" :class="{ 'active': activeDropdown === 'finance' || startsWith('/spread-finance') }">
            <span>Finansial</span>
            <ChevronDownIcon class="chevron-icon" />
          </button>
          
          <div v-if="activeDropdown === 'finance'" class="dropdown-menu">
            <router-link to="/spread-finance/premi" class="dropdown-item" @click="closeDropdowns">Premi</router-link>
            <router-link to="/spread-finance/klaim" class="dropdown-item" @click="closeDropdowns">Klaim</router-link>
          </div>
        </div>

        <!-- KP Dropdown -->
        <div class="header-actions" ref="kpDropdownRef">
          <button @click.stop="toggleDropdown('kp')" class="nav-dropdown-btn" :class="{ 'active': activeDropdown === 'kp' || startsWith('/spread-kp') }">
            <span>Kredit Program</span>
            <ChevronDownIcon class="chevron-icon" />
          </button>
          
          <div v-if="activeDropdown === 'kp'" class="dropdown-menu">
            <router-link to="/spread-kp/premi" class="dropdown-item" @click="closeDropdowns">Premi</router-link>
            <router-link to="/spread-kp/klaim" class="dropdown-item" @click="closeDropdowns">Klaim</router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDownIcon } from 'lucide-vue-next';

const route = useRoute();

const activeDropdown = ref(null);

const asumDropdownRef = ref(null);
const financeDropdownRef = ref(null);
const kpDropdownRef = ref(null);

const isExact = (path) => route.path === path;
const startsWith = (prefix) => route.path.startsWith(prefix);

const toggleDropdown = (menu) => {
  activeDropdown.value = activeDropdown.value === menu ? null : menu;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

const handleClickOutside = (event) => {
  const isInsideAsum = asumDropdownRef.value?.contains(event.target);
  const isInsideFinance = financeDropdownRef.value?.contains(event.target);
  const isInsideKp = kpDropdownRef.value?.contains(event.target);

  if (!isInsideAsum && !isInsideFinance && !isInsideKp) {
    closeDropdowns();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-image {
  height: 42px;
  width: auto;
  display: block;
  object-fit: contain;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.main-nav a {
  text-decoration: none;
  color: #334155;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.main-nav a:hover,
.main-nav a.active {
  color: #1e3a8a;
}

.header-actions {
  position: relative;
}

.nav-dropdown-btn {
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-dropdown-btn:hover,
.nav-dropdown-btn.active {
  color: #1e3a8a;
}

.chevron-icon {
  width: 16px;
  height: 16px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.dropdown-item {
  padding: 8px 16px;
  color: #334155;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8fafc;
  color: #1e3a8a;
}
</style>