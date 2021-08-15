<template>
  <div class="flex flex-column wrapper">
    <h5 class="text-center text-xl mt-0 mb-4">Escolha uma carta</h5>
    <div class="flex justify-content-evenly">
      <game-card
        v-for="gameCard in currentGameData?.deck?.deck"
        :key="gameCard"
        class="game-card"
        :card-value="gameCard"
        :active="userSelectedCard === gameCard"
        @click="toggleCard(gameCard)"
      />
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '~/composables/firebase'
import {
  currentGameData,
  currentRound,
  deselectUserCard,
  setUserCardInGame,
} from '~/composables/game'
user
const route = useRoute()
const userSelectedCard = computed(() => {
  if (!currentGameData.value) return null
  return currentGameData.value.users[user.value.uid].selectedCard
})
const toggleCard = async (gameCard) => {
  if (!currentRound?.value?.played) {
    if (userSelectedCard.value === gameCard) {
      deselectCard()
    } else {
      selectCard(gameCard)
    }
  }
}
const selectCard = async (gameCard) => {
  await setUserCardInGame(route.params.gameUid, user.value.uid, gameCard)
}
const deselectCard = async () => {
  await deselectUserCard(route.params.gameUid, user.value.uid)
}
</script>
<style scoped>
.wrapper {
  border: solid var(--text-color);
  border-width: 2px 2px 0 2px;
  padding: 1rem 0;
}
</style>
