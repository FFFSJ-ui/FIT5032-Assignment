<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";
import db from "@/firebase/init";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const events = ref([]);

const loadEvents = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, "events"), orderBy("createat", "desc"))
  );
  events.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const eventDetail = (event) => {
  router.push(`/event/${event.id}`);
};

const formatDate = (date) => {
  return date.toDate().toLocaleString();
};

const longContent = (content) => {
  return content.length > 100 ? content.substring(0, 100) + "..." : content;
};

onMounted(() => {
  loadEvents();
});
</script>

<template>
  <div class="hero-image">
    <h2 class="hero-text">Your Plate. Your Health. Our Future.</h2>
  </div>
  <div class="container mt-5">
    <h1 class="text-center">Event</h1>
    <div class="events-grid">
      <div
        v-for="event in events"
        :key="event.id"
        class="card mb-3"
        @click="eventDetail(event)"
        @keydown.enter="eventDetail(event)" 
        tabindex="0"       
        style="cursor: pointer; height: 150px;"
      >
        <div class="card-body">
          <h5>{{ event.title }}</h5>
          <p>{{ formatDate(event.createat) }}</p>
          <p>{{ longContent(event.content) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 600px);
  gap: 2rem;
  justify-content: center;
}

.hero-image {
  width: 100vw;
  height: 30vh;
  background-image: url("@/assets/home.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform-origin: center;
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-text {
  color: #274754;
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  text-align: center;
  text-shadow:
    3px 3px 6px rgba(255, 255, 255, 1),
    -2px -2px 4px rgba(255, 255, 255, 1),
    0 0 8px rgba(255, 255, 255, 0.9);
}
</style>