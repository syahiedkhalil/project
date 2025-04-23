<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/themeStore'

const router = useRouter()
const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const navigateTo = (path: string) => {
  router.push(path)
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo" @click="navigateTo('/')">
        <h1>TaskMaster</h1>
      </div>
      
      <nav class="desktop-nav">
        <ul>
          <li><a href="#" @click.prevent="navigateTo('/')">Tasks</a></li>
          <li><a href="#" @click.prevent="navigateTo('/about')">About</a></li>
        </ul>
      </nav>
      
      <div class="header-actions">
        <button class="icon-button theme-toggle" @click="toggleTheme">
          <span v-if="themeStore.isDark">🌞</span>
          <span v-else>🌙</span>
        </button>
        
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <span class="menu-icon" :class="{ 'open': mobileMenuOpen }"></span>
        </button>
      </div>
    </div>
    
    <div class="mobile-nav" :class="{ 'open': mobileMenuOpen }">
      <ul>
        <li><a href="#" @click.prevent="navigateTo('/')">Tasks</a></li>
        <li><a href="#" @click.prevent="navigateTo('/about')">About</a></li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  cursor: pointer;
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-primary);
}

.desktop-nav {
  display: none;
}

.desktop-nav ul {
  display: flex;
  list-style: none;
  gap: var(--space-3);
}

.desktop-nav a {
  color: var(--color-text);
  font-weight: 500;
  transition: color 0.2s;
}

.desktop-nav a:hover {
  color: var(--color-primary);
}

.header-actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.icon-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}

.icon-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  position: relative;
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  transition: background-color 0.3s;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  transition: transform 0.3s;
}

.menu-icon::before {
  transform: translateY(-8px);
}

.menu-icon::after {
  transform: translateY(8px);
}

.menu-icon.open {
  background-color: transparent;
}

.menu-icon.open::before {
  transform: translateY(0) rotate(45deg);
}

.menu-icon.open::after {
  transform: translateY(0) rotate(-45deg);
}

.mobile-nav {
  background-color: var(--color-surface);
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s, padding 0.3s;
}

.mobile-nav.open {
  max-height: 300px;
  padding: var(--space-2);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .mobile-nav.open {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-nav ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.mobile-nav a {
  color: var(--color-text);
  font-weight: 500;
  display: block;
  padding: var(--space-1);
}

@media (min-width: 768px) {
  .desktop-nav {
    display: block;
  }
  
  .mobile-menu-button {
    display: none;
  }
  
  .mobile-nav {
    display: none;
  }
  
  .logo h1 {
    font-size: 1.8rem;
  }
}
</style>