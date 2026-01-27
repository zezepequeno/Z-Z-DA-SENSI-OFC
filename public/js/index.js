import { loginGoogle, logout, watchAuth, getOrCreateUser } from "./firebase.js";
import { GERAR_SENSI_IA } from "./sensi.js";

const ADM_EMAILS = ["rafaelaranja90@gmail.com"];
const $ = id => document.getElementById(id);

window.loginGoogle = loginGoogle;
window.logout = logout;

watchAuth(async user => {
  if (!user) {
    $("loginBox").style.display = "block";
    $("painel").style.display = "none";
    $("perfil").style.display = "none";
    return;
  }

  $("loginBox").style.display = "none";
  $("painel").style.display = "block";
  $("perfil").style.display = "flex";
  $("email").innerText = user.email;

  const data = await getOrCreateUser(user);
  const vip = data && data.vip === true;

  $("vipStatus").innerText = vip ? "VIP ATIVO 🔥" : "FREE";
  $("vipStatus").className = vip ? "status vip" : "status free";
  $("vipCTA").style.display = vip ? "none" : "block";

  if (ADM_EMAILS.includes(user.email) && !$("adminBtn")) {
    const btn = document.createElement("button");
    btn.id = "adminBtn";
    btn.className = "admin-btn";
    btn.innerText = "⚙️ PAINEL ADMIN";
    btn.onclick = () => location.href = "admin.html";
    $("painel").prepend(btn);
  }
});

window.gerarSensi = () => {
  const modelo = $("modelo").value.trim();
  if (!modelo) return alert("Selecione o celular");

  const vipAtivo = $("vipStatus").innerText.includes("VIP");
  $("resultado").innerHTML = GERAR_SENSI_IA(modelo, vipAtivo);
};
