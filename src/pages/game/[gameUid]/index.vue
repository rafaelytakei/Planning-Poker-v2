<template>
  <div class="flex flex-column h-full">
    <small-logo />
    <game-table class="my-auto" />
    <game-hand class="mt-auto" />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '~/composables/firebase'
import { connectUserToGame } from '~/composables/game'

const route = useRoute()

onMounted(async () => {
  const user = await getUser()
  connectUserToGame(route.params.gameUid, user.uid)
})
</script>
