/* ===============================
   FIREBASE CONFIG + INIT
   Arquivo: js/firebase.js
================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
   CONFIG DO PROJETO
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyBXrz_LFG44evIKLVBjYk4dYhaO9T2-FE0",
  authDomain: "zeze-da-sensi-ofc.firebaseapp.com",
  projectId: "zeze-da-sensi-ofc",
  storageBucket: "zeze-da-sensi-ofc.appspot.com"
};

/* ===============================
   INIT APP
================================ */
const app = initializeApp(firebaseConfig);

/* ===============================
   EXPORTS BASE
================================ */
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

/* ===============================
   LOGIN GOOGLE
================================ */
export async function loginGoogle() {
  try {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (e) {
    console.error("Erro no login:", e);
    alert("Erro ao fazer login. Tente novamente.");
  }
}

/* ===============================
   TRATAR REDIRECT (MOBILE)
================================ */
getRedirectResult(auth).catch(err => {
  console.error("Redirect error:", err);
});

/* ===============================
   LOGOUT
================================ */
export async function logout() {
  try {
    await signOut(auth);
    location.reload();
  } catch (e) {
    console.error("Erro no logout:", e);
    alert("Erro ao sair.");
  }
}

/* ===============================
   OBSERVAR AUTH
================================ */
export function watchAuth(callback) {
  return onAuthStateChanged(auth, user => {
    callback(user || null);
  });
}

/* ===============================
   CRIAR / BUSCAR USUÁRIO
================================ */
export async function getOrCreateUser(user) {
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const data = {
      email: user.email,
      vip: false,
      createdAt: Date.now()
    };

    await setDoc(ref, data);
    return data;
  }

  return snap.data();
}

/* ===============================
   ATUALIZAR VIP (ADMIN)
================================ */
export async function setVip(uid, status) {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { vip: status });
}
