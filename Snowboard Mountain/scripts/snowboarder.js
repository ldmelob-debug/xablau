class Jogador { //  cria a classe do Jogador
    constructor() { //  definições iniciais
        this.x = jogo.tamanho[0]/2;
        this.y =  jogo.tamanho[1]/6;
        this.largura = 15;
        this.altura = 50;
        this.rotacao = 0;
        this.velo=0;
    }

    //bloquear saída do jogador da tela
    bloqpos() {
        if (this.x<0) {
            this.x=0;
        } else if (this.x>jogo.tamanho[0]) {
            this.x=jogo.tamanho[0];
        }
    }

    //  função que atualiza a posição do jogador
    atualizar(dt) {
        this.velo=controle.posi*2;
        this.x+=this.velo*dt;
        this.bloqpos(); //bloquear jogador de sair da tela
    }

    //define a área de colisão
    colisao(){
        let ix=this.x-(this.largura/2);
        let iy=this.y-(this.altura/2);
        let fx=this.x+(this.largura/2);
        let fy=this.y+(this.largura/2);
        return [ix,iy,fx,fy];
    }

    //  função que desenha o jogador
    desenhar(ct) { 
        //definindo posições
        let alturaReal=this.altura * tela.dimensao;
        let larguraReal=this.largura * tela.dimensao;
        let xReal = this.x * tela.dimensao;
        let yReal = this.y * tela.dimensao;

        //definindo a rotação do jogador
        ct.save();
        ct.translate(xReal, yReal);
        ct.rotate(this.velo / -270);

        //desenhando as partes

        //prancha
        ct.fillStyle='rgb(140,140,140)';
        ct.beginPath();
        ct.arc(0, (larguraReal/2)-(alturaReal/2), larguraReal/2, 0, Math.PI,1);
        ct.fill();
        ct.stroke();
        ct.beginPath();
        ct.arc(0, (alturaReal/2) - (larguraReal/2), larguraReal/2, 0, Math.PI);
        ct.fill();
        ct.stroke();
        ct.beginPath();
        ct.rect(- (larguraReal / 2), (larguraReal/2) - (alturaReal / 2) - 1, larguraReal, alturaReal - larguraReal + 2);
        ct.fillStyle = 'rgb(170,170,170)';
        ct.fill();
        ct.stroke();

        //restaurar rotação padrão
        ct.restore();
    }
}
