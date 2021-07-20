<template>
  <div class="game-card" :class="{ active }">
    <span class="font-bold text-xl">{{ cardValue }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  cardValue: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.game-card {
  border: 3px solid var(--text-color);
  width: 3.5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
}
.game-card:hover,
.game-card.active {
  transform: scale(110%);
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
