const SONG_API = "http://api.musixmatch.com/ws/1.1/matcher.track.get";
const musixKey = "a8bc8031bd2f703ac56092ba82edcbcd";
const LYRIC_API = "http://api.musixmatch.com/ws/1.1/track.lyrics.get";

const request = require('request');
const URL = require('url');

function retrieveSong(req, res) {
    var url = SONG_API;
    var params = URL.parse(req.url, true).query.params;
    var fullUrl = url + '?apikey=' + musixKey + "&" + params;

    var headers = {
        'Content-Type': 'application/json'
    };

    var options = {
        url: fullUrl,
        method: 'GET',
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
        res.end(body);   
        }
    });

}

function retrieveLyrics (req, res) {
    var url = LYRIC_API;
    var track = URL.parse(req.url, true).query.track;
    var fullUrl = url + '?apikey=' + musixKey + "&" + track;

    var headers = {
        'Content-Type': 'application/json'
    };

    var options = {
        url: fullUrl,
        method: 'GET',
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
        res.end(body);   
        }
    });
}

module.exports.retrieveSong = retrieveSong;
module.exports.retrieveLyrics = retrieveLyrics;