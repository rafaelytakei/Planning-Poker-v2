<template>
  <Card class="summary-card">
    <template #title>
      <div class="flex">
        <span>Resumo</span>
      </div>
    </template>
    <template #content>
      <Chart type="pie" :data="currentChartData" />
    </template>
  </Card>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import {
  currentChartData,
  currentGame,
  currentRound,
  showSummaryChart,
} from '~/composables/game'
import { getRoundCards } from '~/composables/game/round'

watch(
  () => currentRound.value,
  async (val) => {
    console.log(val)
    if (val.played) {
      const deck = Object.values(currentGame.value.deck.deck)
      const vals = {}
      const finalVals = []
      const roundCards = await getRoundCards(currentGame.value.currentRound)
      for (const card of roundCards) {
        vals[card] = vals[card] ? vals[card] + 1 : 1
      }
      for (const card of deck) {
        if (vals[card]) finalVals.push(vals[card])
      }
      const graphData = {
        labels: deck.filter((card) => vals[card]),
        datasets: [
          {
            label: 'Cartas',
            backgroundColor: [
              '#960200',
              '#696D7D',
              '#E3879E',
              '#6F9283',
              '#FEC0CE',
              '#8D9F87',
              '#E98A15',
              '#CDC6A5',
              '#F0DCCA',
              '#012622',
            ],
            data: finalVals,
          },
        ],
      }
      currentChartData.value = graphData
      showSummaryChart.value = true
    } else {
      showSummaryChart.value = false
    }
  },
  { deep: true }
)
</script>

<style scoped>
.summary-card {
  width: 15rem;
  background-color: var(--text-color);
  color: var(--surface-a);
}
</style>
