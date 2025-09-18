
// Classe principal do jogo
class Jogo {
    constructor() {
        this.tamanho=[300,400];
        this.objetos=[];
        this.semente=new Semente(27031999);
        this.velocidade=100;
        this.aceleracao=0.5;
        this.pontuacao=0;
        this.jogador=null;
    }
    //Carrega o jogador para deontro do jogo
    addJogador(jogador) {
        this.jogador = jogador;
    }
    // Lógica para administrar objetos do jogo
    removePinheiro(obj) {
        const idx = this.objetos.indexOf(obj);
        if (idx > -1) {
            this.objetos.splice(idx, 1);
            this.velocidade+=this.aceleracao;
            this.pontuacao+=5;
        }
    }
    administrarObjetos(dt) {
        //Atualizar jogador
        controle.atualiza(dt);
        this.jogador.atualizar(dt);

        // Verificar criação de novos pinheiros
        if (this.semente.aleatorioEntre(0, 5000) < this.velocidade) {
            this.objetos.push(new Pinheiro(this.semente.aleatorioEntre(0, jogo.tamanho[0]), jogo.tamanho[1] + 60, this.semente.aleatorioEntre(60, 120)));
        }

        // Atualizar pinheiros
        this.objetos.forEach(function(objeto) {
            objeto.atualizar(dt);
        });

    }

    //Renderiza os objetos na tela
    renderizarObjetos(ct) {
        this.jogador.desenhar(ct);
        this.objetos.forEach(function(objeto) { 
            objeto.desenhar(ct);
        });
        renderizarHud(ct);
    }
}
