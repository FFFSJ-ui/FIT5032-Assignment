<template>
  <div class="container mt-5">
    <LoginForm v-if="isLogin" />
    <RegisterForm v-else />
    <div class="text-center mb-4">
      <button @click="toggleForm" class="btn btn-primary mb-4">
        {{ isLogin ? "Register" : "Login" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

const isLogin = ref(true);
const toggleForm = () => {
  isLogin.value = !isLogin.value;
};
</script>

<style scoped>
.container {
  min-width: 600px;
  margin: auto;
}
:deep(.user-form) {
  width: 40%;
  min-width: 400px;
}

:deep(.card) {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.card-header) {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

:deep(.list-group-item) {
  padding: 10px;
}

.btn {
  margin-top: 20px;
}
</style>