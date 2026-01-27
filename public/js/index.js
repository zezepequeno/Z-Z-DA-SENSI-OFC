/* ===============================
   IMPORTS
================================ */
import {
  auth,
  db,
  loginGoogle,
  logout,
  watchAuth,
  getOrCreateUser
} from "./firebase.js";

import { GERAR_SENSI_IA } from "./sensi.js";

/* ===============================
   CONFIG
================================ */
const ADM_EMAILS = ["rafaellaranga80@gmail.com"];
const $ = id => document.getElementById(id);

/* ===============================
   BIND BOTÕES
================================ */
window.loginGoogle = loginGoogle;
window.logout = logout;

/* ===============================
   ESTADO DE LOGIN
================================ */
watchAuth(async user => {
  if (!user) {
    $("loginBox").style.display = "block";
    $("painel").style.display = "none";
    $("perfil").style.display = "none";
    return;
  }

  // UI
  $("loginBox").style.display = "none";
  $("painel").style.display = "block";
  $("perfil").style.display = "flex";
  $("email").innerText = user.email;

  // USER DATA
  const data = await getOrCreateUser(user);

  // VIP
  $("vipStatus").innerText = data.vip ? "VIP ATIVO 🔥" : "FREE";
  $("vipStatus").className = data.vip ? "vip" : "free";
  $("vipCTA").style.display = data.vip ? "none" : "block";

  // ADMIN BUTTON (SÓ ADM)
  if (ADM_EMAILS.includes(user.email)) {
    if (!$("adminBtn")) {
      const btn = document.createElement("button");
      btn.id = "adminBtn";
      btn.innerHTML = "⚙️ PAINEL ADMIN";
      btn.className = "admin-btn";
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
    alert("Digite o modelo do celular 🔍");
    return;
  }

  const vip = $("vipStatus").innerText.includes("VIP");
  const html = GERAR_SENSI_IA(modelo, vip);

  $("resultado").innerHTML = `
    <h3>🎯 SENSIBILIDADE IDEAL — FREE FIRE</h3>
    ${html}
  `;
};
