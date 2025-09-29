//Gera numeros aleatorios baseados em uma semente
class Semente {

    constructor(semente) {

        this.t = semente;

    }

    //Gera um aleatorio entre 0 e 1
    decimal() { 

        this.t += 0x6D2B79F5;
        let r = Math.imul(this.t ^ (this.t >>> 15), 1 | this.t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        let final = ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        return final;

    }

    //Gera um numero inteiro entre o minimo e maximo definido
    entre(min, max) {

        this.t += 0x6D2B79F5;
        let r = Math.imul(this.t ^ (this.t >>> 15), 1 | this.t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        let final = ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        return Math.floor(final * (max - min)) + min;

    }

}