<template>
  <Dialog
    v-model:visible="showModal"
    :modal="true"
    class="create-game-modal"
    :show-header="currentStep < createGameSteps.length"
  >
    <base-stepper
      v-if="currentStep < createGameSteps.length"
      :steps="createGameSteps"
      :current-step="currentStep"
    ></base-stepper>
    <transition mode="out-in" name="fade">
      <div
        v-if="currentStep === 0"
        class="flex align-items-center my-auto pr-5"
      >
        <div class="grid w-full">
          <div class="col-4">
            <div ref="stepOneAnimationWrapper"></div>
          </div>
          <div
            class="
              flex flex-column
              align-items-center
              my-auto
              justify-content-center
              col-8
            "
          >
            <h4 class="text-xl font-normal">Dê um nome para sua partida</h4>
            <input-text
              id="createGameFormName"
              v-model="form.name"
              type="text"
              class="p-inputtext-lg w-full text-center"
            />
          </div>
        </div>
      </div>
      <div
        v-else-if="currentStep === 1"
        class="flex align-items-center my-auto pr-5"
      >
        <div class="grid w-full">
          <div class="col-4">
            <div ref="stepTwoAnimationWrapper"></div>
          </div>
          <div
            class="
              flex flex-column
              align-items-center
              my-auto
              justify-content-center
              col-8
            "
          >
            <h4 class="text-xl font-normal match-select-padding">
              Selecione um deck de cartas
            </h4>
            <dropdown
              v-model="form.deck"
              :options="deckOptions"
              option-label="name"
              class="p-inputtext-lg w-full text-center"
            >
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <span class="mr-1">{{ slotProps.option.name }}</span>
                  <span>({{ slotProps.option.deck.join(', ') }})</span>
                </div>
              </template>
            </dropdown>
          </div>
        </div>
      </div>
      <div
        v-else-if="currentStep === 2"
        class="flex align-items-center my-auto pr-5"
      >
        <div class="grid w-full">
          <div class="col-4">
            <div ref="summaryAnimationWrapper"></div>
          </div>
          <div class="flex flex-column my-auto justify-content-center col-8">
            <h4 class="text-xl font-normal text-center mb-4">
              Confirme os dados da partida
            </h4>
            <h5 class="text-xl mt-0 mb-2">
              Nome: <span class="font-normal"> {{ form.name }}</span>
            </h5>
            <h5 class="text-xl mt-0">
              Deck:
              <span class="font-normal">
                {{ form.deck.name }} ({{ form.deck.deck.join(', ') }})</span
              >
            </h5>
          </div>
        </div>
      </div>
      <div
        v-else-if="currentStep === 3"
        class="
          flex
          align-items-center
          justify-content-center
          my-auto
          success-wrapper
          pt-4
        "
      >
        <div ref="successAnimationWrapper" class="success-wrapper"></div>
      </div>
    </transition>
    <template v-if="currentStep < createGameSteps.length" #footer>
      <transition name="delayedFade" mode="out-in">
        <Button
          v-if="currentStep > 0 && currentStep < createGameSteps.length - 1"
          label="Voltar"
          @click="currentStep--"
        />
      </transition>
      <Button
        v-if="currentStep < createGameSteps.length - 1"
        label="Avançar"
        class="ml-auto"
        @click="currentStep++"
      />
      <Button
        v-else-if="currentStep === createGameSteps.length - 1"
        label="Finalizar"
        class="ml-auto"
        @click="createGame"
      />
    </template>
  </Dialog>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  nextTick,
  reactive,
  ref,
  watchEffect,
  watch,
} from 'vue'
import { getAnonymousName, user } from '~/composables/firebase'
import * as stepOneAnimation from '~/assets/lottie/meeting.json'
import * as stepTwoAnimation from '~/assets/lottie/aces.json'
import * as summaryAnimation from '~/assets/lottie/checklist.json'
import * as successAnimation from '~/assets/lottie/successCheck.json'
import lottie from 'lottie-web'
import { deckOptions } from '~/composables/game/config'
import { initGame } from '~/composables/game'
import { useRouter } from 'vue-router'
const props = defineProps({
  showCreateModal: {
    type: Boolean,
    default: false,
  },
})
const showModal = ref(false)
const createGameSteps = ref(['Nome', 'Deck', 'Confirmação'])
const form = reactive({
  name: 'Nome da partida',
  deck: deckOptions[0],
})
const currentStep = ref(0)
const stepOneAnimationWrapper = ref(null)
const stepTwoAnimationWrapper = ref(null)
const summaryAnimationWrapper = ref(null)
const successAnimationWrapper = ref(null)
const currentAnimation = ref(null)

const clearForm = async () => {
  if (user.value.isAnonymous) {
    const userName = await getAnonymousName(user.value.uid)
    form.name = `Jogo de ${userName}`
  } else {
    form.name = `Jogo de ${user.value.displayName}`
  }
  form.deck = deckOptions[0]
}
watch(
  () => props.showCreateModal,
  async (val) => {
    if (val) {
      await clearForm()
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
  }
)
watch(
  () => currentStep.value,
  async (newVal) => {
    currentAnimation.value.destroy()
    await nextTick()
    setTimeout(() => {
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
      } else if (newVal === 2) {
        currentAnimation.value = lottie.loadAnimation({
          container: summaryAnimationWrapper.value,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: JSON.parse(JSON.stringify(summaryAnimation)),
        })
        currentAnimation.value.setSpeed(1.5)
      } else if (newVal === 3) {
        currentAnimation.value = lottie.loadAnimation({
          container: successAnimationWrapper.value,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: JSON.parse(JSON.stringify(successAnimation)),
        })
      }
    }, 400)
  }
)
const emits = defineEmits(['close-modal'])
watchEffect(() => {
  if (!showModal.value) {
    emits('close-modal')
  }
})
const router = useRouter()
const createGame = async () => {
  currentStep.value++
  const newGameUid = await initGame(user.uid, form)
  setTimeout(() => {
    if (newGameUid) {
      router.push({
        path: `/game/${newGameUid}`,
      })
    }
  }, 2000)
}
</script>

<style>
.create-game-modal .p-dialog-header {
  justify-content: flex-end;
}
.create-game-modal {
  min-height: 85vh;
}
.create-game-modal .p-dialog-content {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.create-game-modal .p-dialog-footer {
  display: flex;
  justify-content: space-between;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.delayedFade-enter {
  transition-delay: 0.3s;
}
.delayedFade-enter-active,
.delayedFade-leave-active {
  transition-delay: 0.3s;
  transition: opacity 0.3s ease-in-out;
}
.delayedFade-enter,
.delayedFade-enter-from,
.delayedFade-leave-to {
  opacity: 0;
}
.match-select-padding {
  padding-right: 2.357rem;
}
.success-wrapper {
  height: 70%;
}
</style>
