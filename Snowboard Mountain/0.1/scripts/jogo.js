//IDEIA
//Ao passar muito proximo ao tronco de um pinheiro:
//O jogador ganha pontos extras
//Resposta visual: efeito de 'ventinho' passando e a arvore balancando e caindo folhas,



//  Classe que opera todo o jogo
class Jogo {

    constructor(largura, altura) {

        this.tamanho = [largura, altura];
        this.proporcao = this.tamanho[0] / this.tamanho[1];
        this.objetos = [];
        this.aleatorio = new Semente(1999);
        this.velocidade = 100;
        this.aceleracao = 1;
        this.pontuacao = 0;
        this.jogador = new Snowboard(this.tamanho[0] / 2, this.tamanho[1] / 6);

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

        //  Atualiza o jogador e os objetos
        controle.atualizar(delta);
        this.jogador.atualizar(delta);
        this.objetos.forEach(function(objeto) {
            objeto.atualizar(delta)
        });

        //  Geracao de objetos
        this.gerarPinheiro();

    }

    //  Funcao que desenha o jogo
    desenhar(ctx) {

        this.jogador.desenhar(ctx);
        this.objetos.forEach(function(objeto) {
            objeto.desenhar(ctx);
        });
        desenharHud(ctx);

    }

    //  Funcao para gerar pinheiros
    gerarPinheiro() {

        //  Verifica a chance dos pinheiros surgirem
        let chance = this.aleatorio.entre(0,3000);
        if (chance < this.velocidade) {

            //  Nasce um corredor de pinheiros

        } else if (chance < this.velocidade * 2) {

            //  Nasce um pinheiro solitario
            let altura = this.aleatorio.entre(60, 120);
            let px = jogo.aleatorio.entre(0, jogo.tamanho[0]);
            let py = jogo.tamanho[1] + altura / 2;
            this.objetos.push(new Pinheiro(px, py, altura));

        }
    }
}