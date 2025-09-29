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
    jogo = new Jogo(320, 600);
    tela = new Tela('rgb(240,240,240)');
    controle = new Controle();
    loop = new Loop(atualiza, desenha, 60);
}

//  Funcao de atualizar
function atualiza(delta) {
    jogo.atualizar(delta);
}

//  Funcao de desenhar
function desenha() {
    tela.ctx.clearRect(0, 0, tela.tamanho[0], tela.tamanho[1]);
    tela.ctx.fillStyle = 'rgba(240, 240, 240, 1)';
    tela.ctx.fillRect(0, 0, tela.tamanho[0], tela.tamanho[1]);
    jogo.desenhar(tela.ctx);
}

//Funcao para iniciar o jogo
function iniciar() {
    recursos();
    tela.ajustar();
    loop.inicio();
}

function removerBotoes() {
    document.body.removeChild(reiniciar);
    document.body.removeChild(salvar);
}
function religar() {
    document.body.removeChild(tela.canvas);
    removerBotoes();
    reiniciar = null;
    salvar = null;
    loop.parar();
    iniciar();
}

// --- NOVA LÓGICA DO BOTÃO DE INICIAR ---

function criarBotaoIniciar() {
    const botaoIniciar = document.createElement('input');
    botaoIniciar.id = 'iniciar-jogo';
    botaoIniciar.type = 'button';
    botaoIniciar.value = 'INICIAR JOGO';
    
    // Estilo inspirado nos botões de hud.js, mas com valores fixos
    // porque o objeto 'tela' ainda não foi inicializado.
    botaoIniciar.style.display = 'block';
    botaoIniciar.style.position = 'absolute';
    botaoIniciar.style.width = '250px';
    botaoIniciar.style.height = '50px';
    botaoIniciar.style.fontFamily = 'Copperplate Gothic, sans-serif';
    botaoIniciar.style.backgroundColor = 'rgb(80, 160, 80)';
    botaoIniciar.style.color = 'rgb(180, 250, 180)';
    botaoIniciar.style.fontSize = '20px';
    botaoIniciar.style.fontWeight = 'bold';
    botaoIniciar.style.border = '2px solid rgb(180, 250, 180)';
    botaoIniciar.style.borderRadius = '5px';
    botaoIniciar.style.cursor = 'pointer';
    
    // Centraliza o botão na tela
    botaoIniciar.style.left = '50%';
    botaoIniciar.style.top = '50%';
    botaoIniciar.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(botaoIniciar);

    botaoIniciar.onclick = function() {
        iniciarJogoEAudio(botaoIniciar);
    };
}

function iniciarJogoEAudio(botao) {
    // Inicializa o contexto de áudio e o efeito de vento
    if (!audio.inicializado) {
        audio.inicializar();
        audio.criarVento();
    }

    // Remove o botão da tela
    document.body.removeChild(botao);

    // Inicia o jogo
    iniciar();
}

// Em vez de iniciar o jogo diretamente, cria o botão para o usuário iniciar.
window.onload = function() {
    criarBotaoIniciar();
};