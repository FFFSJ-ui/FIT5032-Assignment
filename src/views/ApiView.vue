<template>
  <div class="container mt-5">
    <h1 class="text-center">API Access</h1>
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Events API 1</h5>
        <p class="card-text">
          <strong>Provides:</strong> title, content, location<br />
          <strong>URL: </strong>
          <a
            :href="apiBaseUrl + '/api/events/location'"
            target="_blank"
            class="text-decoration-none"
          >
            <code>{{ apiBaseUrl }}/api/events/location</code>
          </a>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Events API 2</h5>
        <p class="card-text">
          <strong>Provides:</strong> title, content, time<br />
          <strong>URL: </strong>
          <a
            :href="apiBaseUrl + '/api/events/time'"
            target="_blank"
            class="text-decoration-none"
          >
            <code>{{ apiBaseUrl }}/api/events/time</code>
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
      apiBaseUrl: "http://localhost:3000",
    };
  },
};
</script>
