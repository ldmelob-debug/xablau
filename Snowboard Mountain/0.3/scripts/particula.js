// Classe base para uma partícula individual
class Particula {

    constructor(x, y, vx, vy, vida, tamanho, cor, gravidade = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.vida = vida;
        this.vidaInicial = vida; // Usado para calcular o desvanecimento
        this.tamanho = tamanho;
        this.cor = cor;
        this.gravidade = gravidade;
    }

    atualizar(delta) {
        // Reduz o tempo de vida
        this.vida -= delta;

        // Aplica a gravidade na velocidade vertical
        this.vy += this.gravidade * delta;

        // Atualiza a posição com base na velocidade
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        // Se a vida acabou, remove a partícula do jogo
        if (this.vida <= 0) {
            jogo.removerParticula(this);
        }
    }

    desenhar(ctx) {
        // Calcula a opacidade com base no tempo de vida restante para um efeito de fade-out
        const opacidade = Math.max(0, this.vida / this.vidaInicial);

        // Salva o estado atual do contexto para não afetar outros desenhos
        ctx.save();

        // Define a cor e a opacidade
        ctx.globalAlpha = opacidade;
        ctx.fillStyle = this.cor;

        // Desenha a partícula como um círculo
        ctx.beginPath();
        ctx.arc(this.x * tela.dimensao, this.y * tela.dimensao, this.tamanho * tela.dimensao, 0, Math.PI * 2);
        ctx.fill();

        // Restaura o estado do contexto
        ctx.restore();
    }
}