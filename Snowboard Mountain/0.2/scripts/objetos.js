//  Neste codigo estao contidos todos os objetos

//  Snowboard (Jogador)
class Snowboard extends Objeto {

    constructor(x, y) {

        super(x, y);
        this.velocidade = 0;
        this.rotacaoAlmejada = 0;
        this.rotacao = 0;
        this.criarPartes();
        //  Variaveis para mecanica do pulo
        this.altura = 0;
        this.forcaPulo = 4.5;
        this.estadoPulo = 0;
        this.tempoPulo = 0;

    }
    
    //Verificar altura de uma forma
    tamanhoForma(parte) {
        let minimoY=Infinity;
        let maximoY=-Infinity;
        let minimoX=Infinity;
        let maximoX=-Infinity;
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

        return [maximoX - minimoX, maximoY - minimoY];
    }

    //Bloquear o jogador de sair da tela
    bloqpos() {

        if (this.x<0) {
            this.x=0;
        } else if (this.x>jogo.tamanho[0]) {
            this.x=jogo.tamanho[0];
        }

    }

    //Funcao para rodar uma coordenada
    rodarPonto(x, y, entidade) {

        let radiano = entidade.rotacao * -1;
        let sen = Math.sin(radiano);
        let cos = Math.cos(radiano);
        let novoX = x * cos - y * sen;
        let novoY = x * sen + y * cos;
        return [novoX, novoY];

    }

    //  Funcao para rodar a prancha
    rodar() {
        var rp = this.rodarPonto;
        var ente = this;
        ente.partes.forEach(function(parte, index) {
            var indicePai = index;
            if (parte.raio > 0) {
                parte.posicao = rp(ente.partesOriginais[index].posicao[0], ente.partesOriginais[index].posicao[1], ente);
                parte.angulo[0] = ente.partesOriginais[index].angulo[0] - ente.rotacao;
                parte.angulo[1] = ente.partesOriginais[index].angulo[1] - ente.rotacao;
            } else {
                let pt = parte;
                parte.vertices.forEach(function(vertice, indice) {
                    let verticeOriginal = ente.partesOriginais[indicePai].vertices[indice];
                    let novo = rp(verticeOriginal[0], verticeOriginal[1], ente);
                    vertice[0] = novo[0];
                    vertice[1] = novo[1];
                });
            }
        });

    }

    //Funcao que controla o pulo do personagem
    pulo(dt) {
        //Verifica se o jogador pulou
        if(controle.pular) {
            if(this.estadoPulo == 0) {
                //Iniciando o pulo
                this.estadoPulo = 1;
            } else if (this.estadoPulo == 1) {
                //Pulo em acao
                let vl = this.forcaPulo - (jogo.gravidade * this.tempoPulo);
                this.altura += vl;
                this.tempoPulo += dt;
                if(this.altura <= 0) {
                    this.tempoPulo = 0;
                    this.estadoPulo = 0;
                    this.altura = 0;
                    controle.pular = false;
                }
            } 
        }
    }

    //  Funcao do fim do jogo
    fim() {
        loop.parar();
        jogo.fim = new Date();
        relatorio(tela.ctx);
    }
    //  Funcao para atualizar a funcao do jogador.
    atualizar(delta) {
        this.pulo(delta);
        //  Ajusta o zoom de acordo com o pulo
        this.zoom = (this.altura * 0.005) + 1;
        this.velocidade = controle.posi * 2;
        this.rotacao = this.velocidade / 270;
        this.x += this.velocidade * delta;
        this.rodar(); //    Gira a prancha
        this.bloqpos(); //  Bloquea o personagem de sair da tela
        let verificacao = verificarRaio(this);
        if(verificacao[0]) {
            if(this.altura < this.tamanhoForma(verificacao[1])[1]) {
                this.fim(); // Fim de jogo
            } else {
                verificacao[1].objetoPai.pulado = true;
            }
        }
    }

    criarPartes() {

         //  Faz as partes do snowboard
        let parteSuperior = new Parte();
        let base = new Parte();
        let parteInferior = new Parte();

        //  Parte superior
        parteSuperior.posicao = [0, -16];
        parteSuperior.preenchimento = 'rgb(160, 160, 160)';
        parteSuperior.raio = 8;
        parteSuperior.angulo = [0, Math.PI];
        parteSuperior.colide=true;

        //  Parte inferior
        parteInferior.posicao = [0, 16];
        parteInferior.preenchimento = 'rgb(160, 160, 160)';
        parteInferior.raio = 8;
        parteInferior.angulo = [0, -Math.PI];
        parteInferior.colide=true;

        //  Base
        base.posicao = [0,0];
        base.vertices = [
            [-8, -16],
            [-8, 16],
            [8, 16],
            [8, -16]
        ];
        base.preenchimento = 'rgb(120, 120, 120)';
        base.colide = true;

        //  Definindo o objeto
        super.partes = [parteInferior, base, parteSuperior];
        super.partesOriginais = JSON.parse(JSON.stringify(this.partes));

    }

}

// Obstaculos
class Obstaculo extends Objeto {

    constructor(x, y) {
        super(x, y);
        this.ultrapassado = false;
        this.pulado = false;
    }

    atualizar(delta) {

        this.y-=jogo.velocidade * delta;

        if (this.y < jogo.jogador.y - jogo.jogador.tamanho()[1] && !this.ultrapassado) {
            let pts = 1;
            if (this.pulado) {
                 let ind = new Indicador(this.x, this.y, '+5');
                jogo.indicadores.push(ind);
                pts = 5;
            }
            jogo.pontuacao += pts;
            this.ultrapassado = true;
           
        }
        if (this.y < -(this.altura/2)) {
            // Objeto saiu da tela: remover.
            jogo.removerObjeto(this);
        }
        
    }

    variarCor(r, g, b) {

        r = r + jogo.aleatorio.entre(-20, 20);
        g = g + jogo.aleatorio.entre(-20, 20);
        b = b + jogo.aleatorio.entre(-20, 20);
        return 'rgb(' + r + ',' + g + ',' + b + ')';

    }
}

//  Pedras (obstaculos)
class Pedra extends Obstaculo {

    constructor(x, y, altura) {
        super(x, y);
        this.altura = altura;
        this.criarPartes();
    }

    criarPartes() {

        // Define as características da pedra
        let largura = this.altura * jogo.aleatorio.entre(0.8, 1.2);
        let numVertices = jogo.aleatorio.entre(5, 8); // Número de vértices para o polígono
        let raioBase = largura / 2;
        let corPedra = this.variarCor(100, 100, 100);

        // Cria a parte principal da pedra
        let pedra = new Parte();
        pedra.posicao = [0, 0];
        pedra.preenchimento = corPedra;
        pedra.colide = true;
        pedra.vertices = [];

        // Gera os vértices de forma procedural para criar uma forma irregular
        for (let i = 0; i < numVertices; i++) {
            let angulo = (i / numVertices) * Math.PI * 2;
            let variacaoRaio = jogo.aleatorio.entre(-raioBase * 0.2, raioBase * 0.2); // Variação no raio para formas irregulares
            let raio = raioBase + variacaoRaio;

            let x = raio * Math.cos(angulo);
            let y = (raio / 2) * Math.sin(angulo); // 'y' é reduzido para criar uma forma mais achatada, como uma pedra
            
            pedra.vertices.push([x, y]);
        }

        // Define o objeto com a nova parte
        super.partes = [pedra];
        super.partesOriginais = JSON.parse(JSON.stringify(this.partes));

    }
    
}

//  Pinheiros (obstaculos)
class Pinheiro extends Obstaculo {

    constructor(x, y, altura) {
        super(x, y);
        this.altura = altura;
        this.criarPartes();
    }

    //  Cria as partes do pinheiro
    criarPartes() {

        //  Definicoes
        let altura = this.altura;
        let largura = altura / 2;
        let qtdCopas = Math.round(altura/24);
        let alturaCopa = altura / qtdCopas;
        let intercalado = (0.25 / (qtdCopas-1)) * altura;
        let retorno = [];

        // Cria o tronco
        let tronco = new Parte();
        tronco.posicao = [0, altura / 4];
        tronco.vertices = [
            [largura / -8, 0],
            [largura / -8, altura / 4],
            [largura / 8, altura / 4],
            [largura / 8, 0]
        ];
        tronco.preenchimento = this.variarCor(120, 60, 30);
        tronco.colide = true;
        retorno.push(tronco);

        //  Cria as copas
        for (let i = 0; i < qtdCopas; i ++) {

            //  Cria uma copa
            let funila = (largura / 12) * i;
            let v1 = [-(largura / 2) + funila, 0];
            let v2 = [0, -alturaCopa];
            let v3 = [(largura / 2) - funila, 0];
            let copa = new Parte();
            copa.posicao = [0, (altura / 4) - i * (alturaCopa - intercalado)];
            copa.preenchimento = this.variarCor(80, 160, 40);
            copa.vertices = [v1, v2, v3]
            retorno.push(copa);

        }

        //Retorna as partes
        super.partes = retorno;
        super.partesOriginais = JSON.parse(JSON.stringify(this.partes));

    }

}