import { onValue, ref, set } from 'firebase/database'
import { db } from '.'
import { user } from '../firebase'
import to from 'await-to-js'
import { gameUid } from './current'
import { ref as vueRef } from 'vue'
export const currentUserInGame = vueRef(null)
export const setUserSpectatorMode = async (value) => {
  const userInGameRef = ref(
    db,
    `games/${gameUid.value}/users/${user.value.uid}/isSpectator`
  )
  const [err] = await to(set(userInGameRef, value))
  if (err) {
    console.error(
      `Error setting user's ${user.value.uid} spectator mode in game ${gameUid.value}`
    )
    return
  }
}

export const watchCurrentUserInGame = () => {
  const userInGameRef = ref(
    db,
    `games/${gameUid.value}/users/${user.value.uid}`
  )
  onValue(userInGameRef, (snapshot) => {
    if (!snapshot.exists()) return null
    currentUserInGame.value = snapshot.val()
  })
}
