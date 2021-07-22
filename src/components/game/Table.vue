<template>
  <div class="flex">
    <div
      v-for="user in usersInGame"
      class="flex flex-column mx-4 align-items-center"
    >
      <h4 class="text-2xl">{{ user.name }}</h4>
      <game-card
        :card-value="user.data.selectedCard"
        :empty="user.data.selectedCard === ''"
        :flipped="!currentRound.played && currentUser?.uid !== user.uid"
        disable-hover
      />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '~/composables/firebase'
import { watchUsersInGame } from '~/composables/game'

const props = defineProps({
  currentGame: {
    type: Object,
    default: () => {},
  },
})
const route = useRoute()
const currentUser = ref()
const usersInGame = ref()
watchUsersInGame(route.params.gameUid, usersInGame)
const currentRound = computed(() => {
  const currentRoundId = props.currentGame?.currentRound
  if (!props.currentGame || !props.currentGame.rounds) return {}
  return props.currentGame?.rounds[currentRoundId]
})
onMounted(async () => {
  currentUser.value = await getUser()
})
</script>
