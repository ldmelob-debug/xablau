// Objeto para gerenciar todo o áudio do jogo
const audio = {
    contexto: null,
    ruido: {
        nodo: null,
        ganho: null,
        bufferSize: 4096,
    },
    inicializado: false,

    /**
     * Inicializa o motor de áudio. Requer interação do usuário para funcionar
     */
    inicializar: function() {
        if (this.inicializado) return;

        try {
            // Cria o contexto de áudio
            this.contexto = new (window.AudioContext || window.webkitAudioContext)();
            console.log("Contexto de áudio inicializado.");
            this.inicializado = true;

        } catch (e) {
            console.error("A API de Áudio Web não é suportada neste navegador.", e);
            return;
        }
    },

    /**
     * Cria e inicia o ruído branco para simular o vento.
     * O volume é baixo por padrão para não incomodar.
     * @param {number} volume Volume do ruído (0.0 a 1.0)
     */
    criarVento: function(volume = 0.02) {
        if (!this.inicializado || !this.contexto) {
            console.warn("O áudio não foi inicializado. O som do vento não será reproduzido.");
            return;
        }

        // Se o vento já estiver tocando, não faz nada
        if (this.ruido.nodo) return;

        // Nodo para controlar o volume (ganho)
        this.ruido.ganho = this.contexto.createGain();
        this.ruido.ganho.gain.setValueAtTime(volume, this.contexto.currentTime);
        this.ruido.ganho.connect(this.contexto.destination);

        // Nodo para gerar o áudio programaticamente (ruído branco)
        // Usando o createScriptProcessor que é mais antigo, mas não exige servidor.
        this.ruido.nodo = this.contexto.createScriptProcessor(this.ruido.bufferSize, 1, 1);

        // Este evento é chamado repetidamente para preencher o buffer de áudio
        this.ruido.nodo.onaudioprocess = function(e) {
            const output = e.outputBuffer.getChannelData(0);
            // Preenche o buffer com valores aleatórios para gerar o ruído
            for (let i = 0; i < audio.ruido.bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        };

        // Conecta o gerador de ruído ao controle de volume
        this.ruido.nodo.connect(this.ruido.ganho);
    },

    /**
     * Para o efeito de vento.
     */
    pararVento: function() {
        if (this.ruido.nodo) {
            this.ruido.nodo.disconnect();
            this.ruido.nodo = null;
        }
        if (this.ruido.ganho) {
            this.ruido.ganho.disconnect();
            this.ruido.ganho = null;
        }
    },

    /**
     * Toca um som de recompensa, como uma moeda.
     * @param {'agudo'|'grave'} tipo O tipo de som a ser tocado.
     */
    recompensa: function(tipo = 'agudo') {
        if (!this.inicializado || !this.contexto) return;

        const tempoAgora = this.contexto.currentTime;
        const oscilador = this.contexto.createOscillator();
        const ganho = this.contexto.createGain();

        // Frequências para os sons
        const freqAguda = { inicio: 1046.50, fim: 1396.91 }; // C6 -> F6
        const freqGrave = { inicio: 523.25, fim: 698.46 };   // C5 -> F5

        const freq = (tipo === 'agudo') ? freqAguda : freqGrave; // Seleciona o conjunto de frequências
        const duracao = 0.12; // Duração mais curta para um som mais "pontudo"

        // Configuração do Oscilador (tom)
        oscilador.type = 'square'; // Onda quadrada para um som mais "brilhante" e retro
        oscilador.frequency.setValueAtTime(freq.inicio, tempoAgora);
        oscilador.frequency.exponentialRampToValueAtTime(freq.fim, tempoAgora + duracao * 0.7);

        // Configuração do Ganho (volume/duração)
        ganho.gain.setValueAtTime(0.25, tempoAgora); // Volume inicial (um pouco menor para a onda quadrada)
        ganho.gain.exponentialRampToValueAtTime(0.0001, tempoAgora + duracao); // Decai ainda mais rápido

        // Conecta os nodos: Oscilador -> Ganho -> Saída de áudio
        oscilador.connect(ganho);
        ganho.connect(this.contexto.destination);

        // Inicia o som agora e para após a duração
        oscilador.start(tempoAgora);
        oscilador.stop(tempoAgora + duracao);
    },

    /**
     * Toca o som do pulo.
     */
    pulo: function() {
        if (!this.inicializado || !this.contexto) return;

        const tempoAgora = this.contexto.currentTime;
        const oscilador = this.contexto.createOscillator();
        const ganho = this.contexto.createGain();

        // Configuração do Oscilador (tom)
        oscilador.type = 'triangle'; // Uma onda "retro"
        oscilador.frequency.setValueAtTime(261.63, tempoAgora); // Nota C4 (Dó)
        oscilador.frequency.linearRampToValueAtTime(523.25, tempoAgora + 0.1); // Sobe para C5 em 0.1s

        // Configuração do Ganho (volume/duração)
        ganho.gain.setValueAtTime(0.2, tempoAgora); // Volume inicial
        ganho.gain.exponentialRampToValueAtTime(0.001, tempoAgora + 0.2); // Decai rapidamente

        // Conecta os nodos: Oscilador -> Ganho -> Saída de áudio
        oscilador.connect(ganho);
        ganho.connect(this.contexto.destination);

        // Inicia o som agora e para em 0.2 segundos
        oscilador.start(tempoAgora);
        oscilador.stop(tempoAgora + 0.2);
    },

    /**
     * Toca um som de colisão, um "burst" de ruído branco.
     */
    colisao: function() {
        if (!this.inicializado || !this.contexto) return;

        const tempoAgora = this.contexto.currentTime;
        const duracao = 0.25;

        // Usamos o mesmo gerador de ruído do vento, mas o conectamos a um
        // controle de ganho separado para criar um som curto e alto.
        const bufferSource = this.contexto.createBufferSource();
        const bufferSize = this.contexto.sampleRate * duracao; // Tamanho do buffer para a duração do som
        const buffer = this.contexto.createBuffer(1, bufferSize, this.contexto.sampleRate);
        const data = buffer.getChannelData(0);

        // Preenche o buffer com ruído branco
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        bufferSource.buffer = buffer;

        const ganho = this.contexto.createGain();
        ganho.gain.setValueAtTime(0.4, tempoAgora); // Volume inicial alto
        ganho.gain.exponentialRampToValueAtTime(0.001, tempoAgora + duracao); // Decai rapidamente

        bufferSource.connect(ganho).connect(this.contexto.destination);
        bufferSource.start(tempoAgora);
    }
};