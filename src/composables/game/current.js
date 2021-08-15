import { onValue, ref } from 'firebase/database'
import { ref as vueRef, computed } from 'vue'
import { db } from '.'

export const currentGame = vueRef(null)
export const gameUid = vueRef(null)
export const setCurrentGame = (uid) => {
  const gameRef = ref(db, `/games/${uid}`)
  onValue(gameRef, async (snapshot) => {
    if (!snapshot.exists()) return
    currentGame.value = snapshot.val()
    gameUid.value = uid
  })
}

export const currentRound = computed(() => {
  const currentRoundId = currentGame.value?.currentRound
  if (!currentGame.value || !currentGame.value.rounds) return {}
  return currentGame.value?.rounds[currentRoundId]
})

export const showSummaryChart = vueRef(false)
export const currentChartData = vueRef(null)
