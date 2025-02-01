<template>
  <div id="app">
    <h1>My To-Do List</h1>
    <button @click="openAddTaskModal">Add Task</button>

    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>{{ task.title }}</td>
          <td>{{ task.dueDate }}</td>
          <td>{{ task.priority }}</td>
          <td>
            <button @click="editTask(index)">Edit</button>
            <button @click="removeTask(index)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ editingIndex !== null ? 'Edit Task' : 'Add Task' }}</h2>
        <input v-model="newTask.title" placeholder="Task Title" />
        <input type="date" v-model="newTask.dueDate" />
        <select v-model="newTask.priority">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button @click="addTask">{{ editingIndex !== null ? 'Update' : 'Add' }} Task</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const newTask = ref({ title: '', dueDate: '', priority: 'Medium' });
    const tasks = ref([]);
    const editingIndex = ref(null);
    const showModal = ref(false);

    const openAddTaskModal = () => {
      editingIndex.value = null; // Reset editingIndex for adding a new task
      newTask.value = { title: '', dueDate: '', priority: 'Medium' }; // Reset newTask
      showModal.value = true;
    };

    const addTask = () => {
      if (!newTask.value.title.trim()) return; // Prevent empty titles
      if (editingIndex.value !== null) {
        // Update existing task
        tasks.value[editingIndex.value] = { ...newTask.value };
        editingIndex.value = null; // Reset editingIndex after updating
      } else {
        // Add new task
        tasks.value.push({ ...newTask.value });
      }
      saveTasks();
      closeModal();
    };

    const editTask = (index) => {
      newTask.value = { ...tasks.value[index] }; // Load task data into the modal
      editingIndex.value = index; // Set editingIndex to the task being edited
      showModal.value = true;
    };

    const removeTask = (index) => {
      tasks.value.splice(index, 1);
      saveTasks();
    };

    const closeModal = () => {
      showModal.value = false;
      newTask.value = { title: '', dueDate: '', priority: 'Medium' }; // Reset newTask
      editingIndex.value = null; // Reset editingIndex
    };

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
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
      removeTask,
      showModal,
      closeModal,
      editingIndex,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}

input, select, button {
  margin: 5px;
  padding: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #f4f4f4;
}

td, th {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

button {
  cursor: pointer;
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
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

.close {
  float: right;
  cursor: pointer;
  font-size: 20px;
}
</style>