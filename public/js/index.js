import { loginGoogle, logout, watchAuth, getOrCreateUser } from "./firebase.js";
import { GERAR_SENSI_IA } from "./sensi.js";

const ADM_EMAILS = ["rafaelaranja90@gmail.com"];
const $ = id => document.getElementById(id);

// Funções Globais para o HTML
window.loginGoogle = loginGoogle;
window.logout = logout;

watchAuth(async (user) => {
    if (!user) {
        $("loginBox").style.display = "block";
        $("perfil").style.display = "none";
        $("painel").style.display = "none";
        return;
    }

    // Usuário Logado
    $("loginBox").style.display = "none";
    $("perfil").style.display = "block";
    $("painel").style.display = "block";
    $("email").innerText = user.email;

    // Buscar Dados VIP
    const userData = await getOrCreateUser(user);
    const isVip = userData && userData.vip === true;

    $("vipStatus").innerText = isVip ? "VIP ATIVO 🔥" : "FREE";
    $("vipStatus").className = `status ${isVip ? 'vip' : 'free'}`;
    $("vipCTA").style.display = isVip ? "none" : "block";

    // Botão de Admin
    if (ADM_EMAILS.includes(user.email) && !$("adminBtn")) {
        const adminBtn = document.createElement("button");
        adminBtn.id = "adminBtn";
        adminBtn.innerText = "⚙️ PAINEL ADMIN";
        adminBtn.style.cssText = "background:#222; color:#fff; border:1px solid #555; padding:5px 10px; border-radius:8px; cursor:pointer; margin-top:10px;";
        adminBtn.onclick = () => location.href = "admin.html";
        $("perfil").appendChild(adminBtn);
    }
});

window.gerarSensi = () => {
    const modelo = $("modelo").value.trim();
    if (!modelo) return alert("Por favor, digite o modelo do celular!");

    const isVip = $("vipStatus").innerText.includes("VIP");
    const resultadoHTML = GERAR_SENSI_IA(modelo, isVip);
    $("resultado").innerHTML = resultadoHTML;
};
