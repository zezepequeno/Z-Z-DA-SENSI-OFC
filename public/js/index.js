import { loginGoogle, logout, watchAuth, getOrCreateUser } from "./firebase.js";
import { GERAR_SENSI_IA } from "./sensi.js";

/* ===============================
   CONFIG
================================ */
const ADM_EMAILS = ["rafaelaranja90@gmail.com"];
const $ = id => document.getElementById(id);

/* ===============================
   EXPOR FUNÇÕES
================================ */
window.loginGoogle = loginGoogle;
window.logout = logout;

/* ===============================
   AUTH OBSERVER
================================ */
watchAuth(async user => {
  const loginBox = $("loginBox");
  const painel = $("painel");
  const perfil = $("perfil");
  const emailEl = $("email");
  const vipStatus = $("vipStatus");
  const vipCTA = $("vipCTA");

  if (!user) {
    if (loginBox) loginBox.style.display = "block";
    if (painel) painel.style.display = "none";
    if (perfil) perfil.style.display = "none";
    return;
  }

  // Usuário logado
  if (loginBox) loginBox.style.display = "none";
  if (painel) painel.style.display = "block";
  if (perfil) perfil.style.display = "flex";
  if (emailEl) emailEl.innerText = user.email;

  const data = await getOrCreateUser(user);
  const vip = data && data.vip === true;

  if (vipStatus) {
    vipStatus.innerText = vip ? "VIP ATIVO 🔥" : "FREE";
    vipStatus.className = vip ? "status vip" : "status free";
  }

  if (vipCTA) {
    vipCTA.style.display = vip ? "none" : "block";
  }

  // Botão admin (não duplica)
  if (ADM_EMAILS.includes(user.email) && !$("adminBtn")) {
    const btn = document.createElement("button");
    btn.id = "adminBtn";
    btn.className = "admin-btn";
    btn.innerText = "⚙️ PAINEL ADMIN";
    btn.onclick = () => location.href = "admin.html";
    painel.prepend(btn);
  }
});

/* ===============================
   GERAR SENSI
================================ */
window.gerarSensi = () => {
  const modeloInput = $("modelo");
  const resultado = $("resultado");
  const vipStatus = $("vipStatus");

  if (!modeloInput || !resultado) {
    alert("Erro interno no site");
    return;
  }

  const modelo = modeloInput.value.trim();
  if (!modelo) {
    alert("Digite o modelo do celular");
    return;
  }

  const vipAtivo = vipStatus && vipStatus.innerText.includes("VIP");

  try {
    resultado.innerHTML = GERAR_SENSI_IA(modelo, vipAtivo);
  } catch (e) {
    console.error(e);
    resultado.innerHTML = "<p>⚠️ Erro ao gerar sensibilidade</p>";
  }
};
