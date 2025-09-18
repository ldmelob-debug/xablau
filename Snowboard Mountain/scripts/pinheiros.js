class Pinheiro { //constrói um pinheiro
    constructor(x, y, altura) {// definições iniciais
        this.x = x;
        this.y = y;
        this.altura = altura;
        this.largura = altura / 2;
        this.corTronco=this.novaCor(120,60,30);
        this.cores=[];
        for (let i = 0; i < this.qtdFolhas(); i++) {
            this.cores.push(this.novaCor(50,150,50));
            console.log(this.novaCor(50,150,50));
        }
    }

    //gera uma nova cor aleatória
    novaCor(r,g,b) {
        let novaCor = 'rgb(' + jogo.semente.aleatorioEntre(r-30,r+30) + ',' + jogo.semente.aleatorioEntre(g-30,g+30) + ',' + jogo.semente.aleatorioEntre(b-30,b+30) +')';
        return novaCor;
    }

    //define a área de colisão
    colisao(){
        let ix;
        let iy;
        let fx;
        let fy;
    }

    atualizar(dt) { //atualizar lógica e variáveis
        this.y -= jogo.velocidade * dt;
        if (this.y < this.altura*tela.dimensao*-1) {
            jogo.removePinheiro(this);
        }
    }
    qtdFolhas(){ //verificar quantos gomos de folhas este pinheiro tem
        return Math.floor(this.altura/24);
    }
    posicaoTronco(){ //retorna a localização exata do tronco
        let alturaReal=this.altura*tela.dimensao;
        let larguraReal=this.largura*tela.dimensao;
        let xReal = this.x * tela.dimensao
        let yReal = this.y * tela.dimensao
        let ini = [xReal - (larguraReal / 2), yReal - (alturaReal / 2)]; //inicio do desenho (x,y)
        let xinicial=ini[0]+(larguraReal*0.4);
        let yinicial=ini[1] + (alturaReal*0.75);
        let xfinal=xinicial+(larguraReal*0.2);
        let yfinal=yinicial+(alturaReal*0.25);
        return [xinicial,yinicial,xfinal,yfinal];
    }

    //Função que desenha o pinheiro
    desenhar(ct) { 
        //Calculando tamanho e posições
        let alturaReal=this.altura*tela.dimensao;
        let larguraReal=this.largura*tela.dimensao;
        let xReal = this.x * tela.dimensao
        let yReal = this.y * tela.dimensao
        let ini = [xReal - (larguraReal / 2), yReal - (alturaReal / 2)]; //inicio do desenho (x,y)
        let final = [xReal + (larguraReal / 2), yReal + (alturaReal / 2)];//fim do desenho (x,y)
        let folhas=this.qtdFolhas();
        let alturaFolha=(1/folhas)*alturaReal;
        let intercalado=(0.25/(folhas-1))*alturaReal;
        
        //Desenha tronco:
        ct.beginPath();
        ct.rect(this.posicaoTronco()[0],this.posicaoTronco()[1],larguraReal*0.2,alturaReal*0.25);
        ct.closePath()
        ct.fillStyle = this.corTronco;
        ct.fill();
        ct.stroke();

        //Loop desenha folhagem:
        for (let i = 0; i < this.qtdFolhas(); i +=1) {
             //Bases do triangulo
            let tt=0.25*alturaReal;
            let baseX = [ini[0]+(i*0.1*larguraReal),
                        final[0]-(i*0.1*larguraReal)];
            let baseY = [final[1]-(tt+(i*(alturaFolha-intercalado)+alturaFolha)),
                        final[1]-tt-(i*(alturaFolha-intercalado))];
            ct.beginPath();
            ct.moveTo(Math.round(baseX[0]), Math.round(baseY[1]));
            ct.lineTo(Math.round(baseX[0] + ((baseX[1]-baseX[0])/2)), Math.round(baseY[0]));
            ct.lineTo(Math.round(baseX[1]), Math.round(baseY[1]));
            ct.closePath();
            ct.fillStyle = this.cores[i];
            ct.fill();
            ct.stroke()
        }
    }
}