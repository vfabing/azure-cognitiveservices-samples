// Imports
var winSound = require('./winSound.js')
var request = require('request');
var xmlbuilder = require('xmlbuilder');
var fs = require('fs');

// Configuration
var serviceKey = "{{MY_SPEECH_SERVICES_KEY}}";

// Request
var speechRequestXml = xmlbuilder
  .create('speak').att('version', '1.0').att('xml:lang', 'en-us')
  .ele('voice').att('xml:lang', 'en-us').att('xml:gender', 'Female').att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)')
  .txt('This is a demo to call Microsoft text to speech service.')
  .end();
var speechRequest = speechRequestXml.toString();

request.post({
  url: "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken",
  headers: {
    'Ocp-Apim-Subscription-Key' : serviceKey
  }
}, function (err, resp, access_token) {
  if (err || resp.statusCode != 200){
    console.log(err, resp.body);
  } else {
    try {
      request.post({
        url: "https://westus.tts.speech.microsoft.com/cognitiveservices/v1",
        body: speechRequest,
        headers: {
          'content-type' : 'application/ssml+xml',
          'X-Microsoft-OutputFormat' : 'riff-24khz-16bit-mono-pcm',
          'Authorization': 'Bearer ' + access_token,
          'X-Search-AppId': '07D3234E49CE426DAA29772419F41988',
          'X-Search-ClientID': '1ECFAE91408841A480F00935DC391988',
          'User-Agent': 'TTSNodeJSvfa'
        },
        encoding: null
      }, function(err, resp, speak_data) {
        if (err || resp.statusCode != 200){
          console.log(err, resp.body);
        } else {
          try {
            var file = require('path').join('speech.wav');
            var wstream = fs.createWriteStream(file);
            wstream.write(speak_data, () =>{
              winSound.Play('speech.wav');
            });
          } catch (e) {
            console.log(e.message);
          }
        }
      });
    } catch(e) {
      console.log(e.message);
    }
  }
});
