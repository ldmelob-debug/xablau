//  Classe para cada parte do objeto
class Parte {

    constructor(posicao, preenchimento, raio = 0, angulo = [], vertices = [], colide=false) {
             
        this.posicao = posicao;
        this.raio = raio;
        this.angulo = angulo;
        this.vertices = vertices;
        this.preenchimento = preenchimento;
        this.colide = colide;

    }

}

//  Classe geral para todos os objetos
class Objeto {

    constructor(x, y, partes, partesOriginais) {

        this.x = x;
        this.y = y;
        this.partes = partes;
        this.partesOriginais = partesOriginais;

    }

    //Calcula o tamanho do objeto
    tamanho() {

        let minimoY=Infinity;
        let maximoY=-Infinity;
        let minimoX=Infinity;
        let maximoX=-Infinity;
        let obj = this;

        //Verifica os limites que a figura atinge para calcular o tamanho dela.
        this.partesOriginais.forEach(function(parte) {

            let x;
            let y;

            if (parte.raio > 0) {

                //  Circulo
                y = parte.raio + parte.posicao[1];
                x = parte.raio + parte.posicao[0];
                if (parte.angulo[0] > parte.angulo[1]) {
                    y *= -1;
                    x *= -1;
                }
                if (y < minimoY) { minimoY = y; }
                if (y > maximoY) { maximoY = y; }
                if (x < minimoX) { minimoX = x; }
                if (x > maximoX) { maximoX = x; }

            } else {

                //  Poligono
                parte.vertices.forEach(function(vertice){ 
                    y = vertice[1] + parte.posicao[1];
                    x = vertice[0] + parte.posicao[0];
                    if (y < minimoY) { minimoY = y; }
                    if (y > maximoY) { maximoY = y; }
                    if (x < minimoX) { minimoX = x; }
                    if (x > maximoX) { maximoX = x; }
                });

            }  

        });

        return [maximoX - minimoX, maximoY - minimoY];

    }

    //Calcula o raio do objeto
    raio() {

        let raio;
        let tamanho = this.tamanho();
        if (tamanho[0] > tamanho[1]) {
            raio = tamanho[0] / 2;
        } else {
            raio = tamanho[1] / 2;
        }
        return raio;

    }

    //  Funcao para atualizar o objeto
    atualizar() {

    }

    //  Funcao para desenhar o objeto
    desenhar(ctx) {
        
        let ox = this.x;
        let oy = this.y;

        //  Chama todas as partes para serem desenhadas
        this.partes.forEach(function(parte) {
            exibir(ctx, parte, ox, oy);
        })

    }  

}