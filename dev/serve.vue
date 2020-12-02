<script>
import Vue from 'vue';
import VuePdfReader from '@/vue-pdf-reader.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VuePdfReader
  }
});
</script>

<template>
  <div id="app">
    <vue-pdf-reader pdf-url="https://res.cloudinary.com/plushdeveloper/image/upload/v1606725836/Acknowledgments_g0znzo.pdf" name="PDF Viewer" />
  </div>
</template>
