//Definicoes do controle do jogador
class Controle {

    constructor() {

        //Definicoes basicas
        this.posi = 0; //posicao gravada
        this.atuX = 0;
        this.posX = 0; //posicao atual
        this.pular = false; //torna verdadeiro quando o controle de pular ativa
        this.posY = 0;
        this.atuY = 0;
        this.movendo = false;
        this.ligar=this.ligar.bind(this);
        this.desligar=this.desligar.bind(this);
        this.mover=this.mover.bind(this);
        this.forca = 400;
        document.body.addEventListener('keydown', this.teclado);
        document.body.addEventListener('keyup', this.desligaTeclado);
        document.body.addEventListener('mousedown', this.ligar);
        document.body.addEventListener('mouseup', this.desligar);
        document.body.addEventListener('mouseleave', this.desligar);
        document.body.addEventListener('mousemove', this.mover);
        document.body.addEventListener('touchstart', this.ligar);
        document.body.addEventListener('touchend', this.desligar);
        document.body.addEventListener('touchmove', this.mover);
        document.body.addEventListener('contextmenu', function(event) { event.preventDefault();})

    }
    //  Desligar controle do teclado
    desligaTeclado() {
        controle.movendo = false;
    }
    //  Controle via teclado
    teclado(e) {
        switch(e.key) {
            case 'ArrowUp':
                controle.pular = true;
                audio.pulo();
                break;
            case 'ArrowLeft':
                controle.atuX = jogo.tamanho[0] / -2;
                break;

            case 'ArrowRight':
                controle.atuX = jogo.tamanho[0] / 2;
                break;
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
        let at = this.forca * dt;
        //Verifica se esta se movendo
        if(!this.movendo && !this.pular) {

            //  Não está se movendo, reduz a aceleração
            if(this.posi> 0 + at) {
                this.posi-=at;
            } else if(this.posi< 0 - at) {
                this.posi+=at;
            } else {
                this.posi = 0;
            }
            this.atuY = 0;
            this.posY = 0;

        } else if (!this.pular) {
            //Caminha na direção da posição atual
            if(this.posX>this.posi) {
                this.posi+=at;
            } else if(this.posX<this.posi) {
                this.posi-=at;
            }
            //  Detecta pulos
            if (this.posY - this.atuY > 15) {
                this.pular = true;
                audio.pulo();
            }
            //  Define a posição Y do mouse com a atual.
            
        }
        let vl = jogo.jogador.forcaPulo - (jogo.gravidade * jogo.jogador.tempoPulo);
        if (this.pular && vl > 0) {
            // Verificar ativação de manobras

        }

        this.posY = this.atuY;
        this.posX = this.atuX;
        
    }

    //  Mouse e clicado
    ligar(e) {
        e.preventDefault()
        let x=this.offset(e)[0];
        let y=this.offset(e)[1];
        this.movendo = true;
        this.posX = (x - (tela.tamanho[0]/2)) / tela.dimensao;
        this.atuX = this.posX;
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
            this.atuX = (x - (tela.tamanho[0]/2)) / tela.dimensao;
            this.atuY = (y - (tela.tamanho[0]/2)) / tela.dimensao;
        }
        
    }
}