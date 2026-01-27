
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyBXrz_LFG44evIKLVBjYk4dYhaO9T2-FE0",
  authDomain: "zeze-da-sensi-ofc.firebaseapp.com",
  projectId: "zeze-da-sensi-ofc"
};

const ADM_EMAILS = ["rafaellaranga80@gmail.com"];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   PROTEÇÃO ADMIN
================================ */
onAuthStateChanged(auth, user => {
  if (!user || !ADM_EMAILS.includes(user.email)) {
    alert("Acesso negado — Admin apenas.");
    location.href = "index.html";
  }
});

/* ===============================
   ELEMENTOS
================================ */
const emailInput = document.getElementById("userEmail");
const btnVip = document.getElementById("btnVip");
const statusMsg = document.getElementById("statusMsg");

/* ===============================
   TOGGLE VIP
================================ */
btnVip.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    statusMsg.innerText = "❌ Digite um email válido";
    statusMsg.className = "erro";
    return;
  }

  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      statusMsg.innerText = "❌ Usuário não encontrado";
      statusMsg.className = "erro";
      return;
    }

    snap.forEach(async docSnap => {
      const ref = doc(db, "users", docSnap.id);
      const atual = docSnap.data().vip;

      await updateDoc(ref, { vip: !atual });

      statusMsg.innerText = atual
        ? "⚠️ VIP DESATIVADO"
        : "✅ VIP ATIVADO COM SUCESSO";
      statusMsg.className = "ok";
    });

  } catch (e) {
    console.error(e);
    statusMsg.innerText = "❌ Erro ao atualizar VIP";
    statusMsg.className = "erro";
  }
});
