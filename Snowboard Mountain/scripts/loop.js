class GameLoop {
    constructor(update, render, fps = 60) {
        this.update = update; // Função de atualização do jogo
        this.render = render; // Função de renderização do jogo
        this.fps = fps;
        this.frameDuration = 1000 / fps;
        this.lastTime = 0;
        this.accumulated = 0;
        this.running = false;
    }

    inicio() { //iniciar o loop do jogo
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    parar() { //parar o loop do jogo
        this.running = false;
    }

    loop(currentTime) { //loop principal do jogo
        if (!this.running) return;

        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulated += delta;

        while (this.accumulated >= this.frameDuration) {
            this.update(this.frameDuration / 1000);
            this.accumulated -= this.frameDuration;
        }

        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }
}