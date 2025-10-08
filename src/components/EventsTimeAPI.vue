<template>
  <pre>{{ jsondata }}</pre>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      jsondata: null,
      error: null,
    }
  },
  mounted() {
    this.EventsTimeAPI();
  },
  methods: {
    async EventsTimeAPI() {
      try {
        const response = await axios.get('https://eventstime-pmr3mcznla-uc.a.run.app')
        this.jsondata = response.data;
        this.error = null
      } catch (error) {
        console.error('Error:', error)
        this.jsondata = { error: 'Failed to fetch events with time' }
      }
    },
  },
}
</script>
