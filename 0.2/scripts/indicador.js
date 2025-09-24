// Classe de objeto indicador para dar feedback visual da pontuação
class Indicador {
    
    constructor(x, y, valor) {

        this.x = x;
        this.y = y;
        this.tamanho=24;
        this.valor = valor;
        this.vida = 0;

    }

    atualizar(delta) {

        this.vida += delta;
        this.tamanho -= delta * 10;
        this.y -= delta*5;
        if(this.vida >= 1) {
            jogo.removerIndicador(this);
        }

    }
    
    desenhar(ctx) {

        ctx.font = `bold ${tela.dimensao * this.tamanho}px Copperplate Gothic`;
        ctx.fillStyle = 'rgb(220, 180, 40)';
        ctx.fillText(this.valor, this.x, this.y);

    }

}