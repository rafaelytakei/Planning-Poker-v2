import to from 'await-to-js'

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth'
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

export const anonymousSignIn = async () => {
  const [err] = await to(signInAnonymously(auth))
  if (err) {
    console.log(`Error signing in anonymously`)
    return
  }
  router.push({
    path: '/menu',
  })
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
