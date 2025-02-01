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
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>{{ editingIndex !== null ? 'Edit Task' : 'Add Task' }}</h3>
        <div style="display:flex;flex-direction: column;">
          <input v-model="newTask.title" placeholder="Task Title" />
          <input type="date" v-model="newTask.dueDate" />
          <select v-model="newTask.priority">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button @click="addTask">{{ editingIndex !== null ? 'Update' : 'Add' }} Task</button>
      </div>
    </div>
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



<script>
import { ref, onMounted, computed } from 'vue';

export default {
  setup() {
    const newTask = ref({ title: '', dueDate: '', priority: 'Medium', completed: false });
    const tasks = ref([]);
    const editingIndex = ref(null);
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const deleteTaskIndex = ref(null);
    const sortOption = ref('date-new-to-old');
    const searchQuery = ref('');

    const filteredTasks = computed(() => {
      const filtered = tasks.value.filter(task =>
        task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      switch (sortOption.value) {
        case 'date-new-to-old':
          return filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        case 'date-old-to-new':
          return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        case 'priority-high-to-low':
          return filtered.sort((a, b) => {
            const priorities = { High: 3, Medium: 2, Low: 1 };
            return priorities[b.priority] - priorities[a.priority];
          });
        case 'priority-low-to-high':
          return filtered.sort((a, b) => {
            const priorities = { High: 3, Medium: 2, Low: 1 };
            return priorities[a.priority] - priorities[b.priority];
          });
        default:
          return filtered;
      }
    });

    const openAddTaskModal = () => {
      editingIndex.value = null;
      newTask.value = { title: '', dueDate: '', priority: 'Medium', completed: false };
      showModal.value = true;
    };

    const addTask = () => {
      if (!newTask.value.title.trim()) return;
      if (editingIndex.value !== null) {
        tasks.value[editingIndex.value] = { ...newTask.value };
        editingIndex.value = null;
      } else {
        tasks.value.push({ ...newTask.value });
      }
      saveTasks();
      closeModal();
    };

    const editTask = (index) => {
      newTask.value = { ...tasks.value[index] };
      editingIndex.value = index;
      showModal.value = true;
    };

    const confirmDeleteTask = (index) => {
      deleteTaskIndex.value = index;
      showDeleteModal.value = true;
    };

    const deleteTask = () => {
      if (deleteTaskIndex.value !== null) {
        tasks.value.splice(deleteTaskIndex.value, 1);
        saveTasks();
        closeDeleteModal();
      }
    };

    const closeModal = () => {
      showModal.value = false;
      newTask.value = { title: '', dueDate: '', priority: 'Medium', completed: false };
      editingIndex.value = null;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      deleteTaskIndex.value = null;
    };

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    };

    const toggleTaskCompletion = (task) => {
      task.completed = !task.completed;
      saveTasks();
    };

    onMounted(() => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        tasks.value = JSON.parse(savedTasks);
      }
    });

    return {
      newTask,
      tasks,
      openAddTaskModal,
      addTask,
      editTask,
      confirmDeleteTask,
      deleteTask,
      showModal,
      closeModal,
      sortOption,
      searchQuery,
      filteredTasks,
      showDeleteModal,
      closeDeleteModal,
      toggleTaskCompletion,
    };
  },
};
</script>



<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  background-color: #f0f2f5;
  min-height: 95vh;
  border-radius: 8px;
  padding: 24px;
}

h1 {
  color: #262626;
  font-size: 24px;
  margin-bottom: 24px;
}

input,
select,
button {
  margin: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 14px;
  transition: all 0.3s ease;
}

/* tried to replicate antdesign style */
input:focus,
select:focus,
button:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

button {
  background-color: #1890ff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #40a9ff;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close {
  float: right;
  cursor: pointer;
  font-size: 20px;
  color: #8c8c8c;
}

.close:hover {
  color: #262626;
}

.completed {
  text-decoration: line-through;
  color: #8c8c8c;
}


.taskContainer {
  margin: 8px 0;
  display: flex;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: white;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.taskContainer:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkNDetail {
  display: flex;
  align-items: center;
  flex: 1;
}

.todoTitle {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  padding-right: 16px;
}

.todoDate {
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 400;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 16px;
  font-size: 12px;
  font-weight: 500;
  max-height: 18px;
}

.dangerBadge {
  background-color: #fff1f0;
  color: #cf1322;
}

.mediumBadge {
  background-color: #fff7e6;
  color: #d46b08;
}

.lowBadge {
  background-color: #f6ffed;
  color: #389e0d;
}

.actionTab {
  display: flex;
  gap: 8px;
}

.actionButton {
  background-color: transparent;
  border: 1px solid #d9d9d9;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #262626;
}

.actionButton:hover {
  background-color: #f5f5f5;
}

/* Edit Button */
.editButton {
  color: #1890ff;
  border-color: #1890ff;
}

.editButton:hover {
  background-color: #e6f7ff;
}

/* Delete Button */
.deleteButton {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.deleteButton:hover {
  background-color: #fff1f0;
}

.refuseDeleteButton {
  color: #24a02c;
  border-color: #24a02c;
}

.refuseDeleteButton:hover {
  background-color: #d3f6d6;
}


/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .taskContainer {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .checkNDetail {
    flex-direction: row;
    align-items: flex-start;
  }

  .todoTitle {
    font-size: 14px;
    padding-left: 0;
  }

  .todoDate {
    font-size: 12px;
    padding-left: 0;
  }

  .badge {
    margin-top: 8px;
    margin-right: 0;
    font-size: 12px;
  }

  .actionTab {
    margin-top: 12px;
    justify-content: space-between;
    width: 100%;
  }

  .actionButton {
    font-size: 12px;
    padding: 6px;
    width: 48%;
  }
}

@media (max-width: 480px) {
  .todoTitle {
    font-size: 14px;
  }

  .todoDate {
    font-size: 12px;
  }

  .badge {
    font-size: 12px;
    padding: 3px 6px;
  }

  .actionButton {
    font-size: 12px;
    padding: 6px;
  }

  .actionTab {
    flex-direction: column;
    align-items: stretch;
  }

  .actionButton {
    margin-bottom: 8px;
    width: 100%;
  }
}
</style>