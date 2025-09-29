//  Chama as funcoes de desenho da HUD
function desenharHud(ct) {

    pontuacao(ct);

}

//  Desneha a pontuacao do jogador
function pontuacao(ct) {

    ct.font = `bold ${tela.dimensao * 30}px Copperplate Gothic`;
    ct.fillStyle = 'rgb(220, 180, 40)';
    ct.fillText(jogo.pontuacao,30*tela.dimensao,30*tela.dimensao);
    
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

function relatorio(ct) {

    //  Definindo a janela de relatório
    let janela = document.createElement('div');
    janela.id='relatorio';
    janela.style.backgroundColor = 'rgba(130, 160, 130, 1)';
    janela.style.borderRadius = '20px';
    janela.style.position = 'absolute';
    janela.style.border = '4px solid rgb(40, 50, 40)';
    janela.style.display = 'block';
    janela.style.paddingTop = '0px';
    janela.style.textAlign = 'center';
    janela.style.width = tela.tamanho[0] * 0.5 + 'px';
    janela.style.height = tela.tamanho[1] * 0.3 + 'px';
    janela.style.top = parseInt(tela.canvas.style.top) + tela.tamanho[1]  * 0.4 + 'px';
    janela.style.left = parseInt(tela.canvas.style.left) + tela.tamanho[0] * 0.25 + 'px';
    let milesimos = jogo.fim - jogo.inicio;
    let proporcao = 0;
    if (jogo.pontuacao > 0) {
        proporcao = Math.round((jogo.pontuacao / milesimos) * 10000) / 10;
    }
    let duracao = formatarMilesimos(milesimos);
    //  Deifnindo o corpo da janela
    let infos = `<h2> Fim de jogo </h2>
    <p> <b> Pontuação: </b> ${jogo.pontuacao} (${proporcao}/s) </p>
    <p> <b> Duração: </b> ${duracao} </p>
    `;
    let urlDaImagem = tela.canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.text = 'Salvar imagem';
    link.href=urlDaImagem;
    link.download = 'SnowboardMountain.png'
    
    //  Formatação final da janela
    let reiniciar = document.createElement('input');
    reiniciar.type = 'button'
    reiniciar.value = 'Outra vez!'
    reiniciar.style.display = 'block';
    reiniciar.style.marginLeft = 'auto';
    reiniciar.style.marginRight = 'auto';
    janela.innerHTML += infos;
    janela.appendChild(link);
    janela.appendChild(reiniciar);
    document.body.appendChild(janela);
    reiniciar.onclick = function() {
        religar(janela);
    }
}