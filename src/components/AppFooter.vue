<script setup lang="ts">
// Footer component
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p>&copy; {{ new Date().getFullYear() }} TaskMaster App. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--color-surface);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: var(--space-3) var(--space-2);
  margin-top: auto;
}

.dark .app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
}

.footer-links a {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}
</style>