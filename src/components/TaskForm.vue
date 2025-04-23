<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Task, TaskCreateInput, TaskPriority } from '../types/Task'
import { useTaskStore } from '../stores/taskStore'

const taskStore = useTaskStore()

const props = defineProps<{
  task?: Task
  isEditing?: boolean
}>()

const emit = defineEmits(['close', 'save'])

const formData = reactive<TaskCreateInput>({
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  tags: [],
  dueDate: null
})

const tagInput = ref('')
const formErrors = ref<Record<string, string>>({})

onMounted(() => {
  if (props.task && props.isEditing) {
    formData.title = props.task.title
    formData.description = props.task.description
    formData.completed = props.task.completed
    formData.priority = props.task.priority
    formData.tags = [...props.task.tags]
    formData.dueDate = props.task.dueDate
  }
})

const addTag = () => {
  if (tagInput.value.trim() && !formData.tags.includes(tagInput.value.trim())) {
    formData.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  formData.tags = formData.tags.filter(t => t !== tag)
}

const validateForm = (): boolean => {
  formErrors.value = {}
  
  if (!formData.title.trim()) {
    formErrors.value.title = 'Title is required'
  }
  
  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  if (props.isEditing && props.task) {
    taskStore.updateTask(props.task.id, formData)
  } else {
    taskStore.createTask(formData)
  }
  
  emit('save')
  emit('close')
}
</script>

<template>
  <div class="task-form-container">
    <div class="task-form-header">
      <h2>{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>
      <button class="close-button" @click="$emit('close')">✕</button>
    </div>
    
    <form @submit.prevent="handleSubmit" class="task-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          type="text" 
          id="title" 
          v-model="formData.title" 
          placeholder="Task title"
          :class="{ 'error': formErrors.title }"
        />
        <span class="error-message" v-if="formErrors.title">{{ formErrors.title }}</span>
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="formData.description" 
          placeholder="Task details"
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" v-model="formData.priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input 
            type="date" 
            id="dueDate" 
            v-model="formData.dueDate"
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="tags">Tags</label>
        <div class="tag-input-container">
          <input 
            type="text" 
            id="tags" 
            v-model="tagInput"
            placeholder="Add a tag and press Enter"
            @keyup.enter.prevent="addTag"
          />
          <button type="button" class="tag-add-button" @click="addTag">Add</button>
        </div>
        
        <div class="tags-list" v-if="formData.tags.length > 0">
          <span 
            v-for="tag in formData.tags" 
            :key="tag" 
            class="tag"
          >
            {{ tag }}
            <button type="button" class="tag-remove" @click="removeTag(tag)">✕</button>
          </span>
        </div>
      </div>
      
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="formData.completed" />
          <span>Mark as completed</span>
        </label>
      </div>
      
      <div class="form-actions">
        <button type="button" class="secondary" @click="$emit('close')">Cancel</button>
        <button type="submit">{{ isEditing ? 'Update Task' : 'Create Task' }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.task-form-container {
  background-color: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  animation: slideIn 0.3s;
}

.task-form-header {
  padding: var(--space-2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .task-form-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-light);
}

.task-form {
  padding: var(--space-2);
}

.form-group {
  margin-bottom: var(--space-2);
}

.form-row {
  display: flex;
  gap: var(--space-2);
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: var(--space-1);
  font-weight: 500;
}

input[type="text"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
}

.dark input[type="text"],
.dark input[type="date"],
.dark textarea,
.dark select {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus,
select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

input.error,
textarea.error,
select.error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
}

.checkbox-group {
  margin-top: var(--space-2);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

.tag-input-container {
  display: flex;
  gap: 8px;
}

.tag-add-button {
  flex-shrink: 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--space-1);
}

.tag {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--color-accent);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0 2px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: var(--space-1);
  }
}
</style>