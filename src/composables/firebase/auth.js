import to from 'await-to-js'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
} from 'firebase/auth'
import { get, getDatabase, ref, set } from 'firebase/database'
import { ref as vueRef } from 'vue'

const provider = new GoogleAuthProvider()
const auth = getAuth()

export const googleSignIn = async () => {
  const [err] = await to(signInWithPopup(auth, provider))
  if (err) {
    console.log('Error signing user in')
    return
  }
  const user = await getUser()
  await setUserNameOnDb(user.uid, user.displayName)
  return true
}

export const anonymousSignIn = async (customName) => {
  const [err] = await to(signInAnonymously(auth))
  if (err) {
    console.log(`Error signing in anonymously`)
    return false
  }
  const user = await getUser()
  await setUserNameOnDb(user.uid, customName)
  return true
}

export const getAnonymousName = async (userUid) => {
  const db = getDatabase()
  const userRef = ref(db, `users/${userUid}/name`)
  const [err, snapshot] = await to(get(userRef))
  if (err) {
    console.error(`Error getting name for the anonymous user ${userUid}`)
    return 'Anônimo'
  }
  if (!snapshot.exists()) return 'Anônimo'
  return snapshot.val()
}

const setUserNameOnDb = async (userUid, userName) => {
  const db = getDatabase()
  const userRef = ref(db, `users/${userUid}/name`)
  const [err] = await to(set(userRef, userName))
  if (err) {
    console.error(`Error setting name ${userName} for user ${userUid}`)
    return
  }
}

export const getUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => {
        unsubscribe()
        resolve(u)
      },
      reject
    )
  })
}

export const signUserOut = async () => {
  const [err] = await to(signOut(auth))
  if (err) {
    console.error('Error signing user out')
    return
  }
  user.value = null
}

export const getUserName = async (userUid) => {
  const db = getDatabase()
  const userRef = ref(db, `/users/${userUid}/name`)
  const [err, snapshot] = await to(get(userRef))
  if (err) {
    console.error(`Error getting name for user ${userUid}`)
    return 'Anonymous'
  }
  if (!snapshot.exists()) return 'Anonymous'
  return snapshot.val()
}

export const user = vueRef(null)

export const updateUser = async () => {
  user.value = await getUser()
}
