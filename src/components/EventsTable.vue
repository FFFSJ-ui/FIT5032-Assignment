<template>
  <div class="container mt-4">
    <h1>Event Management</h1>
    <div class="table-responsive">
      <!-- Search -->
      <div class="row g-2">
        <div class="col-md-2">
          <select v-model="searchColumn" class="form-select">
            <option value="title">Title</option>
            <option value="content">Content</option>
            <option value="location">Location</option>
            <option value="time">Time</option>
            <option value="email">Email</option>
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
          <ExportData :data="events" :columns="columns" filename="events" />
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
          <tr v-for="event in paginatedEvents" :key="event.id">
            <td v-for="column in columns" :key="column">
              <input
                v-if="
                  editing === event.id &&
                  column !== 'time' &&
                  column !== 'email'
                "
                v-model="form[column]"
                type="text"
                class="form-control"
              />
              <span v-else>{{
                column === "time"
                  ? formatTimestamp(event[column])
                  : event[column]
              }}</span>
            </td>
            <td>
              <div v-if="editing === event.id">
                <button @click="save" class="btn btn-success btn-sm me-1">
                  Save
                </button>
                <button
                  @click="editing = null"
                  class="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
              <div v-else>
                <button
                  @click="edit(event)"
                  class="btn btn-primary btn-sm me-1"
                >
                  Edit
                </button>
                <button @click="remove(event)" class="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div class="card">
      <Paginator
        :rows="10"
        :totalRecords="sortedEvents.length"
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

const events = ref([]);
const columns = ["title", "content", "location", "time", "email"];
const editing = ref(null);
const form = reactive({});
const searchColumn = ref("title");
const searchValue = ref("");
const sortColumn = ref("title");
const sortDirection = ref("asc");
const currentPage = ref(1);
const pageSize = 10;

// Header sorting
const sortedEvents = computed(() => {
  if (!events.value.length) return [];
  return [...events.value].sort((a, b) => {
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
const paginatedEvents = computed(() => {
  // Indexes start at 0
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return sortedEvents.value.slice(start, end);
});

function onPageChange(event) {
  currentPage.value = Math.floor(event.first / 10) + 1;
}

function formatTimestamp(timestamp) {
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp;
}

async function clear() {
  searchValue.value = "";
  currentPage.value = 1;
  let q = collection(db, "events");
  events.value = (await getDocs(q)).docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// Precise search
async function find() {
  currentPage.value = 1;
  if (!searchValue.value) {
    let q = collection(db, "events");
    events.value = (await getDocs(q)).docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } else if (searchColumn.value === "time") {
    // Use formatTimestamp to handle time column
    let q = collection(db, "events");
    const allEvents = (await getDocs(q)).docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    events.value = allEvents.filter((event) => {
      const formattedTime = formatTimestamp(event.time);
      return formattedTime.includes(searchValue.value);
    });
  } else {
    let q = query(
      collection(db, "events"),
      where(searchColumn.value, "==", searchValue.value)
    );
    events.value = (await getDocs(q)).docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }
}

function edit(event) {
  editing.value = event.id;
  form.title = event.title;
  form.content = event.content;
  form.location = event.location;
  form.time = event.time;
  form.email = event.email;
}

async function save() {
  const data = {
    title: form.title,
    content: form.content,
    location: form.location,
    time: form.time,
    email: form.email,
  };
  await updateDoc(doc(db, "events", editing.value), data);
  const eventIndex = events.value.findIndex((e) => e.id === editing.value);
  if (eventIndex !== -1) {
    events.value[eventIndex] = { id: editing.value, ...data };
  }
  editing.value = null;
}

async function remove(event) {
  if (!confirm(`Delete event "${event.title}"?`)) return;
  await deleteDoc(doc(db, "events", event.id));
  events.value = events.value.filter((e) => e.id !== event.id);
}

onMounted(clear);
</script>