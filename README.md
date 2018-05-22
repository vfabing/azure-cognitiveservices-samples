# node-azure-cognitiveservices-samples
This repository show how to use Azure Cognitive Services with Node JS in just a few lines of code.

## Prerequisites
All of these demo require a *Microsoft Azure Subscription*.
You can get a **free** Azure Account and get access to **free** Cognitive Services :
- **5 million** characters of **Text to Speech** for free
- **5 000** transactions of **Computer Vision** for free
- **10 000** transactions of **Language Understanding** (LUIS) for free

https://azure.microsoft.com/en-us/free/

## Computer Vision
- [Create a Computer Vision service on Azure](#create-a-computer-vision-service-on-azure)
- [Create a Node JS app](#create-a-node-js-app)
### Create a Computer Vision service on Azure
- Connect to Azure Portal: https://portal.azure.com
- Create a new Computer Vision service
![computer-vision_01.png](/wiki/assets/computer-vision_01.png)
- Get your Computer Vision API Keys
![computer-vision_02.png](/wiki/assets/computer-vision_02.png)

### Create a Node JS app
- Create a package.json file with `npm init -f`
- Install the following dependencies:
  - `npm i ms-rest-azure` to connect to Cognitive Services
  - `npm i azure-cognitiveservices-computervision` to manipulate Computer Vision API
  - *(optional)* `npm i fs` to access file system (and especially the image from where we want to extract some text)
- Create a new `app.js` file and add the following lines of code
- Import modules
``` JavaScript
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const ComputerVisionAPIClient = require('azure-cognitiveservices-computervision');
// const fs = require('fs');
```
  - Configure the service with the Computer Vision API Key, the Azure region where the service was created, and the orientation detection parameter
``` JavaScript
let serviceKey = "{{MY_SERVICE_KEY}}";
let azureRegion = "westeurope";
let detectOrientation = true;
```
  - Create then a `CognitiveServicesCredentials` to access the API, and create a new `ComputerVisionAPIClient` to access the Computer Vision API
``` JavaScript
let credentials = new CognitiveServicesCredentials(serviceKey);
let client = new ComputerVisionAPIClient(credentials, azureRegion);
```
  - Specify where to retrieve the image to analyze, either by creating a Stream from a file on your computer or by using an url
``` JavaScript
// let fileStream = fs.createReadStream('test.png');
let url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png";
```
  - Call then the Computer Vision API using the previously created client, and either the file stream or the url
``` JavaScript
// client.recognizePrintedTextInStreamWithHttpOperationResponse(detectOrientation, fileStream)
client.recognizePrintedTextWithHttpOperationResponse(detectOrientation, url)
.then((response) => {
  // Do Something
}).catch((err) => {
  throw err;
});
```
  - Then do something with the result return from the Computer Vision API, such as printing the text recognized
``` JavaScript
  let textBuffer = "";
  for(let i in response.body.regions) {
    for(let j in response.body.regions[i].lines) {
      for(let k in response.body.regions[i].lines[j].words) {
        textBuffer += response.body.regions[i].lines[j].words[k].text + " ";
      }
    }
  }
  console.log(textBuffer);
```

### Run your Node JS app
- Run `node app.js` and check that your app correctly recognized your text  
![computer-vision_03.png](/wiki/assets/computer-vision_03.png)


- *Source image*  
![test.png](/computervision/test.png)

