<template>
  <div class="flex flex-column h-full">
    <h3 class="mt-6 text-center">Status do round: {{ currentStatus }}</h3>
    <div class="my-auto flex justify-content-between">
      <game-table
        class="my-auto"
        :current-game="currentGame"
        :users-in-game="usersInGame"
      />
      <game-admin
        v-if="adminPermissions"
        :current-game="currentGame"
        :users-in-game="usersInGame"
      />
    </div>
    <game-hand class="mt-auto" />
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { user } from '~/composables/firebase'
import {
  connectUserToGame,
  gameHasRounds,
  watchUsersInGame,
} from '~/composables/game'
import { currentGame, setCurrentGame } from '~/composables/game/current'
import { createNewRound } from '~/composables/game/round'
import {
  currentUserInGame,
  watchCurrentUserInGame,
} from '~/composables/game/user'

const route = useRoute()
const router = useRouter()
const adminPermissions = ref(false)
onMounted(async () => {
  if (!user.value) {
    router.push({
      path: '/',
      query: {
        from: `/game/${route.params.gameUid}`,
      },
    })
    return
  }
  await connectUserToGame(route.params.gameUid, user.value.uid)
  const hasRounds = await gameHasRounds(route.params.gameUid)
  if (!hasRounds) await createNewRound(route.params.gameUid)
  watchCurrentUserInGame()
})
setCurrentGame(route.params.gameUid)
const currentRound = computed(() => {
  const currentRoundId = currentGame.value?.currentRound
  if (!currentGame.value?.rounds) {
    return null
  }
  return currentGame.value?.rounds[currentRoundId]
})
const currentStatus = computed(() => {
  if (!currentRound.value) return 'Carregando...'
  if (currentRound?.value?.played) return 'Finalizado'
  return 'Aguardando votação...'
})
const usersInGame = ref()
watchUsersInGame(route.params.gameUid, usersInGame)

watch(
  () => JSON.parse(JSON.stringify(currentUserInGame.value)),
  (val) => {
    if (val) adminPermissions.value = val.isAdmin
  },
  { deep: true, immediate: true }
)
</script>
