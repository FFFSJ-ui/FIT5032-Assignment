<template>
  <nav class="navbar navbar-expand-lg text-white fixed-top">
    <div class="container-fluid">
      <h5 class="offcanvas-title">NutriPublic</h5>
      <!-- sidebar button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
      >
        <span class="navbar-toggler-icon navbar-dark"></span>
      </button>
      <!-- sidebar -->
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header border-0">
          <h5 class="offcanvas-title">NutriPublic</h5>
          <!-- close button -->
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-sm-center flex-grow-1 pe-3">
            <li class="nav-item">
              <router-link to="/home" class="nav-link" active-class="active" @click="closeOffcanvas"
                >Home</router-link
              >
            </li>
            <!-- <li class="nav-item">
              <router-link
                to="/event"
                class="nav-link"
                active-class="active"
                @click="closeOffcanvas"
                >Event</router-link
              >
            </li> -->
            <li class="nav-item">
              <router-link to="/ai" class="nav-link" active-class="active" @click="closeOffcanvas"
                >AI</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/map" class="nav-link" active-class="active" @click="closeOffcanvas"
                >Map</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                :to="isLoggedIn ? '/profile' : '/first'"
                class="nav-link"
                active-class="active"
                @click="closeOffcanvas"
                >Profile</router-link
              >
            </li>
            <!-- <li class="nav-item">
              <router-link
                to="/about"
                class="nav-link"
                active-class="active"
                @click="closeOffcanvas"
                >About</router-link
              >
            </li> -->
            <li class="nav-item" v-if="isAdmin">
              <router-link
                to="/dashboard"
                class="nav-link"
                active-class="active"
                @click="closeOffcanvas"
                >Dashboard</router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <!-- show login button if not logged in -->
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link
                to="/first"
                class="nav-link"
                active-class="active"
                @click="closeOffcanvas"
                >Login</router-link
              >
            </li>
            <!-- show text if logged in -->
            <li class="nav-item" v-else>
              <span class="nav-link">Hello, {{ username }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { isAuthenticated, currentUser } from '@/auth'
export default {
  name: 'BHeader',
  mounted() {
    this.$nextTick(() => {
      import('bootstrap/dist/js/bootstrap.bundle.min.js')
    })
  },
  beforeUnmount() {},
  computed: {
    isLoggedIn() {
      return !!isAuthenticated.value
    },
    // display current username
    username() {
      const user = currentUser.value
      return user.username
    },
    isAdmin() {
      const user = currentUser.value
      return user && user.role === 'admin'
    },
  },

  methods: {
    closeOffcanvas() {
      const offcanvasElement = document.getElementById('offcanvasNavbar')
      if (offcanvasElement) {
        const offcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement)
        if (offcanvas) {
          offcanvas.hide()
        }
      }
    },
  },
}
</script>

<style scoped>
/* fixed navigation bar height and background */
.navbar {
  height: 70px;
  background-color: #274754 !important;
}
/* collapse button focused style */
.navbar-toggler:focus {
  box-shadow: none;
}
/* sidebar */
.offcanvas {
  background-color: #274754 !important;
  color: #e7f5ec;
}

.offcanvas-body .nav-link {
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 0.375rem;
  color: #e7f5ec !important;
}
/* navigation link of the activated page */
.offcanvas-body .nav-link.active {
  background-color: #e7f5ec;
  color: #274754 !important;
}

/* button color: #16a249 */
</style>
