import { child, get, ref, set, update } from 'firebase/database'
import { db } from '.'
import to from 'await-to-js'
import { gameUid } from './current'

export const createNewRound = async (
  gameUid,
  roundSettings = { played: false }
) => {
  const gameRoundsRef = ref(db, `/games/${gameUid}/rounds/`)
  const [err, rounds] = await to(get(gameRoundsRef))
  if (err) {
    console.error(`Error getting game's ${gameUid} rounds`)
    return
  }
  let nextRoundId = 0
  if (rounds.exists()) {
    nextRoundId = Object.keys(rounds.val()).length
  }
  const [setErr] = await to(
    set(child(gameRoundsRef, `${nextRoundId}`), roundSettings)
  )
  if (setErr) {
    console.error(`Error creating a new round in game ${gameUid}`)
    return
  }
  return nextRoundId
}

export const setCurrentRound = async (gameUid, roundId) => {
  // Clearing selected cards from all users
  const usersInGameRef = ref(db, `/games/${gameUid}/users`)
  const [errUsers, usersInGame] = await to(get(usersInGameRef))
  if (errUsers) {
    console.error(`Error clearing selected cards from game ${gameUid}`)
    return
  }
  if (usersInGame.exists()) {
    const usersUids = Object.keys(usersInGame.val())
    const updates = {}
    for (const userUid of usersUids) {
      updates[`${userUid}/selectedCard`] = ''
    }
    await update(usersInGameRef, updates)
  }
  // Setting round
  const currentGameRoundRef = ref(db, `games/${gameUid}/currentRound`)
  const [err] = await to(set(currentGameRoundRef, roundId))
  if (err) {
    console.error(`Error setting game's ${gameUid} currentRound to ${roundId}`)
    return
  }
}

export const getRoundCards = async (roundId) => {
  const cardsRef = ref(db, `/games/${gameUid.value}/rounds/${roundId}/cards`)
  const [err, snapshot] = await to(get(cardsRef))
  if (err) {
    console.error(`Error getting cards on round ${roundId}`)
    return []
  }
  if (!snapshot.exists()) return []
  return Object.values(snapshot.val())
}
