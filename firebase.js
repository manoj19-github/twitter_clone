import {initializeApp,getApp,getApps} from "firebase/app"
import {
  getFirestore
}from "firebase/firestore"
import {getStorage} from "firebase/storage"
export const firebaseConfig = {
  apiKey: "AIzaSyC-_CZnJJfTbyF_BX-Y4QjXFXJqVNs3MuE",
  authDomain: "twitter-clone-3d92b.firebaseapp.com",
  projectId: "twitter-clone-3d92b",
  storageBucket: "twitter-clone-3d92b.appspot.com",
  messagingSenderId: "708760681277",
  appId: "1:708760681277:web:355c789c1c51031246e354",
  measurementId: "G-P7D7FLVT2R"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
