const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const program = express();
const { JSDOM } = require('jsdom');

program.use(express.json());
program.use(cors());
program.use(express.static('src'));

const DBTags = new sqlite3.Database('DataBase_NUTI.db', error => {
  if (error) {
    console.error('Erro ao abrir o banco de dados', error.message);
  } else {
    createTables();
  }
});

function createTables() {
  DBTags.run(`
    CREATE TABLE IF NOT EXISTS TagsHTML(
        Tags TEXT NOT NULL,
        Qtde INTEGER NOT NULL
    )`, error => {
    if (error) {
      console.error('Erro ao criar a tabela TagsHTML', error.message);
    }
  });
}

createTables();


program.post('/tags', async (request, response) => {
  const { urls } = request.body;

  try {
    const tagsCounter = {};

    for (const url of urls) {
      const tagsResponse = await axios.get(url, { responseType: 'text' }); // Correção aqui
      const htmlDocument = tagsResponse.data;
      const DOMDocument = new JSDOM(htmlDocument);
      const AllTags = DOMDocument.window.document.getElementsByTagName('*');

      for (const tag of AllTags) {
        const tagName = tag.tagName.toLowerCase();
        tagsCounter[tagName] = (tagsCounter[tagName] || 0) + 1;
      }
    }

    for (const tag in tagsCounter) {
      const tagsQuantity = tagsCounter[tag];

      DBTags.run(`
        INSERT INTO TagsHTML(Tags, Qtde) VALUES(?,?)
      `, [tag, tagsQuantity], error => {
        if (error) {
          console.error('Erro ao inserir dados na tabela TagsHTML', error.message);
        }
      });
    }

    response.json(tagsCounter);
  } catch (error) {
    console.log('Erro no processo de requisição', error);
    response.status(500).json({ error: 'Erro no processo de requisição' });
  }
});

const port = 3000;
program.listen(port, '127.0.0.1' ,() => {
  console.log(`Servidor iniciado na porta ${port}`);
});

program.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});
