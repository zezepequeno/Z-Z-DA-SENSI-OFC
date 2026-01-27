/* ===============================
   GERADOR DE SENSI IA
================================ */

export function gerarSensiIA(input, specsAlt, vipAlt) {
  let modelo, specs, vip;

  if (typeof input === "object") {
    modelo = input.modelo;
    specs = {
      hz: input.hz || 60,
      chipset: input.chipset || "snapdragon",
      ram: input.ram || 6
    };
    vip = input.vip;
  } else {
    modelo = input;
    specs = specsAlt;
    vip = vipAlt;
  }

  const base = specs.hz === 120 ? 95 : 88;
  const ajusteChip = specs.chipset === "snapdragon" ? 4 : 2;
  const ajusteRam = specs.ram >= 8 ? 3 : 0;

  const geral = Math.min(100, base + ajusteChip + ajusteRam);
  const redDot = geral - 8;
  const mira2x = geral - 18;
  const mira4x = geral - 28;
  const awm = geral - 35;
  const olhar = geral + 5;

  if (!vip) {
    return `
      <div class="sensi-card free">
        <p>📱 <b>Modelo:</b> ${modelo}</p>
        <p>🎮 <b>Geral:</b> ${geral}</p>
        <p>🔴 <b>Red Dot:</b> ${redDot}</p>
        <p>🎯 <b>Mira 2x:</b> ${mira2x}</p>
        <div class="vip-lock">🔒 Conteúdo VIP bloqueado</div>
      </div>
    `;
  }

  return `
    <div class="sensi-card vip">
      <p>📱 <b>${modelo}</b></p>
      <p>⚡ ${specs.hz}Hz</p>
      <p>🧠 ${specs.chipset}</p>
      <p>💾 ${specs.ram}GB RAM</p>
      <hr>
      <p>🎮 Geral: ${geral}</p>
      <p>🔴 Red Dot: ${redDot}</p>
      <p>🎯 Mira 2x: ${mira2x}</p>
      <p>🎯 Mira 4x: ${mira4x}</p>
      <p>🔫 AWM: ${awm}</p>
      <p>👁️ Olhadinha: ${olhar}</p>
    </div>
  `;
}
