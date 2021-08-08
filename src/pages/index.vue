<template>
  <div
    class="flex flex-column justify-content-center align-items-center h-full"
  >
    <logo />
    <h5 class="text-xl font-normal">
      É necessário fazer login antes de continuar:
    </h5>
    <div class="flex flex-column">
      <Button
        label="Login com Google"
        class="mb-3"
        icon="pi pi-google"
        @click="handleGoogleSignIn"
      />
      <Button
        class="p-button-outlined"
        label="Continuar sem fazer login"
        @click="showAnonymousModal = true"
      />
    </div>
    <github-logo class="absolute bottom-0 right-0 p-4" />
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
      <form @submit.prevent="handleAnonymousSignIn">
        <input-text
          v-model="customUserName"
          type="text"
          class="p-inputtext-lg w-full text-center mb-4"
        />
        <Button
          label="Continuar"
          class="w-full"
          :loading="loading"
          type="submit"
        ></Button>
      </form>
    </Dialog>
  </div>
</template>
<route lang="yaml">
meta:
  layout: login
</route>
<script setup>
import { nextTick, ref, watch } from 'vue'
import lottie from 'lottie-web'
import * as anonymousAnimation from '~/assets/lottie/privacy.json'
import { anonymousSignIn, googleSignIn } from '~/composables/firebase'
import { useRoute, useRouter } from 'vue-router'
const showAnonymousModal = ref(false)
const anonymousAnimationWrapper = ref()
const customUserName = ref('')
const modalAnimation = ref(null)
const router = useRouter()
const route = useRoute()
const loading = ref(false)

watch(
  () => showAnonymousModal.value,
  async (val) => {
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
  }
)
const handleAnonymousSignIn = async () => {
  if (!customUserName.value) return
  loading.value = true
  const signIn = await anonymousSignIn(customUserName.value)
  if (signIn) {
    if (route.query.from) {
      router.push({
        path: route.query.from,
      })
    } else {
      router.push({
        path: '/menu',
      })
    }
  }
}
const handleGoogleSignIn = async () => {
  const signIn = await googleSignIn()
  if (signIn) {
    if (route.query.from) {
      router.push({
        path: route.query.from,
      })
    } else {
      router.push({
        path: '/menu',
      })
    }
  }
}
</script>

<style scoped>
.modal-animation-wrapper {
  width: 17.5rem;
  margin-bottom: -4rem;
  margin-top: -3rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
