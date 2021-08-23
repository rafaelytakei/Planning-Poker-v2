<template>
  <div class="flex table">
    <template v-for="player in usersInGame">
      <div
        v-if="!player.data.isSpectator"
        class="flex flex-column mx-4 align-items-center player"
      >
        <h4 class="text-lg text-center">{{ player.name }}</h4>
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
            player.data.selectedCard !== undefined &&
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

<style scoped>
.table {
  flex-wrap: wrap;
  width: 100%;
}

.player {
  flex: 0 1 100px;
  align-self: flex-end;
}
</style>
