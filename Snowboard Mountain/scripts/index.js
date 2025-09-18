//  Define o corpo da página
function definirCorpo() { 
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#222';
}

//  Criação dos objetos principais
var jogo=new Jogo();
var tela=new Tela("white",);
var controle=new Controle(tela.canvas);
var jogador=new Jogador();
var semente=new Semente(27031999);
var gameLoop=new GameLoop(atualizar,renderizar,60);
jogo.addJogador(jogador);

//    Evento de início
function inicio() { 
    definirCorpo();
    gameLoop.inicio();
}

//    Função de atualização
function atualizar(delta) { 
    jogo.administrarObjetos(delta);
}

//    Função de renderização
function renderizar() { 
    tela.ajustar(tela.canvas);
    tela.contexto.clearRect(0,0,tela.canvas.width,tela.canvas.height);
    jogo.renderizarObjetos(tela.contexto);
}
inicio();
