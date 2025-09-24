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