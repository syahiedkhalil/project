<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const router = useRouter()

onMounted(() => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    themeStore.setTheme(savedTheme)
  }
})

watch(() => themeStore.isDark, () => {
  document.documentElement.classList.toggle('dark', themeStore.isDark)
  localStorage.setItem('theme', themeStore.theme)
})
</script>

<template>
  <div class="app-container" :class="{ 'dark': themeStore.isDark }">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .main-content {
    padding: 2rem;
  }
}
</style>