//  Define o corpo da pagina
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = 'rgb(120,120,120)';
document.body.style.color = 'rgba(220, 240, 220, 1)';

var jogo;
var tela;
var controle;
var loop;

//  Define os principais recursos do jogo
function recursos() {
    jogo=new Jogo(360,600);
    tela=new Tela('rgb(240,240,240)');
    controle = new Controle(tela.canvas);
    loop = new Loop(atualiza, desenha, 60);
}

//  Funcao de atualizar
function atualiza(delta) { 
    jogo.atualizar(delta);
}

//  Funcao de desenhar
function desenha() { 
    tela.ctx.clearRect(0,0,tela.tamanho[0], tela.tamanho[1]);
    tela.ajustar();
    tela.ctx.fillStyle = 'rgba(240, 240, 240, 1)';
    tela.ctx.fillRect(0, 0, tela.tamanho[0], tela.tamanho[1]);
    jogo.desenhar(tela.ctx);
}

//Funcao para iniciar o jogo
function iniciar() {
    recursos();
    loop.inicio();
}

function religar(janela) {
    document.body.removeChild(tela.canvas);
    document.body.removeChild(janela);
    iniciar();
}

//Inicia o jogo
iniciar();
