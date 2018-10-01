<template>
  <div id="app">
    <p class="message">Loading update</p>
    <div class="progress">
    <div class="progress-bar" role="progressbar" :aria-valuenow="p"
      aria-valuemin="0" aria-valuemax="100" :style="{ width: `${p}%`}">
        {{ p }}%
    </div>
  </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "updater",
  data() {
    return {
      p: 0
    };
  },
  mounted() {
    ipcRenderer.on("download-progress", (_, progress) => {
      this.$nextTick(() => {
        console.log(progress);
        this.p = Math.floor(progress.percent * 100);
      });
    });
  }
};
</script>

<style>
.message {
  color: #2f3542;
  font-size: 24px;
  font-weight: 500;
}
.progress-bar {
  float: left;
  width: 0;
  height: 100%;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 1px;
  min-width: 40px;
  color: #f1f2f6;
  text-align: center;
  background-color: #70a1ff;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}
.progress {
  height: 28px;
  margin-top: 34px;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
body {
  background-color: #ced6e0;
  font-family: Arial, sans-serif;
}
</style>
