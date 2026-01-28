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

// LOGIN GOOGLE
window.loginGoogle = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) { await signInWithRedirect(auth, provider); } 
    else { await signInWithPopup(auth, provider); }
};

window.logout = () => signOut(auth).then(() => location.reload());

// MONITOR DE LOGIN
onAuthStateChanged(auth, async (user) => {
    const loginBox = document.getElementById("loginBox");
    const appUI = document.getElementById("app");
    
    if (user) {
        loginBox.style.display = "none";
        appUI.style.display = "block";
        document.getElementById("userEmail").innerText = user.email;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().vip) {
            document.getElementById("vipStatus").innerText = "VIP ATIVO 🔥";
            document.getElementById("vipStatus").classList.add("active-vip");
            document.getElementById("vipSection").style.display = "block";
        } else {
            await setDoc(docRef, { email: user.email, vip: false }, { merge: true });
        }
    } else {
        loginBox.style.display = "block";
        appUI.style.display = "none";
    }
});

// GERADOR
window.gerarSensi = () => {
    const modelo = document.getElementById("modeloCelular").value;
    if (!modelo) return alert("Digite o modelo do celular!");
    
    const n = Math.floor(Math.random() * 10) + 90;
    document.getElementById("resultadoSensi").innerHTML = `
        <div class="res-box">
            <p style="color:#888; font-size:0.7rem;">Sensi para ${modelo.toUpperCase()}</p>
            <p>🔴 Geral: <b>${n}</b></p>
            <p>🎯 Mira 2x: <b>${n-5}</b></p>
            <p>🖱️ DPI: <b>600</b></p>
        </div>
    `;
};
getRedirectResult(auth).catch(() => {});
