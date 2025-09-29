//  Classe que opera todo o jogo
class Jogo {

    constructor(largura, altura) {

        this.tamanho = [largura, altura];
        this.proporcao = this.tamanho[0] / this.tamanho[1];
        this.objetos = [];
        this.indicadores = [];
        this.particulas = [];
        this.aleatorio = new Semente(27031999);
        this.velocidade = 150;
        this.aceleracao = 0.1;
        this.pontuacao = 0;
        this.jogador = new Snowboard(this.tamanho[0] / 2, this.tamanho[1] / 6);
        this.gravidade = 10;
        this.inicio = new Date();
        this.morte = null;
        this.agora = null;
        this.fim = false;

    }

    // Fim do jogo
    final() {
        this.morte = jogo.agora;
        this.jogador = new Lapide(this.jogador.x, this.jogador.y);
        salvarImagem();
        reiniciarbt();
    }

    removerIndicador(ind) {
        let idx = this.indicadores.indexOf(ind);
        if (idx > -1) {
            this.indicadores.splice(idx, 1);
        }

    }

    // Funcao para remover uma particula do jogo
    removerParticula(particula) {
        let idx = this.particulas.indexOf(particula);
        if (idx > -1) {
            this.particulas.splice(idx, 1);
        }

    }

    //  Funcao para remover um objeto do jogo
    removerObjeto(obj) {

        let idx = this.objetos.indexOf(obj);
        if (idx > -1) {
            this.objetos.splice(idx, 1);
        }

    }

    //  Funcao de atualizacao do jogo
    atualizar(delta) {

        if(!jogo.fim) {
            //  Atualiza a  hora atual
            jogo.agora = new Date();
            //  Atualiza o jogador e os objetos
            if (this.velocidade < 500) {
                this.velocidade += this.aceleracao;
            }
            controle.atualizar(delta);
            this.jogador.atualizar(delta);
            this.objetos.forEach(function(objeto) {
                objeto.atualizar(delta)
            });
            //  Geracao de objetos
            this.gerarObjetos();
        } else if (this.morte == null) {
            this.final();
        }
        this.indicadores.forEach(function(indicador) {
            indicador.atualizar(delta)
        });
        this.particulas.forEach(function(particula) {
            particula.atualizar(delta)
        });
        
       

    }

    //  Funcao que desenha o jogo
    desenhar(ctx) {
        if(this.jogador.estadoPulo==0) { this.jogador.desenhar(ctx); }
        this.particulas.forEach(function(particula) {
            particula.desenhar(ctx);
        });
        this.objetos.forEach(function(objeto) {
            objeto.desenhar(ctx);
        });
        this.indicadores.forEach(function(indicador) {
            indicador.desenhar(ctx);
        });
        if(this.jogador.estadoPulo>0) { this.jogador.desenhar(ctx); }
        desenharHud(ctx);

    }

    //  Funcao para gerar objetos aleatoriamente
    gerarObjetos() {

        //  Verifica a chance dos pinheiros surgirem
        let chance = this.aleatorio.entre(0,500);
        if (chance < 5) {

            let qtdPinheiros = this.aleatorio.entre(3, 6);
            let variacao = 10;

            let x = this.aleatorio.entre(0, this.tamanho[0]);
            for (let i = 0; i < qtdPinheiros; i++) {
                let altura = this.aleatorio.entre(60, 120);
                x += this.aleatorio.entre(-variacao, variacao);
                let y = this.tamanho[1] + altura / 2 + (this.aleatorio.entre(30, 60) * i);
                this.objetos.push(new Pinheiro(x, y, altura));
            }

        } else if (chance < 50) {

            //  Nasce um pinheiro solitario
            let altura = this.aleatorio.entre(60, 120);
            let px = this.aleatorio.entre(0, this.tamanho[0]);
            let py = this.tamanho[1] + altura / 2;
            this.objetos.push(new Pinheiro(px, py, altura));

        } else if (chance < 70) {
            let altura = this.aleatorio.entre(30, 60);
            let px = this.aleatorio.entre(0, this.tamanho[0]);
            let py = this.tamanho[1] + altura / 2;
            this.objetos.unshift(new Pedra(px, py, altura));
        }
    }
}