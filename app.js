require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
app.get("/", (req, res) => {
    //console.log(req.params);
    res.render("index.hbs");
  });

app.get("/artist-search", (req, res) => {
    //console.log('req.query', req.query);
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        //console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        let artists = data.body.artists.items
        //console.log(artists[0].images[0].url);
        res.render("artist-search-results", {artists});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    //console.log('req.params', req.params.artistId);
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        //console.log('The received data from the API: ', data.body.items[0].images[0]);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        let albums = data.body.items
        //console.log(artists[0].images[0].url);
        res.render("albums.hbs", {albums});
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    //console.log('req.params', req.params.albumId);
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        //console.log('The received data from the API: ', data.body.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        let tracks = data.body.items
        res.render("tracks.hbs", {tracks});
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
