<template>
  <div class="flex flex-column h-full">
    <small-logo />
    <h3 class="mt-6 text-center">Status do round: {{ currentStatus }}</h3>
    <div class="my-auto flex justify-content-between">
      <game-table class="my-auto" :current-game="currentGame" />
      <game-admin />
    </div>
    <game-hand class="mt-auto" />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser } from '~/composables/firebase'
import { connectUserToGame, watchGame } from '~/composables/game'

const route = useRoute()
const router = useRouter()
onMounted(async () => {
  const user = await getUser()
  if (!user) {
    router.push({
      path: '/',
      query: {
        from: `/game/${route.params.gameUid}`,
      },
    })
    return
  }
  connectUserToGame(route.params.gameUid, user.uid)
})
const currentGame = ref()
watchGame(route.params.gameUid, currentGame)
const currentRound = computed(() => {
  const currentRoundId = currentGame?.value?.currentRound
  return currentGame?.value?.rounds[currentRoundId]
})
const currentStatus = computed(() => {
  if (!currentRound.value) return 'Carregando...'
  if (currentRound?.value?.played) return 'Finalizado'
  return 'Aguardando votação...'
})
</script>
