<template>
  <div
    class="h-full w-full bg-secondary border-3 border-white border-round card"
  >
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.card {
  transition: 0.5s ease-in-out;
}
.card:hover {
  transform: rotateY(180deg);
}
</style>
