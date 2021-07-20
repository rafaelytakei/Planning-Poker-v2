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

// import { useRouter } from 'vue-router'
import router from '~/router'
const provider = new GoogleAuthProvider()
const auth = getAuth()

export const googleSignIn = async () => {
  const [err, res] = await to(signInWithPopup(auth, provider))
  if (err) {
    console.log('Error signing user in')
    return
  }
  const credential = GoogleAuthProvider.credentialFromResult(res)
  const token = credential.accessToken
  const user = res.user
  return { token, user }
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
}
