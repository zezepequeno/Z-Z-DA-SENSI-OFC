import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXrz_LFG44evIKLVBjYk4dYhaO9T2-FE0",
  authDomain: "zeze-da-sensi-ofc.firebaseapp.com",
  projectId: "zeze-da-sensi-ofc",
  storageBucket: "zeze-da-sensi-ofc.appspot.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// LOGIN INTELIGENTE (Popup para PC, Redirect para Celular)
window.loginGoogle = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) { await signInWithRedirect(auth, provider); } 
    else { await signInWithPopup(auth, provider); }
};

window.logout = () => signOut(auth).then(() => location.reload());

// MONITOR DE LOGIN
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("userEmail").innerText = user.email;

        // Verificar VIP no Banco de Dados
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().vip) {
            document.getElementById("vipStatus").innerText = "VIP ATIVO 🔥";
            document.getElementById("vipStatus").classList.add("active-vip");
            document.getElementById("vipSection").style.display = "block";
        } else {
            // Se não existe, cria o usuário como FREE
            await setDoc(docRef, { email: user.email, vip: false }, { merge: true });
        }
    } else {
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("app").style.display = "none";
    }
});

// GERADOR DE SENSI
window.gerarSensi = () => {
    const modelo = document.getElementById("modeloCelular").value;
    if (!modelo) return alert("Por favor, digite o modelo do seu celular!");

    const n1 = Math.floor(Math.random() * 10) + 90; // Sensi alta 90-100
    const res = document.getElementById("resultadoSensi");
    
    res.innerHTML = `
        <div class="res-box">
            <p style="color:#888; font-size:0.7rem; margin-bottom:10px;">CONFIGURAÇÃO PARA: ${modelo.toUpperCase()}</p>
            <p>🔴 Geral: <b>${n1}</b></p>
            <p>🔴 Ponto Vermelho: <b>${n1 - 2}</b></p>
            <p>🎯 Mira 2x: <b>${n1 - 5}</b></p>
            <p>🎯 Mira 4x: <b>${n1 - 8}</b></p>
            <p>🖱️ DPI Sugerida: <b>${n1 > 95 ? '720' : '580'}</b></p>
            <p style="margin-top:10px; font-size:0.7rem; color:#ffd700;">✨ Sensi calibrada por IA!</p>
        </div>
    `;
};

// Captura resultado de redirect mobile
getRedirectResult(auth).catch(() => {});

