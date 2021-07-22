<template>
  <div>
    <Card class="admin-card">
      <template #title> Admin </template>
      <template #content>
        <Button class="mb-2" label="Criar novo round" @click="createRound" />
        <Button
          v-if="!currentRound.played"
          label="Iniciar round"
          @click="handleStartRound"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  createNewRound,
  getCurrentRoundId,
  setCurrentRound,
  startRound,
} from '~/composables/game'
import { defineProps, computed } from 'vue'
const route = useRoute()
const props = defineProps({
  currentGame: {
    type: Object,
    default: () => {},
  },
})
const currentRound = computed(() => {
  const currentRoundId = props.currentGame?.currentRound
  if (!props.currentGame || !props.currentGame.rounds) return {}
  return props.currentGame?.rounds[currentRoundId]
})
const createRound = async () => {
  const newRoundId = await createNewRound(route.params.gameUid, {
    played: false,
  })
  await setCurrentRound(route.params.gameUid, newRoundId)
}
const handleStartRound = async () => {
  const currentRoundId = await getCurrentRoundId(route.params.gameUid)
  await startRound(route.params.gameUid, currentRoundId)
}
</script>

<style scoped>
.admin-card {
  width: 15rem;
  background-color: var(--text-color);
  color: var(--surface-a);
}
</style>
