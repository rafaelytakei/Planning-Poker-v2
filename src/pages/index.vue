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
        @click="showAnonymousModal = true"
      />
    </div>
    <Dialog
      v-model:visible="showAnonymousModal"
      header="Login anônimo"
      :modal="true"
    >
      <div
        ref="anonymousAnimationWrapper"
        class="modal-animation-wrapper"
      ></div>
      <h5 class="text-xl font-normal text-center">
        Olá! Como podemos te chamar?
      </h5>
      <input-text
        v-model="customUserName"
        type="text"
        class="p-inputtext-lg w-full text-center"
      />
      <template #footer class="flex justify-content-center">
        <Button
          label="Continuar"
          class="w-full"
          @click="handleAnonymousSignIn"
        ></Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import lottie from 'lottie-web'
import * as anonymousAnimation from '~/assets/lottie/privacy.json'
import { anonymousSignIn, getUser, googleSignIn } from '~/composables/firebase'
import { useRouter } from 'vue-router'
const showAnonymousModal = ref(false)
const anonymousAnimationWrapper = ref()
const customUserName = ref('')
const modalAnimation = ref(null)
const router = useRouter()
watch(showAnonymousModal.value, async (val) => {
  if (val) {
    customUserName.value = ''
    await nextTick()
    modalAnimation.value = lottie.loadAnimation({
      container: anonymousAnimationWrapper.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(anonymousAnimation)),
    })
  } else {
    modalAnimation.value.destroy()
  }
})
const handleAnonymousSignIn = async () => {
  if (!customUserName.value) return
  const signIn = await anonymousSignIn(customUserName.value)
  if (signIn) {
    router.push({
      path: '/menu',
    })
  }
}
</script>

<style scoped>
.modal-animation-wrapper {
  width: 17.5rem;
  margin-bottom: -4rem;
  margin-top: -3rem;
}
</style>
