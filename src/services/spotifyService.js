const btoa = require('btoa');
const request = require('request-promise-native');

const config = require('../config');
const authString = `${config.spotifyClientId}:${config.spotifyClientSecret}`;
const basicAuth = "Basic " + btoa(authString);


async function authenticate(){
    const options = {
        method: 'POST',
        headers: {
            'Authorization':  basicAuth
        },
        uri: `${config.spotifyAccountUrl}/api/token`,
        form: {
            'grant_type': 'client_credentials'
        },
        resolveWithFullResponse: true
    };

    const response = await request(options);

    if (response.statusCode !== 200 || !response.body) {
        console.error('Error while authenticating ', response.body);
        return response;
    }

    return response.body;
}

async function getAlbumInfo(albumName, token) {
    let encodedName = albumName.toLowerCase().split(' ').join('%20');

    const options = {
        method: 'GET',
        headers: {
            'Authorization':  `Bearer ${token}`
        },
        uri: `${config.spotifyBaseUrl}/search?q=album:${encodedName}%20artist:dylan&type=album`,
        simple: false,
        resolveWithFullResponse: true,
    };

    const response = await request(options);

    if (response.statusCode !== 200 || !response.body) {
        console.error('Error while retrieving Cover Art for album: ', response.body);
        return response;
    }

    console.log(albumName);
    return JSON.parse(response.body)['albums']['items'][0]['images'][0]['url'];
}

module.exports = {
    getAlbumInfo,
    authenticate
};