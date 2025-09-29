//  Define o corpo da pagina
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = 'rgb(120,120,120)';

//  Define os principais recursos do jogo
var jogo=new Jogo(240,400);
var tela=new Tela('rgb(240,240,240)');
var controle = new Controle(tela.canvas);
var loop = new Loop(atualiza, desenha, 60);

//  Funcao de atualizar
function atualiza(delta) { 
    jogo.atualizar(delta);
}

//  Funcao de desenhar
function desenha() { 
    tela.ctx.clearRect(0,0,tela.tamanho[0], tela.tamanho[1]);
    tela.ajustar();
    jogo.desenhar(tela.ctx);
}

//Funcao para iniciar o jogo
function iniciar() {
    loop.inicio();
}

//Inicia o jogo
iniciar();
