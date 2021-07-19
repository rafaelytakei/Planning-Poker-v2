<template>
  <div
    class="flex flex-column justify-content-center align-items-center h-full"
  >
    <logo />
    <h5 class="text-xl font-normal">
      Para iniciar, é recomendado que você faça login:
    </h5>
    <div class="flex flex-column">
      <Button
        label="Login com Google"
        class="mb-3"
        icon="pi pi-google"
        @click="googleSignIn"
      />
      <Button
        class="p-button-outlined"
        label="Continuar sem fazer login"
        @click="anonymousSignIn"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { anonymousSignIn, getUser, googleSignIn } from '~/composables/firebase'

onMounted(async () => {
  const user = await getUser()
  console.log(user)
})
</script>

<style></style>
