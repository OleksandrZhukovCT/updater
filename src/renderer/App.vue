<template>
  <div id="app">
    Loading update
    <progress :value="progress"></progress>
  </div>
</template>

<script>
import LandingPage from '@/components/LandingPage';
import { updateApp, setLatest } from '../services/updater.js';
import { ipcRenderer } from 'electron';

export default {
  name: 'updater',
  data() {
    return {
      progress: 0
    };
  },
  components: {
    LandingPage
  },
  mounted() {    
    ipcRenderer.on('download-progress', (_, progress) => {
      this.progress = Math.floor(
        (progress.loaded * 100) / progress.total
      );
    });
  }
};
</script>

<style>
/* CSS */
</style>
