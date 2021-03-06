console.log('ferramentas ok');

const tmi = require('tmi.js');
const { carregarJogoDaForca } = require('./src/comandos/Forca');

const nome_bot = 'botmudavidas'
const canal = 'beatrrriste'
const token = 'oauth:sr5wmer3yuv0ikzh63opelaxdti97d'

const opts = {
  identity: {
    username: nome_bot,
    password: token
  },
  channels: [canal]
};

// Cria um cliente tmi com  nossas opΓ§Γ΅es
const client = new tmi.client(opts);

const array = ['bairro', 'bistro', 'amparo']; // palavras aleatorias do letreco

var box = {   //armazena os quadrados do letreco
  box1: 'π₯',
  box2: 'π₯',
  box3: 'π₯',
  box4: 'π₯',
  box5: 'π₯',
  box6: 'π₯'
};


//intercepta mensagem do chat
function mensagemChegou(alvo, contexto, mensagem, ehBot) {
  if (ehBot) {
    return; //se for mensagens do nosso bot ele nΓ£o faz nada
  }

  const nomeDoComando = mensagem.trim();// remove espaΓ§o em branco da mensagem para verificar o comando
  // checando o nosso comando


 switch(contexto['message-type']) {
  case "chat":
  if (nomeDoComando === '!letreco') {      //tudo quebrado so to usando esse if pra guardar oq ja fiz

    const letreco = array[Math.floor(Math.random() * array.length)];
    console.log(letreco);

    if (mensagem[0] === letreco[0]) {
      box.box1 = 'π©';
    } else {
      box.box1 = 'π₯';
    };
    // seta segunda caixa 
    if (mensagem[1] === letreco[1]) {
      box.box2 = 'π©';
    } else {
      box.box2 = 'π₯';
    };
    //////////////
    if (mensagem[2] === letreco[2]) {
      box.box3 = 'π©';
    } else {
      box.box3 = 'π₯';
    };
    //////////////
    if (mensagem[3] === letreco[3]) {
      box.box4 = 'π©';
    } else {
      box.box4 = 'π₯';
    };
    //////////////
    if (mensagem[4] === letreco[4]) {
      box.box5 = 'π©';
    } else {
      box.box5 = 'π₯';
    };
    //////////////
    if (mensagem[5] === letreco[5]) {
      box.box6 = 'π©';
    } else {
      box.box6 = 'π₯';
    };
    if (mensagem || mensagem.length === 6) {
      client.say(canal, box.box1 + ' ' + box.box2 + ' ' + box.box3 + ' ' + box.box4 + ' ' + box.box5 + ' ' + box.box6);

    };


  }

  if (nomeDoComando === '!ola') {
    client.say(alvo, 'OlΓ‘ Mundo!');
  }


  if (nomeDoComando === '!parar') {
    client.say(alvo, "ok");
    client.disconnect();
  }


  break;
  case "whisper":
    console.log(`sussuro recebido ${mensagem}`);
    break;
}
}

function entrouNoChatDaTwitch(endereco, porta) {
  console.log(`* Bot entrou no endereΓ§o ${endereco}:${porta}`);
}

// Registra nossas funΓ§Γ΅es
client.on('message', mensagemChegou);
client.on('connected', entrouNoChatDaTwitch);

// Jogos
carregarJogoDaForca(client);

client.on("subscription", (alvo, contexto, method, message, userstate) => {
    client.say(` Hey @${contexto.username} obrigado por se inscrever`);
  });
  client.on("resub", (channel, contexto, months, message, userstate, methods) => {
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    client.say(`@${contexto.username} deu resub de ${cumulativeMonths}`);
});

// Connecta na Twitch:
client.connect();