//  Chama as funcoes de desenho da HUD
function desenharHud(ct) {

    pontuacao(ct);

}

//  Desneha a pontuacao do jogador
function pontuacao(ct) {

    ct.font = (tela.dimensao*36) + 'px Arial';
    ct.fillStyle = 'black';
    ct.fillText(jogo.pontuacao,30*tela.dimensao,30*tela.dimensao);
    
}