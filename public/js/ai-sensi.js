export function gerarSensiIA(input, isVip) {
    const modelo = typeof input === 'object' ? input.modelo : input;
    
    // Lógica de cálculo "fake" porém realista para FF
    const base = isVip ? 94 : 85;
    const geral = Math.floor(Math.random() * (100 - base) + base);
    const redDot = geral - 5;
    const mira2x = geral - 12;
    const mira4x = geral - 20;

    return `
      <div class="sensi-resultado">
        <p style="color: #ff6a00; font-weight: bold; margin-bottom: 10px;">✅ SENSI GERADA PARA: ${modelo.toUpperCase()}</p>
        <p>🔴 Geral: <b>${geral}</b></p>
        <p>🔴 Red Dot: <b>${redDot}</b></p>
        <p>🎯 Mira 2x: <b>${mira2x}</b></p>
        <p>🎯 Mira 4x: <b>${mira4x}</b></p>
        <p>🖱️ DPI Sugerida: <b>${isVip ? '720' : '580'}</b></p>
        ${!isVip ? '<p style="font-size: 0.7rem; color: #888; margin-top: 10px;">⚠️ Use VIP para sensibilidade de Pro Player.</p>' : ''}
      </div>
    `;
}
