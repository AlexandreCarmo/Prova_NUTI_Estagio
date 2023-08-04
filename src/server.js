const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const program = express();
const {JSDOM} = require('jsdom');
const { request } = require('http');

program.use(express.json());
program.use(express.static('src'));
program.use(cors());

const DBTags = new sqlite3.Database('DataBase_NUTI.db', error => {
    //tratar erros depois
    

});

function createTables(){
    DBTags.run(`
    CREATE TABLE IF NOT EXISTS Tags(
        tag TEXT NOT NULL,
        qtde INTEGER NOT NULL
    )`), error => {};
}

//createTables();

program.post('/tags', async(request, response) => {

    const{urls} = response.body;
    
    try {

        const tagsCounter = {};
        
        for(const url of urls){

            const tagsResponse = await axios.get(url, {responseType: 'text'});
            const htmlDocument = tagsResponse.data;
            const DOMDocument = new JSDOM(htmlDocument);
            const AllTags = DOMDocument.window.document.getElementsByTagName('*');
            
            for (const tag of AllTags) {
                const tagName = tag.tagName.toLowerCase();
                tagsCounter[tagName] = (tagsCounter[tagName] || 0) + 1;
            }            
        }            

        for(const tag in tagsCounter){
            const tagsQuantity = tagsCounter[tag];
        
            DBTags.run(`
            INSERT INTO Tags(tag, qtde) VALUES(?,?)
            `, [tag, tagsQuantity], error =>{
                //tratamento de erros
            });
            
        }

        response.json(tagsCounter);


    }

    catch {
        console.log('Erro no processo de requisição');
    }



})

const port = 3000;
program.listen(port, ()=>{
    console.log(`Servidor iniciado na porta ${port}`);
});

program.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
})