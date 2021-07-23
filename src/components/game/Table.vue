<template>
  <div class="flex">
    <div
      v-for="player in usersInGame"
      class="flex flex-column mx-4 align-items-center"
    >
      <h4 class="text-2xl">{{ player.name }}</h4>
      <game-card
        :card-value="
          player.data.selectedCard !== '' &&
          !currentRound.played &&
          user?.uid !== player.uid
            ? ''
            : player.data.selectedCard
        "
        :empty="player.data.selectedCard === ''"
        :flipped="
          player.data.selectedCard !== '' &&
          !currentRound.played &&
          user?.uid !== player.uid
        "
        disable-hover
      />
    </div>
  </div>
</template>
<script setup>
import { computed, ref, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '~/composables/firebase'
import { watchUsersInGame } from '~/composables/game'

const props = defineProps({
  currentGame: {
    type: Object,
    default: () => {},
  },
})
const route = useRoute()
const usersInGame = ref()
watchUsersInGame(route.params.gameUid, usersInGame)
const currentRound = computed(() => {
  const currentRoundId = props.currentGame?.currentRound
  if (!props.currentGame || !props.currentGame.rounds) return {}
  return props.currentGame?.rounds[currentRoundId]
})
</script>
