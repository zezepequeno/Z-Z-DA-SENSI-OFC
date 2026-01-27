import {
  loginGoogle,
  logout,
  watchAuth,
  getOrCreateUser
} from "./firebase.js";

import { GERAR_SENSI_IA } from "./sensi.js";

/* ===============================
   CONFIG
================================ */
const ADM_EMAILS = ["rafaelaranja90@gmail.com"];
const $ = id => document.getElementById(id);

window.loginGoogle = loginGoogle;
window.logout = logout;

/* ===============================
   AUTH STATE
================================ */
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

  if (data.vip) {
    $("vipStatus").innerText = "VIP ATIVO 🔥";
    $("vipStatus").className = "status vip";
    $("vipCTA").style.display = "none";
  } else {
    $("vipStatus").innerText = "FREE";
    $("vipStatus").className = "status free";
    $("vipCTA").style.display = "block";
  }

  if (ADM_EMAILS.includes(user.email)) {
    if (!$("adminBtn")) {
      const btn = document.createElement("button");
      btn.id = "adminBtn";
      btn.className = "admin-btn";
      btn.innerText = "⚙️ PAINEL ADMIN";
      btn.onclick = () => location.href = "admin.html";
      $("painel").prepend(btn);
    }
  }
});

/* ===============================
   GERAR SENSI
================================ */
window.gerarSensi = () => {
  const modelo = $("modelo").value.trim();
  if (!modelo) {
    alert("Digite o modelo do celular.");
    return;
  }

  const vipAtivo = $("vipStatus").innerText.includes("VIP");
  const resultadoHTML = GERAR_SENSI_IA(modelo, vipAtivo);

  $("resultado").innerHTML = `
    <h3>🎯 SENSIBILIDADE IDEAL — FREE FIRE</h3>
    ${resultadoHTML}
  `;
};
