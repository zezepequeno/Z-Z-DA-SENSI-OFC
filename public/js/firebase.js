/* ===============================
   FIREBASE CONFIG
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   CONFIG DO SEU PROJETO
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyBXrz_LFG44evIKLVBjYk4dYhaO9T2-FE0",
  authDomain: "zeze-da-sensi-ofc.firebaseapp.com",
  projectId: "zeze-da-sensi-ofc",
  storageBucket: "zeze-da-sensi-ofc.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

/* ===============================
   INIT
================================ */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

/* ===============================
   LOGIN GOOGLE (AUTO MOBILE)
================================ */
export async function loginGoogle() {
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);
  if (isMobile) {
    await signInWithRedirect(auth, provider);
  } else {
    await signInWithPopup(auth, provider);
  }
}

/* ===============================
   LOGOUT
================================ */
export async function logout() {
  await signOut(auth);
  location.reload();
}

/* ===============================
   OBSERVAR LOGIN
================================ */
export function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

/* ===============================
   CRIAR / PEGAR USUÁRIO
================================ */
export async function getOrCreateUser(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      vip: false,
      createdAt: Date.now()
    });
    return { email: user.email, vip: false };
  }

  return snap.data();
}

/* ===============================
   ATUALIZAR VIP (ADMIN)
================================ */
export async function setVip(uid, status) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { vip: status });
}
