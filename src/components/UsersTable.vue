<template>
  <div class="container mt-4">
    <h1>User Management</h1>
    <!-- Search -->
    <div class="row g-2">
      <div class="col-md-2">
        <select v-model="searchColumn" class="form-select">
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="rating">Rating</option>
          <option value="role">Role</option>
        </select>
      </div>
      <div class="col-md-6">
        <input
          v-model="searchValue"
          type="text"
          class="form-control"
          :placeholder="`Search by ${searchColumn}`"
          @keyup.enter="find"
        />
      </div>
      <div class="col-md-4">
        <button @click="find" class="btn btn-primary me-1">Search</button>
        <button @click="clear" class="btn btn-secondary me-1">Clear</button>
        <ExportData :data="users" :columns="columns" filename="users" />
      </div>
    </div>
    <!-- Data table -->
    <div class="mt-4"></div>
    <table class="table table-striped">
      <thead class="table-success">
        <tr>
          <th
            v-for="column in columns"
            :key="column"
            @click="sort(column)"
            style="cursor: pointer"
          >
            {{ column }}
            <span v-if="sortColumn === column">
              {{ sortDirection === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td v-for="column in columns" :key="column">
            <input
              v-if="
                editing === user.id && column !== 'role' && column !== 'email'
              "
              v-model="form[column]"
              type="text"
              class="form-control"
            />
            <span v-else>{{ user[column] }}</span>
          </td>
          <td>
            <div v-if="editing === user.id">
              <button @click="save" class="btn btn-success btn-sm me-1">
                Save
              </button>
              <button @click="editing = null" class="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>
            <div v-else>
              <button @click="edit(user)" class="btn btn-primary btn-sm me-1">
                Edit
              </button>
              <button @click="remove(user)" class="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="card">
      <Paginator
        :rows="10"
        :totalRecords="sortedUsers.length"
        @page="onPageChange"
      ></Paginator>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import db from "../firebase/init.js";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Paginator from "primevue/paginator";
import ExportData from "./ExportData.vue";

const users = ref([]);
const columns = ["username", "email", "rating", "role"];
const editing = ref(null);
const form = reactive({});
const searchColumn = ref("username");
const searchValue = ref("");
const sortColumn = ref("username");
const sortDirection = ref("asc");
const currentPage = ref(1);

// Header sorting
const sortedUsers = computed(() => {
  if (!users.value.length) return [];

  return [...users.value].sort((a, b) => {
    const aVal = a[sortColumn.value];
    const bVal = b[sortColumn.value];
    const comparison = String(aVal || "").localeCompare(String(bVal || ""));
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
});

function sort(column) {
  // Click the same column
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Reset to default ascending order
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
  // return to page 1
  currentPage.value = 1;
}

// Pagination
const paginatedUsers = computed(() => {
  // Indexes start at 0
  const start = (currentPage.value - 1) * 10;
  const end = start + 10;
  return sortedUsers.value.slice(start, end);
});

function onPageChange(event) {
  currentPage.value = Math.floor(event.first / 10) + 1;
}

async function clear() {
  searchValue.value = "";
  currentPage.value = 1;
  let q = collection(db, "users");
  users.value = (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Precise search
async function find() {
  currentPage.value = 1;
  let q = !searchValue.value
    ? collection(db, "users")
    : query(
        collection(db, "users"),
        where(searchColumn.value, "==", searchValue.value)
      );
  users.value = (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}

function edit(user) {
  editing.value = user.id;
  form.username = user.username;
  form.email = user.email;
  form.rating = user.rating;
  form.role = user.role;
}

async function save() {
  const data = {
    username: form.username,
    email: form.email,
    rating: form.rating,
    role: form.role,
  };
  await updateDoc(doc(db, "users", editing.value), data);
  const userIndex = users.value.findIndex((u) => u.id === editing.value);
  if (userIndex !== -1) {
    users.value[userIndex] = { id: editing.value, ...data };
  }
  editing.value = null;
}

async function remove(user) {
  if (!confirm(`Delete user "${user.username}"?`)) return;
  await deleteDoc(doc(db, "users", user.id));
  users.value = users.value.filter((u) => u.id !== user.id);
}

onMounted(clear);
</script>