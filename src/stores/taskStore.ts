import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Task, TaskCreateInput, TaskFilter } from '../types/Task'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'))
  const filter = ref<TaskFilter>({
    searchTerm: '',
    status: 'all',
    priority: '',
    tags: []
  })
  
  // Save tasks to localStorage whenever they change
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }
  
  // Create a new task
  function createTask(taskInput: TaskCreateInput) {
    const now = new Date().toISOString()
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskInput,
      createdAt: now,
      updatedAt: now
    }
    
    tasks.value.push(newTask)
    saveTasks()
    return newTask
  }
  
  // Update an existing task
  function updateTask(id: string, updates: Partial<Task>) {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveTasks()
      return tasks.value[index]
    }
    return null
  }
  
  // Delete a task
  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(task => task.id !== id)
    saveTasks()
  }
  
  // Toggle task completion
  function toggleTaskCompletion(id: string) {
    const task = tasks.value.find(task => task.id === id)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = new Date().toISOString()
      saveTasks()
    }
  }
  
  // Set filter options
  function setFilter(newFilter: Partial<TaskFilter>) {
    filter.value = { ...filter.value, ...newFilter }
  }
  
  // Reset filters
  function resetFilter() {
    filter.value = {
      searchTerm: '',
      status: 'all',
      priority: '',
      tags: []
    }
  }
  
  // Get available tags from all tasks
  const availableTags = computed(() => {
    const tagSet = new Set<string>()
    tasks.value.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet)
  })
  
  // Get filtered tasks
  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      // Filter by search term
      if (filter.value.searchTerm && 
          !task.title.toLowerCase().includes(filter.value.searchTerm.toLowerCase()) &&
          !task.description.toLowerCase().includes(filter.value.searchTerm.toLowerCase())) {
        return false
      }
      
      // Filter by status
      if (filter.value.status === 'active' && task.completed) {
        return false
      }
      if (filter.value.status === 'completed' && !task.completed) {
        return false
      }
      
      // Filter by priority
      if (filter.value.priority && task.priority !== filter.value.priority) {
        return false
      }
      
      // Filter by tags
      if (filter.value.tags.length > 0) {
        const hasMatchingTag = filter.value.tags.some(tag => 
          task.tags.includes(tag)
        )
        if (!hasMatchingTag) {
          return false
        }
      }
      
      return true
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  })
  
  return {
    tasks,
    filter,
    availableTags,
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setFilter,
    resetFilter
  }
})