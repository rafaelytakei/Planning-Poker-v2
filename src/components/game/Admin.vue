<template>
  <div>
    <Card class="admin-card">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <span>Admin</span>
          <i
            class="pi pi-cog cursor-pointer"
            @click="showAdminSidebar = true"
          />
        </div>
      </template>
      <template #content>
        <div class="flex flex-column">
          <Button
            v-if="currentRound.played"
            class="mb-2"
            label="Criar novo round"
            @click="handleCreateRound"
          />
          <Button v-else label="Iniciar round" @click="handleStartRound" />
          <div class="flex align-items-center mt-4">
            <InputSwitch v-model="spectatorMode" class="mr-2" />
            <span>Modo espectador</span>
          </div>
        </div>
      </template>
    </Card>
    <game-admin-sidebar
      :users-in-game="usersInGame"
      :show="showAdminSidebar"
      @hide-admin-sidebar="showAdminSidebar = false"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { startRound } from '~/composables/game'
import { currentGame, currentRound } from '~/composables/game/current'
import { createNewRound, setCurrentRound } from '~/composables/game/round'
import { setUserSpectatorMode } from '~/composables/game/user'
const route = useRoute()
const showAdminSidebar = ref(false)
defineProps({
  usersInGame: {
    type: Array,
    default: () => [],
  },
})
const spectatorMode = ref(false)
watch(
  () => spectatorMode.value,
  async (val) => {
    await setUserSpectatorMode(val)
  }
)
const handleCreateRound = async () => {
  const newRoundId = await createNewRound(route.params.gameUid, {
    played: false,
  })
  await setCurrentRound(route.params.gameUid, newRoundId)
}
const handleStartRound = async () => {
  const currentRoundId = currentGame.value.currentRound
  await startRound(route.params.gameUid, currentRoundId)
}
</script>

<style scoped>
.admin-card {
  width: 15rem;
  background-color: var(--text-color);
  color: var(--surface-a);
}
.p-inputswitch:hover :deep(.p-inputswitch-slider) {
  background-color: #304562;
}
</style>
