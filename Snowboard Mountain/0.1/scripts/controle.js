//Definicoes do controle do jogador
class Controle {

    constructor(cv) {

        //Definicoes basicas
        this.posi = 0;
        this.posia = 0;
        this.movendo = false;
        this.ligar=this.ligar.bind(this);
        this.desligar=this.desligar.bind(this);
        this.mover=this.mover.bind(this);
        cv.addEventListener('mousedown', this.ligar);
        cv.addEventListener('mouseup', this.desligar);
        cv.addEventListener('mousemove', this.mover);
        cv.addEventListener('touchstart', this.ligar);
        cv.addEventListener('touchend', this.desligar);
        cv.addEventListener('touchmove', this.mover);
        cv.addEventListener('contextmenu', function(event) { event.preventDefault();})

    }

    // Atualizacao do clock
    atualizar(dt) {

        //Verifica se esta se movendo
        if(!this.movendo) {
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

    //  Mouse e clicado
    ligar(e) {

        e.preventDefault()
        this.movendo = true;
        this.posia = (e.offsetX - (tela.tamanho[0]/2)) / tela.dimensao;

    }

    //Mouse e solto
    desligar(e) {

        e.preventDefault()
        this.movendo=false;

    }

    //Mouse e movimentado
    mover(e) {

        e.preventDefault()
        if (this.movendo) {
            this.posia = (e.offsetX - (tela.tamanho[0]/2)) / tela.dimensao;
        }
        
    }
}