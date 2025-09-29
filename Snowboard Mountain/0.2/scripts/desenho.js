//Faz o trabalho final de desenhar as partes na tela
function exibir(ctx, parte, x, y, zoom) {

        //  Transforma parte para as dimensoes da tela
        let posicao = [((parte.posicao[0] * zoom) + x) * tela.dimensao, ((parte.posicao[1] * zoom) + y) * tela.dimensao];
        
        //Definicao basica do desenho
        ctx.beginPath();
        ctx.fillStyle = parte.preenchimento;

        //  Verifica se o desenho e curvo
        if (parte.raio > 0) {
            
            //  Desenho curvo
            let raio = parte.raio * tela.dimensao * zoom;
            let horario = true;
            if (parte.angulo[1] < 0) {
                horario = false;
            }
            ctx.arc(posicao[0], posicao[1], raio, parte.angulo[0], parte.angulo[1], horario);
            ctx.fill();
            ctx.stroke();

        } else {
            
            //  Desenho reto
            let vertices = parte.vertices.map(function(vertice) {
                return [(vertice[0] * tela.dimensao  * zoom) + posicao[0] , (vertice[1] * tela.dimensao  * zoom) + posicao[1]];
            })
            ctx.moveTo(vertices[0][0], vertices[0][1])  ;
            vertices.slice(1).forEach(function(vertice) {
                ctx.lineTo(vertice[0], vertice[1]);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    }