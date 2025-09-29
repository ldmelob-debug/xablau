//  Chama as funcoes de desenho da HUD
let salvar;
let reiniciar;

function desenharHud(ct) {

    pontuacao(ct);
   
}

//  Desneha a pontuacao do jogador
function pontuacao(ct) {
    let desempenho = calcularDesempenho();
    let duracao = desempenho[0];
    let proporcao = desempenho[1];
    ct.font = `bold ${tela.dimensao * 60}px Copperplate Gothic`;
    ct.fillStyle = 'rgb(220, 180, 40)';
    ct.fillText(jogo.pontuacao,30*tela.dimensao,60*tela.dimensao);
    ct.font = `bold ${tela.dimensao * 10}px Copperplate Gothic`;
    ct.fillStyle = 'rgb(220, 120, 40)';
    ct.fillText(duracao,30*tela.dimensao,80*tela.dimensao);
    ct.font = `bold ${tela.dimensao * 20}px Copperplate Gothic`;
    ct.fillStyle = 'rgb(220, 120, 40)';
    ct.fillText(`(${proporcao}/s)`,30*tela.dimensao,100*tela.dimensao);
    
}

function formatarMilesimos(mil) {
    //  Calcular o tempo de jogo
    let min = Math.floor(mil / 60000);
    let seg = Math.floor((mil % 60000) / 1000)
    let cen = Math.floor((mil % 1000) / 10);
    let minutos = String(min).padStart(2, '0');
    let segundos = String(seg).padStart(2, '0');
    let centesimos = String(cen).padStart(2, '0');
    return minutos + ':' + segundos + ':' + centesimos;
}

//  Calcula informacoes de desempenho do jogador
function calcularDesempenho() {
    let milesimos = jogo.agora - jogo.inicio;
    let proporcao = 0;
    if (jogo.pontuacao > 0) {
        proporcao = Math.round((jogo.pontuacao / milesimos) * 10000) / 10;
    }
    let duracao = formatarMilesimos(milesimos);
    return [duracao, proporcao];
}
function salvarImagem() {

    salvar = document.createElement('input');
    salvar.id='s';
    salvar.type = 'button'
    salvar.value = 'SALVAR IMAGEM'
    salvar.style.display = 'block';
    salvar.style.position = 'absolute';
    salvar.style.width = tela.tamanho[0] * 0.5 + 'px';
    salvar.style.fontFamily = 'Copperplate Gothic';
    salvar.style.backgroundColor = 'rgb(80, 80, 160)';
    salvar.style.color = 'rgb(180, 180, 250)';
    salvar.style.fontSize = tela.dimensao * 12 + 'px';
    salvar.style.fontWeight = 'bold';
    salvar.style.height = parseInt(salvar.style.width) * 0.2 + 'px';
    salvar.style.left = parseInt(tela.canvas.style.left) + (tela.tamanho[0] * 0.25) + 'px';
    salvar.style.top = parseInt(tela.canvas.style.top) + (tela.tamanho[1]*0.65) + 'px';

    document.body.appendChild(salvar);

    const handleSalvar = (e) => {
        e.preventDefault();
        salvarimg();
    };

    salvar.onclick = handleSalvar;
    salvar.addEventListener('touchend', handleSalvar, { once: true });
}
function salvarimg() {
    const imgData = tela.canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${jogo.pontuacao} PTS - AVALANCHE`;
    link.click();
}
function reiniciarbt() {

    reiniciar = document.createElement('input');
    reiniciar.id='r';
    reiniciar.type = 'button'
    reiniciar.value = 'JOGAR NOVAMENTE'
    reiniciar.style.display = 'block';
    reiniciar.style.position = 'absolute';
    reiniciar.style.width = tela.tamanho[0] * 0.5 + 'px';
    reiniciar.style.fontFamily = 'Copperplate Gothic';
    reiniciar.style.backgroundColor = 'rgb(80, 160, 80)';
    reiniciar.style.color = 'rgb(180, 250, 180)';
    reiniciar.style.fontSize = tela.dimensao * 12 + 'px';
    reiniciar.style.fontWeight = 'bold';
    reiniciar.style.height = parseInt(reiniciar.style.width) * 0.2 + 'px';
    reiniciar.style.left = parseInt(tela.canvas.style.left) + (tela.tamanho[0] * 0.25) + 'px';
    reiniciar.style.top = parseInt(tela.canvas.style.top) + (tela.tamanho[1]*0.75) + 'px';

    document.body.appendChild(reiniciar);

    const handleReiniciar = (e) => {
        e.preventDefault();
        religar(reiniciar);
    };

    reiniciar.onclick = handleReiniciar;
    reiniciar.addEventListener('touchend', handleReiniciar, { once: true });

}