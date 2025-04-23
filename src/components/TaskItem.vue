<script setup lang="ts">
import { ref } from 'vue'
import { Task } from '../types/Task'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps<{
  task: Task
}>()

const taskStore = useTaskStore()
const showOptions = ref(false)
const confirmDelete = ref(false)

const toggleOptions = () => {
  showOptions.value = !showOptions.value
  if (showOptions.value) {
    confirmDelete.value = false
  }
}

const toggleTaskCompletion = () => {
  taskStore.toggleTaskCompletion(props.task.id)
}

const deleteTask = () => {
  if (confirmDelete.value) {
    taskStore.deleteTask(props.task.id)
  } else {
    confirmDelete.value = true
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'priority-high'
    case 'medium': return 'priority-medium'
    case 'low': return 'priority-low'
    default: return ''
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const isOverdue = (dueDate: string | null) => {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const taskDate = new Date(dueDate)
  taskDate.setHours(0, 0, 0, 0)
  return taskDate < today && !props.task.completed
}
</script>

<template>
  <div class="task-item" :class="{ 'completed': task.completed }">
    <div class="task-main">
      <div class="task-checkbox">
        <input 
          type="checkbox" 
          :checked="task.completed" 
          @change="toggleTaskCompletion"
        />
      </div>
      
      <div class="task-content">
        <h3 class="task-title">{{ task.title }}</h3>
        <p class="task-description" v-if="task.description">{{ task.description }}</p>
        
        <div class="task-meta">
          <div 
            v-if="task.priority" 
            class="priority-badge" 
            :class="getPriorityClass(task.priority)"
          >
            {{ task.priority }}
          </div>
          
          <div v-if="task.dueDate" class="due-date" :class="{ 'overdue': isOverdue(task.dueDate) }">
            Due: {{ formatDate(task.dueDate) }}
          </div>
          
          <div class="task-tags" v-if="task.tags && task.tags.length > 0">
            <span v-for="tag in task.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      
      <div class="task-actions">
        <button class="icon-button" @click="toggleOptions">
          ⋮
        </button>
        
        <div class="options-menu" v-if="showOptions">
          <button @click="$emit('edit', task)">Edit</button>
          <button 
            @click="deleteTask" 
            :class="{ 'confirm-delete': confirmDelete }"
          >
            {{ confirmDelete ? 'Confirm Delete' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  background: var(--color-surface);
  border-radius: 8px;
  padding: var(--space-2);
  margin-bottom: var(--space-2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s, opacity 0.3s;
  border-left: 3px solid transparent;
}

.task-item:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-item.completed {
  opacity: 0.7;
  border-left-color: var(--color-success);
}

.task-main {
  display: flex;
  align-items: flex-start;
}

.task-checkbox {
  margin-right: var(--space-2);
  padding-top: 2px;
}

.task-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0 0 var(--space-1) 0;
  font-size: 1.1rem;
  transition: text-decoration 0.3s;
}

.completed .task-title {
  text-decoration: line-through;
  color: var(--color-text-light);
}

.task-description {
  margin-bottom: var(--space-1);
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  font-size: 0.8rem;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: capitalize;
}

.priority-high {
  background-color: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.priority-medium {
  background-color: rgba(245, 158, 11, 0.2);
  color: var(--color-warning);
}

.priority-low {
  background-color: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}

.due-date {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(59, 130, 246, 0.1);
}

.due-date.overdue {
  background-color: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--color-accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.task-actions {
  position: relative;
}

.icon-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  color: var(--color-text-light);
}

.icon-button:hover {
  color: var(--color-text);
  background: rgba(0, 0, 0, 0.05);
}

.dark .icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  min-width: 120px;
  overflow: hidden;
  animation: fadeIn 0.2s;
}

.options-menu button {
  width: 100%;
  text-align: left;
  padding: var(--space-1) var(--space-2);
  background: none;
  border: none;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.options-menu button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .options-menu button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.confirm-delete {
  color: var(--color-error) !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>