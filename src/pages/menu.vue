<template>
  <div class="flex flex-column align-items-center h-full">
    <h1 class="text-5xl font-normal">Menu</h1>
    <div ref="lottieWrapper" class="lottie-wrapper"></div>
    <!-- <logo /> -->
    <h2 class="text-xl font-normal">
      Escolha uma das opções abaixo para prosseguir:
    </h2>
    <div class="flex flex-column">
      <Button
        v-ripple
        label="Criar nova partida"
        class="p-ripple mb-4"
        @click="openCreateModal"
      />
      <Button v-ripple label="Entrar em uma partida" class="p-ripple" />
    </div>
    <create-game-modal
      :show-create-modal="showCreateModal"
      @close-modal="closeCreateModal"
    />
  </div>
</template>
<script setup>
import lottie from 'lottie-web'
import { onMounted, ref } from 'vue'
import * as walkingAnimation from '~/assets/lottie/pathChoices.json'
const lottieWrapper = ref(null)
const showCreateModal = ref(false)
onMounted(() => {
  lottie.loadAnimation({
    container: lottieWrapper.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: JSON.parse(JSON.stringify(walkingAnimation)),
  })
})
const openCreateModal = () => {
  showCreateModal.value = true
}
const closeCreateModal = () => {
  showCreateModal.value = false
}
</script>
<style scoped>
.p-button {
  padding: 2rem 5rem;
  font-size: xx-large;
}
.lottie-wrapper {
  width: 15rem;
}
</style>
<style>
.create-game-modal {
  width: 80%;
}
</style>
