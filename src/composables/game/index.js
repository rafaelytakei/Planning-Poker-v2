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
const db = getDatabase()
export const currentGameData = vueRef(null)

export const initGame = async (userUid, gameSettings) => {
  // Updating games db
  const newGameKey = push(child(ref(db), 'games')).key
  const newGameData = {
    owner: userUid,
    name: gameSettings.name,
    deck: gameSettings.deck,
    currentRound: 0,
    permissions: {
      startRounds: [userUid],
      gameAdmin: [userUid],
    },
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
