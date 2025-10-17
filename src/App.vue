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

<style scoped>
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
</style>
