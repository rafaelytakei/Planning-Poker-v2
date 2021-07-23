import { initializeApp } from 'firebase/app'
const firebaseConfig = {
  apiKey: 'AIzaSyB34m5JGcjT51rAhYvjTblCRGr5fpiYh0k',
  authDomain: 'planning-poker-v2.firebaseapp.com',
  projectId: 'planning-poker-v2',
  storageBucket: 'planning-poker-v2.appspot.com',
  messagingSenderId: '526678814880',
  appId: '1:526678814880:web:2c68d38feebeb9b43519c5',
  measurementId: 'G-2VDHFDKT9C',
  databaseURL: 'https://planning-poker-v2-default-rtdb.firebaseio.com/',
}

const firebaseApp = initializeApp(firebaseConfig)
export default firebaseApp
