<template>
  <div class="flex">
    <template v-for="player in usersInGame">
      <div
        v-if="!player.data.isSpectator"
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
    </template>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { user } from '~/composables/firebase'

const props = defineProps({
  currentGame: {
    type: Object,
    default: () => {},
  },
  usersInGame: {
    type: Array,
    default: () => [],
  },
})

const currentRound = computed(() => {
  const currentRoundId = props.currentGame?.currentRound
  if (!props.currentGame || !props.currentGame.rounds) return {}
  return props.currentGame?.rounds[currentRoundId]
})
</script>
