<template>
  <div>
    <Dialog
      v-model:visible="showModal"
      header="Resumo do round"
      modal
      class="summary-modal"
    >
      <div class="graph">
        <div v-for="card in deck" class="graph__entry">
          <div
            class="graph__entry__bar"
            :style="{
              height: `${
                (200 * parseInt(pickedCards[card] ? pickedCards[card] : 0)) /
                highestCardCount
              }px`,
            }"
          >
            {{ pickedCards[card] || '' }}
          </div>
          <div class="graph__entry__number">
            {{ card }}
          </div>
        </div>
      </div>
      <!-- <Chart type="pie" :data="currentChartData" /> -->
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { currentGame, currentRound } from '~/composables/game'
import { getRoundCards } from '~/composables/game/round'

const showModal = ref(true)

const pickedCards = ref({})
const highestCardCount = ref(1)
const deck = ref([])
watch(
  () => currentRound.value,
  async (val, old) => {
    if (!old.played && val.played) {
      console.log('why')
      deck.value = Object.values(currentGame.value.deck.deck)
      showModal.value = true
      const vals = {}
      const finalVals = []
      const roundCards = await getRoundCards(currentGame.value.currentRound)

      for (const card of roundCards) {
        vals[card] = vals[card] ? vals[card] + 1 : 1
        if (vals[card] > highestCardCount.value) {
          highestCardCount.value = vals[card]
        }
      }
      for (const card of deck.value) {
        if (vals[card]) finalVals.push(vals[card])
      }
      pickedCards.value = vals
    }
  },
  { deep: true }
)
</script>

<style>
.summary-modal {
  width: 30rem;
}
.graph__entry {
  display: flex;
  flex-direction: column;
  width: 40px;
  align-items: center;
  align-self: flex-end;
  margin: 0 0.25rem;
}
.graph {
  display: flex;
}
.graph__entry__bar {
  width: 100%;
  transition: height 1s ease-in;
  background-color: #8b9097;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.graph__entry__number {
  width: calc(40px + 0.5rem);
  text-align: center;
  border-top: #8b9097 2px solid;
  margin: 0 -2rem;
}
</style>
