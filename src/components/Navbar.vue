<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo-askrindo-ifg.png" alt="Logo" class="logo-image" />
        </router-link>
      </div>

      <!-- Navigation Wrapper -->
      <nav class="nav-right">
        <!-- AUTO MAPPING -->
        <div class="header-actions">
          <router-link to="/auto-mapping/" class="nav-btn">
            <span>Auto Mapping</span>
          </router-link>
        </div>

        <!-- ASUM Dropdown -->
        <div class="header-actions" ref="asumDropdownRef">
          <button 
            @click.stop="toggleDropdown('asum')" 
            class="nav-dropdown-btn" 
            :class="{ 'active': activeDropdown === 'asum' || startsWith('/spread-asum') }"
          >
            <span>Asum</span>
            <ChevronDownIcon class="chevron-icon" :class="{ 'rotated': activeDropdown === 'asum' }" />
          </button>
          <div v-if="activeDropdown === 'asum'" class="dropdown-menu">
            <router-link to="/spread-asum/premi" class="dropdown-item" @click="closeDropdowns">Premi</router-link>
            <router-link to="/spread-asum/klaim" class="dropdown-item" @click="closeDropdowns">Klaim</router-link>
          </div>
        </div>

        <!-- Finance Dropdown -->
        <div class="header-actions" ref="financeDropdownRef">
          <button 
            @click.stop="toggleDropdown('finance')" 
            class="nav-dropdown-btn" 
            :class="{ 'active': activeDropdown === 'finance' || startsWith('/spread-finance') }"
          >
            <span>Finance</span>
            <ChevronDownIcon class="chevron-icon" :class="{ 'rotated': activeDropdown === 'finance' }" />
          </button>
          <div v-if="activeDropdown === 'finance'" class="dropdown-menu">
            <router-link to="/spread-finance/premi" class="dropdown-item" @click="closeDropdowns">Premi</router-link>
            <router-link to="/spread-finance/klaim" class="dropdown-item" @click="closeDropdowns">Klaim</router-link>
          </div>
        </div>

      </nav>
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

  if (!isInsideAsum && !isInsideFinance) {
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
/* Load Inter Font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet');

/* Apply modern font stack to header and force buttons/links to inherit it */
.app-header,
.app-header button,
.app-header a {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Remove all link underlines */
a {
  text-decoration: none;
}

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

.logo-link {
  display: flex;
  align-items: center;
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
  gap: 16px;
}

.header-actions {
  position: relative;
}

/* Base Nav Items (Identical styling for links and buttons) */
.nav-btn,
.nav-dropdown-btn {
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  line-height: 1.2;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* Hover & Active States */
.nav-btn:hover,
.nav-dropdown-btn:hover {
  color: #1e3a8a;
  background-color: #f8fafc;
}

.router-link-active.nav-btn,
.nav-dropdown-btn.active {
  color: #1e3a8a;
  font-weight: 600;
  background-color: #eff6ff;
}

/* Chevron Animations */
.chevron-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* Dropdown Menu Styling */
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
  z-index: 60;
}

.dropdown-item {
  padding: 8px 16px;
  color: #334155;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8fafc;
  color: #1e3a8a;
}

.dropdown-item.router-link-active {
  background-color: #eff6ff;
  color: #1e3a8a;
  font-weight: 600;
}
</style>