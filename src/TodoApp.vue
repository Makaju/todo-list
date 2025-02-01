<template>
    <div id="app">
      <h1 style="padding-top: 16px;">My To-Do List</h1>
  
      <div class="sortContainer">
        <select v-model="sortOption" @change="sortTasks">
          <option value="date-new-to-old">Sort by Date: New to Old</option>
          <option value="date-old-to-new">Sort by Date: Old to New</option>
          <option value="priority-high-to-low">Sort by Priority: High to Low</option>
          <option value="priority-low-to-high">Sort by Priority: Low to High</option>
        </select>
        <input type="text" v-model="searchQuery" placeholder="Search tasks by title" @input="filterTasks" />
      </div>
  
      <button @click="openAddTaskModal">Add Task</button>
  
      <div>
        <div v-for="(task, index) in filteredTasks" :key="index">
          <div class="taskContainer">
            <div class="checkNDetail">
              <div>
                <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)" />
              </div>
              <div style="display: flex;">
                <div>
                  <div :class="{ completed: task.completed }" class="todoTitle">{{ task.title }}</div>
                  <div class="todoDate">{{ task.dueDate }}</div>
                </div>
                <div class="badge" :class="{
                  dangerBadge: task.priority === 'High',
                  mediumBadge: task.priority === 'Medium',
                  lowBadge: task.priority === 'Low'
                }">
                  {{ task.priority }}
                </div>
              </div>
            </div>
            <div class="actionTab">
              <button class="actionButton editButton" @click="editTask(index)">
                <i class="fa fa-edit"></i>
              </button>
              <button class="actionButton deleteButton" @click="confirmDeleteTask(index)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Task Modal -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>{{ modalMode === 'edit' ? 'Edit Task' : 'Add Task' }}</h3>
          <div style="display:flex;flex-direction: column;">
            <input v-model="newTask.title" placeholder="Task Title" maxlength="50" />
            <span v-if="newTask.title.length > 50" style="color: red; font-size: 12px;">Title cannot exceed 50 characters</span>
            <input type="date" v-model="newTask.dueDate" />
            <select v-model="newTask.priority">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button @click="saveTask">{{ modalMode === 'edit' ? 'Update' : 'Add' }} Task</button>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeDeleteModal">&times;</span>
          <h3>Are you sure you want to delete this task?</h3>
          <div style="display: flex;">
            <button @click="deleteTask" class="actionButton deleteButton">Yes, Delete</button>
            <button @click="closeDeleteModal" class="actionButton refuseDeleteButton">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </template>