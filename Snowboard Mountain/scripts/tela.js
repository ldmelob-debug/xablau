//Lembrar de manter a tela com as dimensões 3:4

class Tela { //Classe da tela
    constructor(corFundo) { //Define uma nova tela
        this.corFundo=corFundo;
        this.canvas=this.novoCanvas();
        this.proporcao=jogo.tamanho[0]/jogo.tamanho[1];
        this.contexto=this.canvas.getContext('2d');
        this.altura=window.innerHeight;
        this.largura=window.innerWidth;
        this.dimensao=Math.round(this.tamanho()[0]/jogo.tamanho[0]);
    }
    //Consultar tamanho do canvas do jogo
    tamanho() {
        return [this.canvas.width, this.canvas.height];
    }

    //Ajusta a tela
    ajustar(c) { 
        this.altura=window.innerHeight;
        this.largura=window.innerWidth;
        if (this.largura >= (this.altura * 0.75)) {
            this.casoNormal(c);
        } else {
            this.casoEstreito(c);
        }
        this.dimensao=this.tamanho()[0]/jogo.tamanho[0];
        this.contexto.lineWidth=1.5*this.dimensao;
    }
    casoNormal(c) { //Define a tela como paisagem
        c.height = this.altura;
        c.width = this.altura*this.proporcao;
        c.style.backgroundColor = this.corFundo;
        c.style.display = 'block';
        c.style.marginTop='0px';
        c.style.marginLeft='auto';
        c.style.marginRight='auto';
    }
    casoEstreito(c) { //Define a tela como retrato
        c.width=this.largura;
        c.height = this.largura/this.proporcao;
        c.style.backgroundColor = this.corFundo;
        c.style.display = 'block';
        c.style.marginTop=(window.innerHeight - c.height)/2 + 'px';
        c.style.marginLeft='auto';
        c.style.marginRight='auto';
    }
    novoCanvas() { //Cria o canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'tela';
        document.body.appendChild(canvas);
        return canvas;
    }
}