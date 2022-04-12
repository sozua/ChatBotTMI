const fs = require('fs/promises')

let client;
let palpitesRestantes = 5;
let palpitesFeitos = [];
let jogoEmAndamento = false;
let participantes = [];
let timeout;

let palavraOriginal;
let palavra;

function getPalavra() {
    return palavra?.split('')?.map((letra) => palpitesFeitos.includes(letra) || letra === '-' ? letra : " _ ").join('')
}

async function randomizarPalavra() {
    try {
        const data = await fs.readFile('./src/data/palavras-forca.txt', 'utf-8');
        const palavras = data.toString().replace('\r', '').split('\n');
    
        let palavraAleatoria = palavras[Math.floor(Math.random() * palavras.length)]
        palavraOriginal = palavraAleatoria.replace('\n', '').replace('\r', '');
        palavra = palavraOriginal?.toLowerCase()?.normalize("NFD")?.replace(/\p{Diacritic}/gu, "");
    } catch(err) {
        console.log(err)
    }
}

async function iniciarJogo(canal, contexto) {
    palpitesFeitos = [];
    jogoEmAndamento = true;
    randomizarPalavra().then(() => {
        client.say(canal, `${contexto['display-name']}, você iniciou o jogo da forca, descubra a palavra em 2 minutos: ${getPalavra()}`);
    });

    timeout = setTimeout(() => {
        gameOver(canal, 'timeout');
    }, 2 * 60 * 1000)
}

function resetarStats() {
    palpitesFeitos = [];
    jogoEmAndamento = false;
    participantes = [];
    palpitesRestantes = 5;
    clearTimeout(timeout);
}

function gameOver(canal, reason) {
    if(jogoEmAndamento) {
        resetarStats();
        if(reason === 'timeout') {
            client.say(canal, `O tempo acabou! A palavra misteriosa era ${palavra}!`);
            return;
        }
        client.say(canal, `Fim de jogo =(. A palavra misteriosa era ${palavra}!`);
    }
}

function venceuOJogo(canal) {
    client.say(canal, `Parabéns! A palavra ${palavraOriginal} foi descoberta! Obrigado por participar ${participantes.join(', ')}!`);
    resetarStats();
}

function realizarPalpite(canal, char) {
    if (palpitesFeitos.includes(char.toLowerCase())) {
        client.say(canal, `A letra ${char} já foi testada!`)
        return;
    }
    palpitesFeitos.push(char.toLowerCase());

    if (!palavra.includes(char.toLowerCase())) {
        palpitesRestantes--;
        if (palpitesRestantes <= 0) {
            gameOver(canal);
            return;
        }
        client.say(canal, `A palavra não tem a letra ${char.toUpperCase()}, resta(m) ${palpitesRestantes} tentativa(s): ${getPalavra()}`)
        return;
    }

    if (!getPalavra().includes(" _ ")) {
        venceuOJogo(canal)
        return;
    }
    client.say(canal, `A palavra contém a letra ${char.toUpperCase()}! ${getPalavra()}`)
}

function listener(alvo, contexto, mensagem, ehBot) {
    if (ehBot || contexto['message-type'] !== 'chat') return;

    if (mensagem.trim().startsWith("!forca")) {
        if (jogoEmAndamento) {
            client.say(alvo, `Já existe um jogo da forca em andamento @${contexto['display-name']}!`)
            return;
        }
        iniciarJogo(alvo, contexto);
    }

    if (jogoEmAndamento && mensagem.trim().length === 1 && mensagem.trim().match(/[a-z]/i)) {
        if (!participantes.includes(contexto['display-name'])) {
            participantes.push(contexto['display-name']);
        }
        realizarPalpite(alvo, mensagem)
    }
}

function carregarJogoDaForca(reqClient) {
    client = reqClient;
    client.on('message', listener);
}

module.exports = { carregarJogoDaForca }