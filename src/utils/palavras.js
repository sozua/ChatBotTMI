const fs = require('fs/promises')

class Palavras {
    static INSTANCE = undefined;

    constructor() {
        this.palavrasDicionario = [];
    }

    static getInstance() {
        if(!Palavras.INSTANCE) {
            Palavras.INSTANCE = new Palavras();
        }
        return Palavras.INSTANCE
    }

    get listarPalavras() {
        return this.palavrasDicionario;
    }

    get contarPalavras() {
        return this.palavrasDicionario.length;
    }

    async carregarPalavras() {
        try {
            const data = await fs.readFile('./src/data/palavras-forca.txt', 'utf-8');
            this.palavrasDicionario = data.toString().split('\n')
            return data.toString().split('\n')
        } catch(err) {
            console.log("Ocorreu um erro ao pré-carregar as palavras: ", err);
            throw new Error(err);
        }
    }
}

module.exports = { Palavras }