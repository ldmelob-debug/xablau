//chamar renderizações
function renderizarHud(ct) {
    pontuacao(ct);
}

//renderizar pontuação
function pontuacao(ct) {
    ct.font = (tela.dimensao*36) + 'px Arial';
    ct.fillStyle = 'black';
    ct.fillText(jogo.pontuacao,30*tela.dimensao,30*tela.dimensao);
}