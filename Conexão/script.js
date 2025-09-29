const peer = new Peer({ //  Definindo a conexão com o servidor Peer
    host: '0.peerjs.com', // Host gratuito
    secure: true, // Use 'true' se o host for HTTPS
    port: 443 // Porta padrão para HTTPS
});
let conexao; // Variável para armazenar a conexão

//  Função para adicionar log à página
function log(texto) {
    document.body.innerHTML += '<p>' + texto + '</p>';
}

//  Função para configurar a conexão
function configurar(con, tipo) {
    conexao = con;
    conexao.on('open', () => {
        log(`Conectado! ${tipo}`)
    });
    conexao.on('data', (data) => {
        log(data[1]);
    });
    conexao.on('close', () =>{
        log('Conexão fechada.');
        conexao = null
    });
    conexao.on('error', (err) => {
        log(`Erro na conexão: ${err.message}`)
    });
}
// Função que recebe o ID do Peer.
peer.on('open', (id) => {
    log(`Seu id é ${id}.`);
});

//  Função para responder a erros
peer.on('error', (err) => {
    log(`Erro de conexão: ${err}`)
}); 

//  Função que recebe uma nova conexão
peer.on('connection', (novaConexao) => {
    log('Conectando');
    configurar(novaConexao, 'Recebedor');
});

//  Função que tenta a conexão com outro ID
function conectar(outroId) {
    if (!outroId) return log('Adicione um ID.');
    if (conexao && conexao.open) return log('Já conectado.');
    const novaConexao = peer.connect(outroId);
    configurar(novaConexao, 'Iniciador');
}

function botao() {
    let idd = document.getElementById("id").value;
    conectar(idd);
}

function pokear() {
    if (conexao && conexao.open) {
        conexao.send(['POKE','Boboca']);
    }
}