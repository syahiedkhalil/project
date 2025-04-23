import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(getInitialTheme())
  
  const isDark = computed(() => theme.value === 'dark')
  
  function setTheme(newTheme: string) {
    theme.value = newTheme
  }
  
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  
  function getInitialTheme(): string {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  }
  
  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
})