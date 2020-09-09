require('dotenv').config();
const request = require('request-promise-native');
const config = require('../config');

const apiKey = config.trelloApiKey;
const token = config.trelloToken;

async function createBoard(name) {
    console.log('Going to create board');
    const options = {
        method: 'POST',
        uri: `${config.trelloBaseUrl}/1/boards?key=${apiKey}&token=${token}&name=${name}`,
        json: true,
        simple: false,
        resolveWithFullResponse: true,
    };

    const response = await request(options);

    if (response.statusCode !== 200 || !response.body) {
        console.error('Error while creating Board: ', response.body);
        return response;
    }

    let boardId = response.body.id;
    console.log(`Board ${boardId} was successfully created.`);
    return boardId;
}

async function createList(name, boardId) {
    const options = {
        method: 'POST',
        uri: `${config.trelloBaseUrl}/1/boards/${boardId}/lists?key=${apiKey}&token=${token}&name=${name}`,
        json: true,
        simple: false,
        resolveWithFullResponse: true,
    };

    const response = await request(options);

    if (response.statusCode !== 200 || !response.body) {
        console.error('Error while creating List: ', response.body);
        return response;
    }

    let listId = response.body.id;
    console.log(`List ${listId} was successfully created.`);
    return listId;
}

async function createCard(name, cover, listId) {
    const options = {
        method: 'POST',
        uri: `${config.trelloBaseUrl}/1/cards?key=${apiKey}&token=${token}&name=${name}&urlSource=${cover}&idList=${listId}`,
        json: true,
        simple: false,
        resolveWithFullResponse: true,
    };

    const response = await request(options);

    if (response.statusCode !== 200 || !response.body) {
        console.error('Error while creating Card: ', response.body);
        return response;
    }

    let cardId = response.body.id;
    console.log(`Card ${cardId} was successfully created.`);
    return cardId;
}

module.exports = {
    createBoard,
    createList,
    createCard
};