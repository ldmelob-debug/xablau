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

    //  Funcao para atualizar a funcao do jogador.
    atualizar(delta) {
        this.pulo(delta);
        //  Ajusta o zoom de acordo com o pulo
        this.zoom = (this.altura * 0.005) + 1;
        this.velocidade = controle.posi * 2;
        this.rotacao = this.velocidade / 270;
        this.x += this.velocidade * delta;
        this.rodar(); //    Gira a prancha

        // Gerar partículas de neve se o jogador estiver no chão e se movendo
        if (this.estadoPulo === 0 && Math.abs(this.velocidade) > 1) {
            // Posição da parte de trás da prancha
            const posTraseira = this.rodarPonto(0, this.tamanho()[1] / -2 - 5, this);
            const posX = this.x + posTraseira[0];
            const posY = this.y + posTraseira[1];

            // Propriedades da partícula
            const vida = jogo.aleatorio.decimal() * 0.3 + 0.2; // 0.2 a 0.5 segundos
            const tamanho = jogo.aleatorio.entre(1, 3);
            const cor = `rgb(200, 200, 200)`;
            
            // Velocidade da partícula (para trás e para cima)
            const anguloParticula = this.rotacao + Math.PI + (jogo.aleatorio.decimal() - 0.5) * 0.5; // Direção oposta ao movimento com variação
            const forcaParticula = jogo.aleatorio.entre(20, 50);
            const vx = Math.sin(anguloParticula) * forcaParticula - this.velocidade;
            const vy = -Math.cos(anguloParticula) * forcaParticula - jogo.velocidade * 0.5;

            jogo.particulas.push(new Particula(posX, posY, vx, vy, vida, tamanho, cor, 200));
        }

        this.bloqpos(); //  Bloquea o personagem de sair da tela
        //  Verificar colisao
        let verificacao = verificarRaio(this);
        if(verificacao[0]) {
            if(this.altura < this.tamanhoForma(verificacao[1])[1]) {
                if (!jogo.fim) { // Garante que a explosão só aconteça uma vez
                    jogo.fim = true; // Fim de jogo
                    audio.colisao(); // Toca o som de colisão

                    // Cria a explosão de partículas
                    const numParticulas = 30;
                    for (let i = 0; i < numParticulas; i++) {
                        const angulo = jogo.aleatorio.decimal() * Math.PI * 2;
                        const forca = jogo.aleatorio.entre(50, 250);
                        const vx = Math.cos(angulo) * forca;
                        const vy = Math.sin(angulo) * forca;
                        const vida = jogo.aleatorio.decimal() * 1.0 + 0.5; // 0.5 a 1.5 segundos
                        const tamanho = jogo.aleatorio.entre(1, 4);
                        
                        // Cores que lembram madeira e metal da prancha
                        const tons = ['rgb(120, 120, 120)', 'rgb(160, 160, 160)', 'rgb(80, 80, 80)'];
                        const cor = tons[jogo.aleatorio.entre(0, tons.length - 1)];

                        // Adiciona a partícula ao jogo
                        jogo.particulas.push(new Particula(this.x, this.y, vx, vy, vida, tamanho, cor, 300));
                    }
                }
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
// Lapide para a morte do jogador
class Lapide extends Objeto {

    constructor (x,y) {
        super(x, y);
        this.criarPartes();
        this.estadoPulo = 1;
    }

    criarPartes() {
        let base = new Parte();
        let retangulo = new Parte();
        let topo = new Parte();
        retangulo.posicao = [0,0];
        retangulo.vertices = [
            [-8, -8],
            [-8, 8],
            [8, 8],
            [8, -8]
        ];
        base.posicao = [0, 8];
        base.vertices = [
            [-10, 0],
            [-10, 4],
            [10, 4],
            [10, 0]
        ]
        topo.raio = 8;
        topo.posicao = [0, -8];
        topo.angulo = [0, Math.PI]
        topo.preenchimento = 'rgb(120, 120, 120)';
        base.preenchimento = 'rgb(140, 120, 40)'
        retangulo.preenchimento = 'rgb(120, 120, 120)';
        super.partes = [retangulo, base, topo];
        super.partesOriginais = JSON.parse(JSON.stringify(this.partes));
    }

}
// Obstaculos
class Obstaculo extends Objeto {

    constructor(x, y) {
        super(x, y);
        this.ultrapassado = false;
        this.pulado = false;
        this.raspa = false;
    }

    atualizar(delta) {

        this.y-=jogo.velocidade * delta;

        if (this.y < jogo.jogador.y - jogo.jogador.tamanho()[1] && !this.ultrapassado) {
            let pts = 1;
            if (this.pulado) {
                let ind = new Indicador(this.x, this.y, '+5');
                jogo.indicadores.push(ind);
                pts = 5;
                audio.recompensa('agudo');
            } else if (this.raspa) {
                let ind = new Indicador(this.x, this.y, '+3');
                jogo.indicadores.push(ind);
                pts = 3;
                audio.recompensa('grave');
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