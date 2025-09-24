//Definicoes do controle do jogador
class Controle {

    constructor(cv) {

        //Definicoes basicas
        this.posi = 0; //posicao gravada
        this.posia = 0; //posicao atual
        this.pular = false; //torna verdadeiro quando o controle de pular ativa
        this.posY = 0;
        this.atuY = 0;
        this.movendo = false;
        this.ligar=this.ligar.bind(this);
        this.desligar=this.desligar.bind(this);
        this.mover=this.mover.bind(this);
        document.body.addEventListener('keydown', this.teclado);
        document.body.addEventListener('keyup', this.desligaTeclado);
        cv.addEventListener('mousedown', this.ligar);
        cv.addEventListener('mouseup', this.desligar);
        cv.addEventListener('mouseleave', this.desligar);
        cv.addEventListener('mousemove', this.mover);
        cv.addEventListener('touchstart', this.ligar);
        cv.addEventListener('touchend', this.desligar);
        cv.addEventListener('touchmove', this.mover);
        cv.addEventListener('contextmenu', function(event) { event.preventDefault();})

    }
    //  Desligar controle do teclado
    desligaTeclado() {
        controle.movendo = false;
    }
    //  Controle via teclado
    teclado(e) {
        let salto = 30;
        switch(e.key) {
            case 'ArrowUp':
                controle.pular = true;
                break;
            case 'ArrowLeft':
                controle.posia = jogo.tamanho[0] / -2;
                break;

            case 'ArrowRight':
                controle.posia = jogo.tamanho[0] / 2;
                break;
        }
        console.log(controle.posia);
        if (controle.posia > jogo.tamanho[0] /2) {
            controle.posia = jogo.tamanho[0] /2;
        } else if (controle.posia < jogo.tamanho[0] / -2) {
            controle.posia = -jogo.tamanho[0] /2;
        }
        controle.movendo = true;

    }

    //Retornar offset
    offset(e) {
        let x;
        let y;
        if (e.touches && e.touches.length > 0) {
            //TOUCH
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
        } else {
            x = e.pageX;
            y = e.pageY;
        }
        let xOff = x - tela.canvas.offsetLeft;
        let yOff = y - tela.canvas.offsetTop;
        return [xOff, yOff];

    }

    // Atualizacao do clock
    atualizar(dt) {

        //Verifica se esta se movendo
        if(!this.movendo && !this.pular) {
            //  Não está se movendo, reduz a aceleração
            if(this.posi>0) {
                this.posi-=300*dt;
            } else if(this.posi<0) {
                this.posi+=300*dt;
            }
            this.atuY = 0;
            this.posY = 0;
        } else if (!this.pular) {
            //Caminha na direção da posição atual
            if(this.posia>this.posi) {
                this.posi+=300*dt;
            } else if(this.posia<this.posi) {
                this.posi-=300*dt;
            }
            if (this.posY - this.atuY > 15) {
                this.pular = true;
            }
            //  Define a posição Y do mouse com a atual.
            this.posY = this.atuY;
        }

    }

    //  Mouse e clicado
    ligar(e) {
        e.preventDefault()
        let x=this.offset(e)[0];
        let y=this.offset(e)[1];
        this.movendo = true;
        this.posia = (x - (tela.tamanho[0]/2)) / tela.dimensao;
        this.posY = (y - (tela.tamanho[0]/2)) / tela.dimensao;
        this.atuY = this.posY;

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
            let x=this.offset(e)[0];
            let y=this.offset(e)[1];
            this.posia = (x - (tela.tamanho[0]/2)) / tela.dimensao;
            this.atuY = (y - (tela.tamanho[0]/2)) / tela.dimensao;
        }
        
    }

}
