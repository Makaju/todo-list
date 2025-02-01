
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
    const modalMode = ref('add'); // add this line to track modal mode

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
      modalMode.value = 'add';
      editingIndex.value = null;
      newTask.value = { title: '', dueDate: '', priority: 'Medium', completed: false };
      showModal.value = true;
    };

    const editTask = (index) => {
      modalMode.value = 'edit';
      editingIndex.value = index;
      newTask.value = { ...tasks.value[index] };
      showModal.value = true;
    };

    const saveTask = () => {
      if (!newTask.value.title.trim()) return;
      
      if (modalMode.value === 'edit' && editingIndex.value !== null) {
        tasks.value[editingIndex.value] = { ...newTask.value };
      } else {
        tasks.value.push({ ...newTask.value });
      }
      
      saveTasks();
      closeModal();
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
      modalMode.value = 'add';
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
      modalMode,
      openAddTaskModal,
      saveTask,
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
