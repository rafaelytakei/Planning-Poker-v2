<template>
  <Dialog v-model:visible="showModal" :modal="true" class="create-game-modal">
    <base-stepper :steps="createGameSteps"></base-stepper>
    <div v-if="currentStep === 0" class="flex align-items-center my-auto">
      <div ref="stepOneAnimationWrapper" class="w-4"></div>
      <div
        class="
          flex flex-column
          align-items-center
          h-full
          justify-content-center
          flex-1
        "
      >
        <h4 class="text-xl font-normal">Dê um nome para sua partida!</h4>
        <input-text
          id="createGameFormName"
          v-model="form.name"
          type="text"
          class="p-inputtext-lg w-full text-center"
        />
      </div>
    </div>
    <div v-else-if="currentStep === 1" class="flex align-items-center my-auto">
      <div ref="stepTwoAnimationWrapper" class="w-4"></div>
      <div
        class="
          flex flex-column
          align-items-center
          h-full
          justify-content-center
          flex-1
        "
      >
        <h4 class="text-xl font-normal">Selecione um deck de cartas</h4>
        <dropdown
          v-model="form.deck"
          :options="deckOptions"
          option-label="name"
          class="p-inputtext-lg w-full text-center"
        />
      </div>
    </div>
    <template #footer>
      <Button v-if="currentStep > 0" label="Voltar" @click="currentStep--" />
      <Button label="Avançar" class="ml-auto" @click="currentStep++" />
    </template>
  </Dialog>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  nextTick,
  onMounted,
  reactive,
  ref,
  watchEffect,
  watch,
} from 'vue'
import { getUser } from '~/composables/firebase'
import * as stepOneAnimation from '~/assets/lottie/meeting.json'
import * as stepTwoAnimation from '~/assets/lottie/aces.json'
import lottie from 'lottie-web'
import { deckOptions } from '~/composables/game/config'
const props = defineProps({
  showCreateModal: {
    type: Boolean,
    default: false,
  },
})
const showModal = ref(false)
const createGameSteps = ref(['Nome', 'Deck', 'Convites'])
const form = reactive({
  name: 'Nome do jogo',
  deck: null,
})
const currentStep = ref(0)
const user = ref({})
const stepOneAnimationWrapper = ref(null)
const stepTwoAnimationWrapper = ref(null)
const currentAnimation = ref(null)
watchEffect(async () => {
  if (props.showCreateModal) {
    currentStep.value = 0
    showModal.value = true
    await nextTick()
    document.getElementById('createGameFormName').select()
    currentAnimation.value = lottie.loadAnimation({
      container: stepOneAnimationWrapper.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(stepOneAnimation)),
    })
  }
})
watch(
  () => currentStep.value,
  async (newVal, oldVal) => {
    currentAnimation.value.destroy()
    await nextTick()
    if (newVal === 0) {
      currentAnimation.value = lottie.loadAnimation({
        container: stepOneAnimationWrapper.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: JSON.parse(JSON.stringify(stepOneAnimation)),
      })
    } else if (newVal === 1) {
      currentAnimation.value = lottie.loadAnimation({
        container: stepTwoAnimationWrapper.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: JSON.parse(JSON.stringify(stepTwoAnimation)),
      })
    }
  }
)
const emits = defineEmits(['close-modal'])
watchEffect(() => {
  if (!showModal.value) {
    emits('close-modal')
  }
})

onMounted(async () => {
  user.value = await getUser()
  if (user.value.isAnonymous) {
    form.name = `Jogo de anônimo`
  } else {
    form.name = user.value.displayName
  }
})
</script>

<style>
.create-game-modal .p-dialog-header {
  justify-content: flex-end;
}
.create-game-modal .p-dialog-content {
  min-height: 65vh;
  display: flex;
  flex-direction: column;
}
.create-game-modal .p-dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
