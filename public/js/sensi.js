import { gerarSensiIA } from "./ai-sensi.js";

export function GERAR_SENSI_IA(modelo, vipStatus) {
  try {
    // Passa o modelo e se o usuário é VIP para a lógica da IA
    return gerarSensiIA(modelo, vipStatus);
  } catch (e) {
    console.error("Erro ao gerar:", e);
    return `<p style="color:red;">⚠️ Erro ao calcular sensibilidade.</p>`;
  }
}
