<template>
  <div class="flex flex-column wrapper">
    <h5 class="text-center text-xl mt-0 mb-4">Suas cartas</h5>
    <div class="flex justify-content-evenly">
      <game-card
        v-for="gameCard in currentGameData?.deck?.deck"
        :key="gameCard"
        class="game-card"
        :card-value="gameCard"
        :active="userSelectedCard === gameCard"
        @click="selectCard(gameCard)"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '~/composables/firebase'
import { currentGameData, setUserCardInGame } from '~/composables/game'
const user = ref(null)
onBeforeMount(async () => {
  user.value = await getUser()
})
const route = useRoute()
const userSelectedCard = computed(() => {
  if (!currentGameData.value) return null
  return currentGameData.value.users[user.value.uid].selectedCard
})
const selectCard = (gameCard) => {
  setUserCardInGame(route.params.gameUid, user.value.uid, gameCard)
}
</script>
<style scoped>
.wrapper {
  border: solid var(--text-color);
  border-width: 2px 2px 0 2px;
  padding: 1rem 0;
}
</style>
