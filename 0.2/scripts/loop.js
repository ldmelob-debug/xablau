//  Classe que opera o loop de atualizacao do jogo.
class Loop {

    constructor(atualizar, desenhar, fps = 60) {

        this.atualizar = atualizar;
        this.desenhar = desenhar;
        this.fps = fps;
        this.duracaoFrame = 1000 / fps;
        this.ultimavez = 0;
        this.acumulado = 0;
        this.executando = false;
        
    }

    //Funcao para iniciar
    inicio() {

        this.executando = true;
        this.ultimaVez = performance.now();
        requestAnimationFrame(this.loop.bind(this));
        
    }

    //Funcao para parar o jogo.
    parar() {

        this.executando = false;

    }

    //Funcao de execucao do loop
    loop(agora) {

        //Cancela o loop se nao estiver executando
        if (!this.executando) return;

        //Verifica a diferenca de tempo da ultima atualizacao
        const delta = agora - this.ultimaVez;
        this.ultimaVez = agora;
        this.acumulado += delta;

        //Faz a atualizacao das informacoes com base no tempo passado
        while (this.acumulado >= this.duracaoFrame) {
            this.atualizar(this.duracaoFrame/ 1000);
            this.acumulado -= this.duracaoFrame;
        }
        //Desenha e solicita a continuacao do loop
        this.desenhar();
        requestAnimationFrame(this.loop.bind(this));

    }
}