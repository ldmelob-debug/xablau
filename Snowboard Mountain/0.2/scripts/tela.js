//Classe que trata a tela
class Tela {

    constructor(corTela) {

        this.corTela = corTela;
        this.tamanho=[0,0];
        this.canvas = this.novoCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.backgroundColor = this.corTela;
        this.dimensao = this.tamanho[0]/jogo.tamanho[0];

    }

    //Funcao para ajustar a tela
    ajustar() {
        
        let canvas = this.canvas;

        //Guarda o tamanho da tela onde o jogo esta inserido
        let largura=window.innerWidth;
        let altura=window.innerHeight;

        //Verifica se a tela esta em retrato ou em paisagem
        if(largura > altura * jogo.proporcao) {

            //Modo paisagem
            this.tamanho[0] = altura * jogo.proporcao;
            this.tamanho[1] = altura;
            canvas.style.top = '0px';
            canvas.style.left = (largura - this.tamanho[0]) / 2 + 'px';

        } else {

            //Modo retrato
            this.tamanho[0] = largura;
            this.tamanho[1] = largura / jogo.proporcao;
            canvas.style.top = (altura - this.tamanho[1]) / 2 + 'px';
            canvas.style.left = '0px';

        }

        //Atualiza o tamanho do canvas e a dimensao do jogo
        canvas.width = this.tamanho[0];
        canvas.height = this.tamanho[1];
        this.dimensao = this.tamanho[0] / jogo.tamanho[0];
        this.ctx.lineWidth = 2 * this.dimensao; 

    }

    //Cria o canvas na tela para o jogo
    novoCanvas() {
        let canvas = document.createElement('canvas');
        canvas.id = 'tela';
        document.body.appendChild(canvas);
        canvas.style.display = 'block';
        canvas.style.position ='absolute';
        return canvas;
    }
    
}