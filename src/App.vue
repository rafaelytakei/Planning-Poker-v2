<template>
  <router-view />
</template>
<script setup></script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
#app {
  /* min-height: 100vh; */
  padding: 1.5rem 2rem;
  height: 100%;
  --font-family: 'Noto Sans', sans-serif;
  --border-radius: 10px;
}
html {
  height: 100%;
}
body {
  margin: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface-a);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}

.p-dialog {
  max-width: 80vw;
}
</style>
