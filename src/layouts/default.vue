<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  setup() {
    return {}
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

/* .fade-enter-from {
  transform: rotateY(-90deg);
}
.fade-leave-to {
  transform: rotateY(90deg);
} */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
