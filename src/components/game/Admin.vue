<template>
  <div>
    <Card class="admin-card">
      <template #title> Admin </template>
      <template #content>
        <Button class="mb-2" label="Criar novo round" @click="createRound" />
        <Button label="Iniciar round" @click="handleStartRound" />
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
const route = useRoute()
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
