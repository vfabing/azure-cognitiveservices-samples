// Imports
const request = require('request');
const fs = require('fs');
const sound = require('./sound.js');

// Configuration
let serviceKey = "{{MY_SPEECH_SERVICES_KEY}}";
let azureRegion = "northeurope";

// Request
let speechRequest = "";
fs.readFile('speechRequest.xml', 'utf8', function(err, data){
  if(err) throw err;
  console.log(data);
  speechRequest = data;
});

request.post({
  url: `https://${azureRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
  headers: {
    'Content-type' : 'application/x-www-form-urlencoded',
    'Content-Length' : '0',
    'Ocp-Apim-Subscription-Key' : serviceKey
  }
}, function (err, resp, access_token) {
  if (err || resp.statusCode != 200){
    console.log(err, resp.body);
  } else {
    try {
      request.post({
        url: `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
        body: speechRequest,
        headers: {
          'Content-type' : 'application/ssml+xml',
          'X-Microsoft-OutputFormat' : 'riff-24khz-16bit-mono-pcm',
          'Authorization': 'Bearer ' + access_token,
          'User-Agent': 'myapp'
        },
        encoding: null
      }, function(err, resp, speak_data) {
        if (err || resp.statusCode != 200){
          console.log(err, resp.body);
        } else {
          try {
            let file = require('path').join('speech.wav');
            let wstream = fs.createWriteStream(file);
            wstream.write(speak_data, () =>{
              sound.Play('speech.wav');
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
