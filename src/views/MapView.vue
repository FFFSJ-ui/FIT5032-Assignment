<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center mb-4">View Event Location</h1>
        <!-- Search -->
        <div class="row mb-3">
          <div class="col-md-8">
            <div class="position-relative">
              <input
                v-model="searchLocation"
                @input="getSuggestions"
                @keyup.enter="search"
                @focus="getSuggestions"
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
                  @keydown.enter.prevent="selectPlace(item)"
                  class="p-2 border-bottom"
                  style="cursor: pointer"
                  tabindex="0"
                >
                  <small class="text-muted">{{ item.place_name }}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <button @click="search" class="btn btn-primary me-2">Search</button>
            <button @click="clear" class="btn btn-secondary">Clear</button>
          </div>
        </div>
        <div id="map" style="height: 500px; width: 100%"></div>
        <div
          class="location-info bg-light p-3 mb-3 border rounded"
          v-if="currentLocation"
        >
          <p class="mb-0 text-muted">{{ currentLocation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const searchLocation = ref("");
const suggestions = ref([]);
const currentLocation = ref("");
let map, directions, userLocation;

onMounted(() => {
  // Close search suggestion when clicking elsewhere
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".position-relative")) suggestions.value = [];
  });
  // Dynamically load Mapbox map style
  const link = document.createElement("link");
  link.href = "https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  // Dynamically load route planning style
  const directionsCss = document.createElement("link");
  directionsCss.href =
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.css";
  directionsCss.rel = "stylesheet";
  document.head.appendChild(directionsCss);
  // Dynamically load the Mapbox map script
  const script = document.createElement("script");
  script.src = "https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js";
  script.onload = () => {
    // Load the route planning script
    const directionsScript = document.createElement("script");
    directionsScript.src =
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.js";
    directionsScript.onload = initializeMap;
    document.head.appendChild(directionsScript);
  };
  document.head.appendChild(script);
});

const initializeMap = () => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [144.9636134985202, -37.81649622891766],
    zoom: 13,
  });
  // Create route planning control
  directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: "metric",
    profile: "mapbox/driving",
    controls: { inputs: false, instructions: false },
    interactive: false,
  });
  map.addControl(directions, "top-left");
  document.querySelector(".mapboxgl-ctrl-bottom-left")?.remove();
  getUserLocation();
};

const getUserLocation = () => {
  navigator.geolocation?.getCurrentPosition((position) => {
    userLocation = [position.coords.longitude, position.coords.latitude];
    map.flyTo({ center: userLocation, zoom: 13 });
    // Set the user's location as the starting point
    directions.setOrigin(userLocation);
  });
};

const searchPlaces = async (query) => {
  if (!query || query.length < 3) return [];
  // Set the search range to prioritize those closest to the user
  const proximity = userLocation
    ? `&proximity=${userLocation[0]},${userLocation[1]}`
    : "";
  // Call the Mapbox geocoding API to search for locations
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=au&types=poi,place,address${proximity}&limit=5`
  );
  return (await response.json()).features || [];
};

const getSuggestions = async () => {
  const places = await searchPlaces(searchLocation.value);
  suggestions.value = places;
};

const selectPlace = (place) => {
  searchLocation.value = place.place_name;
  suggestions.value = [];
  showPlace(place);
};

const search = async () => {
  suggestions.value = [];
  const places = await searchPlaces(searchLocation.value);
  // Display the first location
  if (places.length) showPlace(places[0]);
};

//Search button click event
const showPlace = (place) => {
  currentLocation.value = place.place_name;
  directions.setDestination(place.center);
  directions.once("route", () => {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(userLocation);
    bounds.extend(place.center);
    map.fitBounds(bounds, { padding: 50 });
  });
};

const clear = () => {
  searchLocation.value = "";
  suggestions.value = [];
  currentLocation.value = "";
  directions.removeRoutes();
};
</script>