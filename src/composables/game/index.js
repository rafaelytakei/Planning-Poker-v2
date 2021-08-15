import '../firebase/init'
import {
  child,
  getDatabase,
  push,
  ref,
  update,
  get,
  set,
  onDisconnect,
  onValue,
} from 'firebase/database'
import { ref as vueRef } from 'vue'
import to from 'await-to-js'
import { getUserName } from '../firebase'
export const db = getDatabase()
export const currentGameData = vueRef(null)
export * from './admin'
export * from './current'
export const initGame = async (userUid, gameSettings) => {
  // Updating games db
  const newGameKey = push(child(ref(db), 'games')).key
  const newGameData = {
    owner: userUid,
    name: gameSettings.name,
    deck: gameSettings.deck,
    currentRound: 0,
    rounds: [],
    activeUsers: [],
  }
  const updates = {}
  updates[`games/${newGameKey}`] = newGameData

  // Updating users db
  const userGameData = {
    isOwner: true,
    isAdmin: true,
    canStartRounds: true,
  }
  updates[`users/${userUid}/games/${newGameKey}`] = userGameData
  const [err] = await to(update(ref(db), updates))
  if (err) {
    console.error(`Error creating game ${newGameKey}`)
    return false
  }
  console.log(`Game ${newGameKey} created successfully!`)
  return newGameKey
}

export const getRoundInfo = async (gameUid, roundId) => {
  const roundRef = ref(db, `games/${gameUid}/rounds/${roundId}`)
  const [err, round] = await to(get(roundRef))
  if (err) {
    console.error(`Error getting round ${roundId} of game ${gameUid}`)
    return null
  }
  if (!round.exists()) {
    console.error(`Round ${roundId} was not found in game ${gameUid}`)
    return null
  }
  return round.val()
}

export const connectUserToGame = async (gameUid, userUid) => {
  const userInGame = await isUserInGame(gameUid, userUid)
  if (userInGame) {
    console.warn(`User ${userUid} is already in the game ${gameUid}`)
    return
  }
  const gameUsersRef = ref(db, `games/${gameUid}/users`)
  const userSettings = (await getUserSettingsInGame(gameUid, userUid)) || {
    isAdmin: false,
    isOwner: false,
    canStartRounds: false,
  }
  const [err] = await to(set(child(gameUsersRef, userUid), userSettings))
  if (err) {
    console.error(`Error connecting user ${userUid} to game ${gameUid}`)
    return
  }
  const userInGameRef = ref(db, `games/${gameUid}/users/${userUid}`)
  onDisconnect(userInGameRef).remove()
  const currentGameRef = ref(db, `games/${gameUid}`)
  onValue(currentGameRef, (snapshot) => {
    currentGameData.value = snapshot.val()
  })
}

export const gameHasRounds = async (gameUid) => {
  const gameRoundsRef = ref(db, `games/${gameUid}/rounds`)
  const [err, rounds] = await to(get(gameRoundsRef))
  if (err) {
    console.error(`Error getting rounds of game ${gameUid}`)
    return
  }
  if (!rounds.exists()) return false
  return true
}

const getUserSettingsInGame = async (gameUid, userUid) => {
  const dbRef = ref(db)
  const [err, snapshot] = await to(
    get(child(dbRef, `users/${userUid}/games/${gameUid}`))
  )
  if (err) {
    console.error(`Error getting game ${gameUid} settings for user ${userUid}`)
    return null
  }
  if (!snapshot.exists()) return null
  return snapshot.val()
}

const isUserInGame = async (gameUid, userUid) => {
  const dbRef = ref(db)
  const [err, snapshot] = await to(
    get(child(dbRef, `games/${gameUid}/users/${userUid}`))
  )
  if (err) {
    console.error(`Error getting users of game ${gameUid}`)
    return
  }
  if (!snapshot.exists()) return false
  return true
}

export const setUserCardInGame = async (gameUid, userUid, cardValue) => {
  const dbRef = ref(db)
  const [err] = await to(
    set(
      child(dbRef, `/games/${gameUid}/users/${userUid}/selectedCard`),
      cardValue
    )
  )
  if (err) {
    console.error(
      `Error setting card ${cardValue} for user ${userUid} in ${gameUid}`
    )
    return
  }
}

export const watchUsersInGame = (gameUid, usersRef) => {
  const usersInGameRef = ref(db, `/games/${gameUid}/users`)
  onValue(usersInGameRef, async (snapshot) => {
    const usersData = snapshot.val()
    const res = []
    if (!snapshot.exists()) return
    for (const [userUid, userData] of Object.entries(usersData)) {
      const name = await getUserName(userUid)
      const formattedData = {
        name,
        uid: userUid,
        data: userData,
      }
      res.push(formattedData)
    }
    usersRef.value = res
  })
}

export const startRound = async (gameUid, roundId) => {
  // Starting round
  const roundPlayedRef = ref(db, `/games/${gameUid}/rounds/${roundId}`)
  const currentGameUsersRef = ref(db, `/games/${gameUid}/users`)
  const [err1, snapshot1] = await to(get(currentGameUsersRef))
  if (err1) {
    console.error(`Error getting users from game ${gameUid}`)
    return
  }
  let allUsersCards = []
  if (snapshot1.exists()) {
    for (const val of Object.values(snapshot1.val())) {
      if (val.selectedCard) {
        allUsersCards.push(val.selectedCard)
      }
    }
  }
  const [err] = await to(
    set(roundPlayedRef, {
      played: true,
      cards: allUsersCards,
    })
  )
  if (err) {
    console.error(`Error while starting round ${roundId} of game ${gameUid}`)
    return
  }
  return allUsersCards
}

export const getCurrentRoundId = async (gameUid) => {
  const currentRoundRef = ref(db, `/games/${gameUid}/currentRound`)
  const [err, round] = await to(get(currentRoundRef))
  if (err) {
    console.error(`Error getting currentRound of game ${gameUid}`)
    return -1
  }
  if (!round.exists()) return -1
  return round.val()
}

export const deselectUserCard = async (gameUid, userUid) => {
  const userCardInGameRef = ref(
    db,
    `games/${gameUid}/users/${userUid}/selectedCard`
  )
  const [err] = await to(set(userCardInGameRef, ''))
  if (err) {
    console.error(`Error deselecting user's ${userUid} card in game ${gameUid}`)
    return
  }
}
