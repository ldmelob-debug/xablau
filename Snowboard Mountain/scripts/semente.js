class Semente { //Gerador de números aleatórios baseado em semente
    constructor(seed) {
        this.t = seed;
    }
    aleatorio() { //aleatorio float
        this.t += 0x6D2B79F5;
        let r = Math.imul(this.t ^ (this.t >>> 15), 1 | this.t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        let final = ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        return final;
    }
    aleatorioEntre(min, max) { //aleatorio entre min e max
        this.t += 0x6D2B79F5;
        let r = Math.imul(this.t ^ (this.t >>> 15), 1 | this.t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        let final = ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        return Math.floor(final * (max - min)) + min;
    }
}