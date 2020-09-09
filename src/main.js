let path = require('path');
const readline = require('readline');
const fs = require('fs');
const trelloService = require('./services/trelloService');
const spotifyService = require('./services/spotifyService');

const boardName = 'Bob Dylan Discography';
const listName = 'Albums';


async function main() {
    let response = await spotifyService.authenticate();
    let token = JSON.parse(response)['access_token'];
    let trelloBoardId = await trelloService.createBoard(boardName);
    let listId = await trelloService.createList(listName, trelloBoardId);
    processDiscography(listId, token);
}


function processDiscography(trelloListId, token) {
    const readFile = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, '/../dataset/discography.txt'))
    });

    readFile.on('line', async (line) => {
        let albumYear = line.substr(0, line.indexOf(' '));
        let albumName = line.substr(line.indexOf(' ') + 1);
        let cardName = `${albumYear} - ${albumName}`;
        console.log(cardName);
        let coverUrl = await spotifyService.getAlbumInfo(albumName, token);
        let cardId = await trelloService.createCard(cardName, coverUrl, trelloListId);
    });
}

main();
