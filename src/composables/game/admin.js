import { get, ref, set } from 'firebase/database'
import { db } from '.'
import to from 'await-to-js'
import { gameUid } from './current'

export const setUserRoundsPermission = async (gameUid, userUid, allowance) => {
  const startRoundsPermissionRef = ref(
    db,
    `games/${gameUid}/permissions/startRounds/${userUid}`
  )
  const [err] = await to(set(startRoundsPermissionRef, allowance))
  if (err) {
    console.error(
      `Error allowing user ${userUid} to start rounds in the game ${gameUid}`
    )
    return
  }
  const gameInUserRef = ref(
    db,
    `users/${userUid}/games/${gameUid}/canStartRounds`
  )
  const [err2] = await to(set(gameInUserRef, allowance))
  if (err2) {
    console.error(
      `Error allowing user ${userUid} to start rounds in the game ${gameUid}`
    )
    return
  }
}

export const setUserAdminPermission = async (gameUid, userUid, allowance) => {
  const userIsAdminRef = ref(db, `games/${gameUid}/users/${userUid}/isAdmin`)
  const [err] = await to(set(userIsAdminRef, allowance))
  if (err) {
    console.error(
      `Error setting user ${userUid}'s admin permission in the game ${gameUid}`
    )
    return
  }
  const gameInUserRef = ref(db, `users/${userUid}/games/${gameUid}/isAdmin`)
  const [err2] = await to(set(gameInUserRef, allowance))
  if (err2) {
    console.error(
      `Error setting user ${userUid}'s admin permission in the game ${gameUid}`
    )
    return
  }
}

export const isUserAdmin = async (userUid) => {
  const adminCheckRef = ref(db, `users/${userUid}/games/${gameUid}/isAdmin`)
  const [err, snapshot] = await to(get(adminCheckRef))
  if (err) {
    console.error(
      `Error getting user's ${userUid} admin status in game ${gameUid.value}`
    )
    return false
  }
  if (!snapshot.exists()) return false
  return snapshot.val()
}
