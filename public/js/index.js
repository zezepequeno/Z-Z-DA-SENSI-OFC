import { loginGoogle, logout, watchAuth, getOrCreateUser } from "./firebase.js";
import { GERAR_SENSI_IA } from "./sensi.js";

const ADM_EMAILS = ["rafaelaranja90@gmail.com"];
const $ = id => document.getElementById(id);

window.loginGoogle = loginGoogle;
window.logout = logout;

watchAuth(async user => {
    if (!user) {
        $("loginBox").style.display = "block";
        $("perfil").style.display = "none";
        $("painel").style.display = "none";
        return;
    }

    $("loginBox").style.display = "none";
    $("perfil").style.display = "block";
    $("painel").style.display = "block";
    $("email").innerText = user.email;

    const data = await getOrCreateUser(user);
    const isVip = data && data.vip === true;

    $("vipStatus").innerText = isVip ? "VIP ATIVO 🔥" : "FREE";
    $("vipStatus").className = `status ${isVip ? 'vip' : 'free'}`;
    $("vipCTA").style.display = isVip ? "none" : "block";

    if (ADM_EMAILS.includes(user.email) && !$("adminBtn")) {
        const btn = document.createElement("button");
        btn.id = "adminBtn";
        btn.innerText = "⚙️ PAINEL ADMIN";
        btn.style.cssText = "margin-top:10px; background:#222; color:#fff; border:1px solid #444; padding:5px; border-radius:5px; cursor:pointer;";
        btn.onclick = () => location.href = "admin.html";
        $("perfil").appendChild(btn);
    }
});

window.gerarSensi = () => {
    const modelo = $("modelo").value.trim();
    if (!modelo) return alert("Digite o modelo do celular!");
    const isVip = $("vipStatus").className.includes("vip");
    $("resultado").innerHTML = GERAR_SENSI_IA(modelo, isVip);
};
