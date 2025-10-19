<script setup>
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'
const route = useRoute()
// import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
</script>

<template>
  <div class="main-container">
    <header v-if="route.path !== '/first'">
      <BHeader />
    </header>

    <main class="main-box">
      <!-- <LibraryRegistrationForm /> -->
      <!-- <JSONLab /> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */

.main-container {
  padding-top: 30px;
  background-color: #f1f4f1;
  min-height: 100vh;
}

.container {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.form-container {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}

.card {
  border-radius: 12px !important;
  box-shadow:
    0 4px 12px rgba(39, 71, 84, 0.1),
    0 2px 6px rgba(22, 162, 73, 0.06) !important;
  border: 1px solid #e7f5ec !important;
  background: linear-gradient(145deg, #ffffff, #f8fdf9) !important;
  overflow: hidden !important;
}

.card[style*="cursor: pointer"]:hover {
  transform: translateY(-3px) !important;
  box-shadow:
    0 8px 20px rgba(39, 71, 84, 0.15),
    0 4px 10px rgba(22, 162, 73, 0.12) !important;
}

.card.card-container {
  background: linear-gradient(145deg, #f1f4f1, #e7f5ec) !important;
  border: 1px solid #d4edda !important;
  box-shadow:
    0 3px 8px rgba(22, 162, 73, 0.08),
    0 1px 3px rgba(39, 71, 84, 0.05) !important;
}

.form-control,
.form-select,
.p-calendar .p-inputtext {
  border: 2px solid #16a249 !important;
  box-shadow:
    0 2px 6px rgba(22, 162, 73, 0.08),
    0 1px 3px rgba(39, 71, 84, 0.05) !important;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease !important;
}

.form-control:focus,
.form-select:focus,
.p-calendar .p-inputtext:focus {
  border-color: #16a249 !important;
  box-shadow: 0 0 0 0.2rem rgba(22, 162, 73, 0.25) !important;
}
</style>
