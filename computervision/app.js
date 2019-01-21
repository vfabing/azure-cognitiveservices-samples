// Imports
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const ComputerVisionAPIClient = require('azure-cognitiveservices-computervision');
// const fs = require('fs');

// Configuration
let serviceKey = "{{MY_SERVICE_KEY}}";
let azureRegion = "westeurope";
let detectOrientation = true;

// API Client Access
let credentials = new CognitiveServicesCredentials(serviceKey);
let client = new ComputerVisionAPIClient(credentials, 'https://westeurope.api.cognitive.microsoft.com');

// Image access
// let fileStream = fs.createReadStream('test.png');
let url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png";

// API Call
// client.recognizePrintedTextInStreamWithHttpOperationResponse(detectOrientation, fileStream)
client.recognizePrintedTextWithHttpOperationResponse(detectOrientation, url)
.then((response) => {
  let textBuffer = "";
  for(let i in response.body.regions) {
    for(let j in response.body.regions[i].lines) {
      for(let k in response.body.regions[i].lines[j].words) {
        textBuffer += response.body.regions[i].lines[j].words[k].text + " ";
      }
    }
  }
  console.log(textBuffer);
}).catch((err) => {
  throw err;
});
