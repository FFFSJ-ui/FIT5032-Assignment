<template>
  <div class="container mt-5">
    <h1 class="text-center">API Access</h1>
    <div class="card mb-3">
      <div class="card-body">
        <h2 class="card-title">Events Location API</h2>
        <p class="card-text">
          <strong>Provides:</strong> title, content, location<br />
          <a
            :href="endpoints.eventsLocation"
            target="_blank"
            class="text-decoration-none fw-bold fs-4"
          >
            <code>{{ endpoints.eventsLocation }}</code>
          </a>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">Events Time API</h2>
        <p class="card-text">
          <strong>Provides:</strong> title, content, time<br />
          <a
            :href="endpoints.eventsTime"
            target="_blank"
            class="text-decoration-none fw-bold fs-4"
          >
            <code>{{ endpoints.eventsTime }}</code>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      endpoints: {
        eventsLocation: "https://eventslocation-pmr3mcznla-uc.a.run.app",
        eventsTime: "https://eventstime-pmr3mcznla-uc.a.run.app"
      }
    };
  },
};
</script>
