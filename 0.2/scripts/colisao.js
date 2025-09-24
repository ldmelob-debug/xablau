//  Define uma forma para facilitar a deteccao de colisoes
class Forma {

    constructor(posicao, raio, vertices, objetoPai) {

        this.posicao = posicao;
        this.raio = raio;
        this.vertices = vertices;
        this.objetoPai = objetoPai;

    }

    //  Retorna a posicao das vertices contando com a posicao do objeto
    verticesReais() {
        let verticesReais = [];
        this.vertices.forEach(vertice => {
            verticesReais.push([vertice[0] + this.posicao[0], vertice[1] + this.posicao[1]]);
        });
        return verticesReais;
    }

}

//  Verificar a distancia entre dois pontos
function distancia(p1, p2) {

    let catetoAdjacente = p1[0] - p2[0];
    let catetoOposto = p1[1] - p2[1];
    let dis = Math.sqrt((catetoAdjacente * catetoAdjacente) + (catetoOposto * catetoOposto));
    return Math.abs(dis);

}

//  Subtrair vetores
function subtrair(v1, v2) {

    return [v1[0]-v2[0], v1[1]-v2[1]];

}

//  Retornar perpendicular
function normal(vetor) {

    return [-vetor[1], vetor[0]];

}

//  Trazer valor para base 1
function normalizar(vetor) {
    let x = vetor[0];
    let y = vetor[1];
    let tamanho = Math.sqrt(x * x + y * y)
    return [x / tamanho, y / tamanho];

}

//  Retornar lista de formas que podem colidir
function colidem(objeto) {

    let formas = [];
    objeto.partes.forEach(function (parte) {
        if (parte.colide) {
            //  Gera uma nova forma para adicionar a lista
            let forma = new Forma([objeto.x + parte.posicao[0], objeto.y + parte.posicao[1]], parte.raio, parte.vertices, objeto);
            formas.push(forma);
        }
    });
    return formas;

}

//  Calcula os eixos de um poligono
function eixosPoligono(poligono) {

    let eixos = [];
    poligono.vertices.forEach(function (vertice, index) {

        if (index < poligono.vertices.length) {
            proxIndex = index + 1;
            //  Conectar a ultima aresta a primeira
            if (index == poligono.vertices.length - 1) {
                proxIndex = 0;
            }
            //  Define as duas vertices
            let v1 = poligono.vertices[index];
            let v2 = poligono.vertices[proxIndex];
            // Define uma aresta 
            let aresta = subtrair(v1, v2);
            let arestaNormal = normal(aresta);
            let eixo = normalizar(arestaNormal);
            eixos.push(eixo);
        }

    });

    return eixos;

}

//  Calcula os eixos para um circulo e um poligono
function eixosPoligonoCirculo(poligono, circulo) {
    
    //  Calcular os eixos do poligono
    let eixos = eixosPoligono(poligono);

    //  Calcular o eixo do circulo
    let min = Infinity;
    let maisProximo = [];
    for (let vertice of poligono.verticesReais()) {
        let dis = distancia(circulo.posicao, vertice);
        if (dis<min) {
            maisProximo=vertice;
            min = dis;
        }
    }
    let eixoCirculo = subtrair(circulo.posicao, maisProximo);
    eixos.push(normalizar(eixoCirculo));
    return eixos;

}

//  Calcula o eixo para dois circulos
function verificarCirculos(forma1, forma2) {

    let dis = distancia(forma1, forma2)
    let raios = forma1.raio + forma2.raio;
    return (dis < raios);

}

//  Eliminar eixos repetidos
function eixosUnicos(eixos) {
    let eixosUnicos = new Map();
    eixos.forEach(eixo => {
        let chave = `${eixo[0]},${eixo[1]}`
        eixosUnicos.set(chave, eixo);
    });
    return [...eixosUnicos.values()];

}

//  Funcao para projetar uma vertice em um eixo
function projetarVertice(vertice, eixo) {

    return vertice[0] * eixo[0] + vertice[1] * eixo[1];

}

function limiteCirculo(forma, eixo) {
    
    let centro = projetarVertice(forma.posicao, eixo);
    return [centro - forma.raio, centro + forma.raio];

}

//  Retornar os limites que uma forma atinge em um eixo
function limiteVertice (forma, eixo) {

    let min = Infinity;
    let max = -Infinity;
    forma.verticesReais().forEach(function(vertice) {
        let ponto = projetarVertice(vertice, eixo);
        if (ponto < min) { min = ponto; }
        if (ponto > max) { max = ponto; }
    });

    return [min, max];

}

//  Verificar se ha colisao entre duas partes
function verificarColisao(forma1, forma2) {

    //  Definir os eixos de verificacao
    // Verificando se sao poligonos ou circulos
    if (forma1.raio > 0 && forma2.raio >0) {

        //  As duas formas sao circulos, ja retorna o resultado do teste
        return [verificarCirculos (forma1, forma2), forma2];

    } else if(forma1.raio > 0) {

        //  A forma 1 e um circulo
        eixos = eixosUnicos(eixosPoligonoCirculo(forma2, forma1));
        for (eixo of eixos) {
            let limite1 = limiteCirculo(forma1, eixo);
            let limite2 = limiteVertice(forma2, eixo);
            if(limite1[1] < limite2[0] || limite2[1] < limite1[0]) {
                return [false, forma2];
            }
        }


    } else if(forma2.raio > 0) {

        //  A forma 2 e um circulo
        eixos = eixosUnicos(eixosPoligonoCirculo(forma1, forma2));
        for (eixo of eixos) {
            let limite1 = limiteVertice(forma1, eixo);
            let limite2 = limiteCirculo(forma2, eixo);
            if(limite1[1] < limite2[0] || limite2[1] < limite1[0]) {
                return [false, forma2];
            }
        }

    } else {

        //  As duas formas sao poligonos
        eixos = eixosUnicos([...eixos, ...eixosPoligono(forma1), ...eixosPoligono(forma2)]);
        for (eixo of eixos) {
            let limite1 = limiteVertice(forma1, eixo);
            let limite2 = limiteVertice(forma2, eixo);
            if(limite1[1] < limite2[0] || limite2[1] < limite1[0]) {
                return [false, forma2];
            }
        }

    }

    return [true, forma2];

}

//  Verifica a colisao entra dois objetos
function verificar(objeto1, objeto2) {
    formas1 = colidem(objeto1);
    formas2 = colidem(objeto2);
    for (forma1 of formas1) {
        
        for (forma2 of formas2) {

            if(verificarColisao(forma1, forma2)[0]) {
                return [true, forma2];
            }

        }

    }

    return false;

}

//  Verificar possiveis colisores no raio
function verificarRaio(objeto) {

    let possivelColisor =  [];
    jogo.objetos.forEach(function(alvo) {
        let dis = distancia([objeto.x, objeto.y], [alvo.x, alvo.y]);
        let raios = objeto.raio() + alvo.raio();
        if (dis < raios) {
            possivelColisor.push(alvo);
        }
    });
    let info = false;
    let colidiu = possivelColisor.some(function (pC) {
        if (verificar(objeto, pC)) {
            info = verificar(objeto, pC);
        }
        return verificar(objeto, pC);
    });
    return info;

}