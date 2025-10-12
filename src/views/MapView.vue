<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center mb-4">View Event Location</h1>
        <!-- Search -->
        <div class="row mb-3">
          <div class="col-md-10">
            <div class="position-relative">
              <input
                v-model="searchLocation"
                @input="getSuggestions"
                @keyup.enter="search"
                @focus="getSuggestions"
                @blur="hideSuggestions"
                type="text"
                class="form-control"
                placeholder="Search places in Australia"
              />
              <!-- Search suggestion drop-down box -->
              <div
                v-if="suggestions.length"
                class="position-absolute w-100 bg-white border mt-1"
                style="
                  z-index: 1000;
                  max-height: 200px;
                  overflow-y: auto;
                  top: 100%;
                "
              >
                <div
                  v-for="item in suggestions"
                  :key="item.id"
                  @mousedown="selectPlace(item)"
                  class="p-2 border-bottom"
                  style="cursor: pointer"
                >
                  <small class="text-muted">{{ item.place_name }}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2">
            <button @click="search" class="btn btn-primary">Search</button>
          </div>
        </div>
        <div id="map" style="height: 500px; width: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const searchLocation = ref("");
const suggestions = ref([]);
let map, marker;

onMounted(() => {
  // Dynamically load Mapbox GL
  const link = document.createElement("link");
  link.href = "https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = "https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js";
  script.onload = () => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
    // Initialize map
    map = new mapboxgl.Map({
      container: "map",
      center: [144.9636134985202, -37.81649622891766],
      zoom: 13,
    });
    // Hide suggestions while interacting
    map.on("mousedown", () => (suggestions.value = []));
    map.on("touchstart", () => (suggestions.value = []));
  };
  document.head.appendChild(script);
});

// Calling the Mapbox API
const apiCall = async (query, limit = 1) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&country=au&limit=${limit}&types=poi,place,address`
  );
  return (await response.json()).features || [];
};

function showPlace(place) {
  // Remove the mark that showed in the previous search
  if (marker) marker.remove();
  // Create a new blue map marker
  marker = new mapboxgl.Marker({ color: "blue" })
    .setLngLat(place.center)
    .addTo(map);
  // Display information pop-up window
  new mapboxgl.Popup()
    .setLngLat(place.center)
    .setHTML(`<h6>${place.place_name}</h6>`)
    .addTo(map);
  // Move to this location
  map.flyTo({ center: place.center, zoom: 15 });
}

async function search() {
  suggestions.value = [];
  if (!searchLocation.value) return;
  try {
    const places = await apiCall(searchLocation.value);
    // Display the first search result
    if (places.length) showPlace(places[0]);
    else alert("Location not found in Australia");
  } catch (error) {
    alert(error.message);
  }
}

async function getSuggestions() {
  if (searchLocation.value.length < 3) {
    suggestions.value = [];
    return;
  }
  try {
    const places = await apiCall(searchLocation.value, 10);
    suggestions.value = places
      // Display POI type locations first
      .sort(
        (a, b) =>
          (b.place_type && b.place_type.includes("poi") ? 1 : 0) -
          (a.place_type && a.place_type.includes("poi") ? 1 : 0)
      )
      .slice(0, 5);
  } catch (error) {
    console.error("Suggestions failed:", error);
  }
}

// Select a place from suggestions
function selectPlace(place) {
  searchLocation.value = place.place_name;
  suggestions.value = [];
  showPlace(place);
}

// Delay hiding suggestions to avoid conflict with click
const hideSuggestions = () => setTimeout(() => (suggestions.value = []), 200);
</script>