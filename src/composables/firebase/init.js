import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'planning-poker-v2.firebaseapp.com',
  projectId: 'planning-poker-v2',
  storageBucket: 'planning-poker-v2.appspot.com',
  messagingSenderId: '526678814880',
  appId: '1:526678814880:web:2c68d38feebeb9b43519c5',
  measurementId: 'G-2VDHFDKT9C',
  databaseURL: 'https://planning-poker-v2-default-rtdb.firebaseio.com/',
}

const firebaseApp = initializeApp(firebaseConfig)

initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.VITE_FIREBASE_RECAPTCHA_V3_TOKEN
  ),
  isTokenAutoRefreshEnabled: true,
})

export default firebaseApp
