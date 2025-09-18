//Definições do controle do jogador
class Controle {
    constructor(cv) {
        //Definições básicas
        this.posi = 0;
        this.posia = 0;
        this.movendo = false;
        this.liga=this.liga.bind(this);
        this.desliga=this.desliga.bind(this);
        this.move=this.move.bind(this);
        cv.addEventListener('mousedown', this.liga);
        cv.addEventListener('mouseup', this.desliga);
        cv.addEventListener('mousemove', this.move);
        cv.addEventListener('touchstart', this.liga);
        cv.addEventListener('touchend', this.desliga);
        cv.addEventListener('touchmove', this.move);
    }

    // Atualização do clock
    atualiza(dt) {
        if(!this.movendo) { // torna o retorno do snowboard mais natural
            if(this.posi>0) {
                this.posi-=300*dt;
            } else if(this.posi<0) {
                this.posi+=300*dt;
            }
        } else {
            if(this.posia>this.posi) {
                this.posi+=300*dt;
            } else if(this.posia<this.posi) {
                this.posi-=300*dt;
            }
        }
    }

    //Mouse é clicado
    liga(e) {
        this.movendo = true;
        this.posia = (e.offsetX - (tela.tamanho()[0]/2)) / tela.dimensao;
    }

    //Mouse é solto
    desliga(e) {
        this.movendo=false;
    }

    //Mouse é movimentado
    move(e) {
        if (this.movendo) {
            this.posia = (e.offsetX - (tela.tamanho()[0]/2)) / tela.dimensao;
        }
    }
}