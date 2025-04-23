<script setup lang="ts">
import { ref, computed } from 'vue'
import TaskItem from '../components/TaskItem.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskFilter from '../components/TaskFilter.vue'
import { useTaskStore } from '../stores/taskStore'
import { Task } from '../types/Task'

const taskStore = useTaskStore()
const showTaskForm = ref(false)
const editingTask = ref<Task | undefined>(undefined)

const isEditing = computed(() => Boolean(editingTask.value))

const closeForm = () => {
  showTaskForm.value = false
  editingTask.value = undefined
}

const openNewTaskForm = () => {
  editingTask.value = undefined
  showTaskForm.value = true
}

const editTask = (task: Task) => {
  editingTask.value = task
  showTaskForm.value = true
}
</script>

<template>
  <div class="home-container">
    <div class="page-header">
      <h1>My Tasks</h1>
      <button @click="openNewTaskForm">Add New Task</button>
    </div>
    
    <TaskFilter />
    
    <div class="tasks-container">
      <div v-if="taskStore.filteredTasks.length === 0" class="no-tasks">
        <p>No tasks found. Create your first task to get started!</p>
        <button @click="openNewTaskForm">Create Task</button>
      </div>
      
      <transition-group name="task-list" tag="div" class="tasks-list">
        <TaskItem 
          v-for="task in taskStore.filteredTasks" 
          :key="task.id" 
          :task="task"
          @edit="editTask"
        />
      </transition-group>
    </div>
    
    <div class="modal" v-if="showTaskForm">
      <div class="modal-backdrop" @click="closeForm"></div>
      <div class="modal-content">
        <TaskForm 
          :task="editingTask" 
          :isEditing="isEditing" 
          @close="closeForm"
          @save="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.page-header h1 {
  margin: 0;
}

.no-tasks {
  text-align: center;
  padding: var(--space-4);
  background-color: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.no-tasks p {
  margin-bottom: var(--space-2);
  color: var(--color-text-light);
}

.tasks-list {
  display: flex;
  flex-direction: column;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-2);
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 600px;
  z-index: 1001;
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>