<template>
  <div class="flex">
    <div
      v-for="(step, i) in steps"
      class="step flex flex-column align-items-center flex-1 relative"
      :class="{
        active: i === currentStep,
        activated: i < currentStep,
      }"
    >
      <div
        class="
          step__icon
          border-circle border-2
          flex
          justify-content-center
          align-items-center
          font-bold
          text-xl
        "
        :class="{ ['cursor-pointer']: i < currentStep }"
        @click="setStep(i)"
      >
        {{ i + 1 }}
      </div>
      <span class="text-md mt-2">{{ step }}</span>
      <div class="step__line-after"></div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  steps: {
    type: Array,
    default: () => ['Ecossistema', 'Projeto', 'Whatever'],
  },
  currentStep: { type: Number, default: 0 },
})
const emits = defineEmits(['set-step'])
const setStep = (val) => {
  emits('set-step', val)
}
</script>

<style>
.step__icon {
  border-color: var(--primary-color);
  color: var(--primary-color);
  width: 2rem;
  height: 2rem;
}
.active .step__icon,
.activated .step__icon {
  background-color: var(--primary-color);
  color: #264653;
}
.step:not(:last-of-type) .step__line-after {
  margin-top: 1rem;
  margin-left: 1rem;
  content: '';
  height: 5px;
  width: calc(100% - 2rem);
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateY(-50%);
  border-top: 1px solid var(--primary-color);
  border-bottom: 1px solid var(--primary-color);
  transition: background 0.5s ease-out;
  background: linear-gradient(
    to left,
    var(--surface-a) 50%,
    var(--primary-color) 50%
  );
  background-size: 200%;
  background-position: 100%;
}
.activated.step:not(:last-of-type) .step__line-after {
  background-position: 0;
}
</style>
