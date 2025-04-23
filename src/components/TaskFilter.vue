<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { TaskPriority } from '../types/Task'

const taskStore = useTaskStore()
const searchInput = ref(taskStore.filter.searchTerm)
const selectedStatus = ref(taskStore.filter.status)
const selectedPriority = ref(taskStore.filter.priority)
const selectedTags = ref<string[]>([...taskStore.filter.tags])
const showTagsDropdown = ref(false)

// Update filter when inputs change
watch(searchInput, (newValue) => {
  taskStore.setFilter({ searchTerm: newValue })
})

watch(selectedStatus, (newValue) => {
  taskStore.setFilter({ status: newValue })
})

watch(selectedPriority, (newValue) => {
  taskStore.setFilter({ priority: newValue as '' | TaskPriority })
})

watch(selectedTags, (newValue) => {
  taskStore.setFilter({ tags: [...newValue] })
})

const toggleTagSelection = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearFilters = () => {
  searchInput.value = ''
  selectedStatus.value = 'all'
  selectedPriority.value = ''
  selectedTags.value = []
  taskStore.resetFilter()
}

const toggleTagsDropdown = () => {
  showTagsDropdown.value = !showTagsDropdown.value
}
</script>

<template>
  <div class="task-filter">
    <div class="filter-row">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchInput" 
          placeholder="Search tasks..." 
          class="search-input"
        />
      </div>
      
      <div class="filter-controls">
        <div class="filter-select">
          <select v-model="selectedStatus">
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div class="filter-select">
          <select v-model="selectedPriority">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div class="filter-tags-dropdown">
          <button 
            type="button" 
            class="tags-dropdown-button" 
            @click="toggleTagsDropdown"
          >
            Tags 
            <span v-if="selectedTags.length" class="tag-count">{{ selectedTags.length }}</span>
          </button>
          
          <div class="tags-dropdown" v-if="showTagsDropdown">
            <div class="tags-list" v-if="taskStore.availableTags.length">
              <label 
                v-for="tag in taskStore.availableTags" 
                :key="tag" 
                class="tag-checkbox"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedTags.includes(tag)" 
                  @change="toggleTagSelection(tag)" 
                />
                <span>{{ tag }}</span>
              </label>
            </div>
            <div v-else class="no-tags">No tags available</div>
          </div>
        </div>
        
        <button 
          type="button" 
          class="clear-filters-button" 
          @click="clearFilters"
          :disabled="!searchInput && selectedStatus === 'all' && !selectedPriority && selectedTags.length === 0"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-filter {
  margin-bottom: var(--space-3);
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: var(--space-2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.search-container {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 1rem;
}

.dark .search-input {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

.search-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.filter-select {
  flex: 1;
  min-width: 120px;
}

.filter-select select {
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23333' d='M4.5 5.5l3.5 3.5 3.5-3.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
}

.dark .filter-select select {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' d='M4.5 5.5l3.5 3.5 3.5-3.5'/%3E%3C/svg%3E");
}

.filter-tags-dropdown {
  position: relative;
  flex: 1;
  min-width: 100px;
}

.tags-dropdown-button {
  width: 100%;
  padding: 0.6rem 0.7rem;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.tag-count {
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.tags-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--color-surface);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.tags-list {
  padding: var(--space-1);
}

.tag-checkbox {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag-checkbox:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .tag-checkbox:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.tag-checkbox input {
  margin-right: 8px;
}

.no-tags {
  padding: var(--space-1);
  text-align: center;
  color: var(--color-text-light);
}

.clear-filters-button {
  padding: 0.6rem 0.7rem;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.clear-filters-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-filters-button:disabled:hover {
  background-color: var(--color-primary);
}

@media (min-width: 768px) {
  .filter-row {
    flex-direction: row;
  }
  
  .search-container {
    max-width: 300px;
  }
  
  .filter-controls {
    flex: 1;
    justify-content: flex-end;
  }
  
  .filter-select,
  .filter-tags-dropdown {
    max-width: 150px;
  }
}
</style>