<script setup lang="ts">
// About page component
</script>

<template>
  <div class="about-container">
    <h1>About TaskMaster</h1>
    
    <div class="about-content card">
      <h2>Welcome to TaskMaster!</h2>
      <p>
        TaskMaster is a powerful task management application built with Vue 3 and TypeScript.
        This application helps you organize your daily tasks, prioritize your work, and track
        your progress towards your goals.
      </p>
      
      <h3>Features</h3>
      <ul class="features-list">
        <li>
          <strong>Task Creation and Management</strong>
          <p>Create, edit, and delete tasks with ease. Add descriptions, due dates, priorities, and tags.</p>
        </li>
        <li>
          <strong>Task Filtering and Sorting</strong>
          <p>Filter tasks by status, priority, and tags. Search for specific tasks using the search function.</p>
        </li>
        <li>
          <strong>Dark and Light Mode</strong>
          <p>Choose between dark and light mode based on your preference or system settings.</p>
        </li>
        <li>
          <strong>Data Persistence</strong>
          <p>Your tasks are automatically saved to your browser's local storage.</p>
        </li>
      </ul>
      
      <h3>Technologies Used</h3>
      <ul class="tech-list">
        <li>Vue 3 with Composition API</li>
        <li>TypeScript for type safety</li>
        <li>Pinia for state management</li>
        <li>Vue Router for navigation</li>
        <li>Vite for fast development</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  padding: var(--space-3);
}

.features-list,
.tech-list {
  padding-left: var(--space-3);
  margin: var(--space-2) 0;
}

.features-list li {
  margin-bottom: var(--space-2);
}

.features-list p {
  margin-top: 4px;
  color: var(--color-text-light);
}

.tech-list li {
  margin-bottom: 8px;
}
</style>