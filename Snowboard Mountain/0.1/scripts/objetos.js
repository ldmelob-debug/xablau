//  Neste codigo estao contidos todos os objetos

//  Snowboard (Jogador)
class Snowboard extends Objeto {

    constructor(x, y) {

        super(x, y);
        this.velocidade = 0;
        this.rotacaoAlmejada = 0;
        this.rotacao = 0;
        this.criarPartes();

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

    //  Funcao para atualizar a funcao do jogador.
    atualizar(delta) {
        this.velocidade = controle.posi * 2;
        this.rotacao = this.velocidade / 270;
        this.x += this.velocidade * delta;
        this.rodar(); //    Gira a prancha
        this.bloqpos(); //  Bloquea o personagem de sair da tela
        if(verificarRaio(this)) {
            loop.parar();
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

//  Pinheiros (obstaculos)
class Pinheiro extends Objeto {

    constructor(x, y, altura) {
        super(x, y);
        this.altura = altura;
        this.criarPartes();
    }

    //Atualiza posicao do pinheiro
    atualizar(delta) {

        this.y-=jogo.velocidade * delta;
        if (this.y < -(this.altura/2)) {
            jogo.pontuacao += 1;
            jogo.removerObjeto(this);
        }

    }

    //Faz uma variacao de cor para naturalizar
    variarCor(r, g, b) {
        r = r + jogo.aleatorio.entre(-30,30);
        g = g + jogo.aleatorio.entre(-30,30);
        b = b + jogo.aleatorio.entre(-30,30);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
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