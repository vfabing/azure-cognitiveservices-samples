# azure-cognitiveservices-samples
This repository show how to use Azure Cognitive Services with Node JS or Python in just a few lines of code.

- [Computer Vision](#computer-vision) (*Node.js*)
- [Speech Services](#speech-services) (*Node.js*)
- [Natural Language Processing](#natural-language-processing) (*Python*)

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
- [Run your Node JS app](#run-your-node-js-app)

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
let client = new ComputerVisionAPIClient(credentials, 'https://westeurope.api.cognitive.microsoft.com');
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

## Speech Services
- [Create a Speech Service on Azure](#create-a-speech-service-on-azure)
- [Create a Node.js app](#create-a-node-js-app-1)
- [Run your Node.js app](#run-your-node-js-app-1)
- [Annexe: Windows Node Sound Player sample](#annexe-windows-node-sound-player-sample)

### Create a Speech Service on Azure
- Connect to Azure Portal: https://portal.azure.com
- Create a new Speech service

![speech_01.png](/wiki/assets/speech_01.png)
- Get your Computer Vision API Keys

![speech_02.png](/wiki/assets/speech_02.png)

### Create a Node JS app
- Create a package.json file with `npm init -f`
- Install the following dependencies:
  - `npm i request` to connect to Cognitive Services using http requests
  - `npm i fs` to get access to the file system (and especially to be able to save the sound file and read it)
  - *(optional)* `npm i edge-js` to be able to play the sound file on Windows (You can use `wav` package for Linux)
- Create a new `speechRequest.xml` file to describe the target voice and add the following XML lines
```xml
<speak version="1.0" xml:lang="en-us">
  <voice xml:lang="en-us" xml:gender="Female" name="Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)">
    <!-- Other voices available at https://docs.microsoft.com/en-us/azure/cognitive-services/speech/api-reference-rest/bingvoiceoutput#SupLocales -->
    This is a demo to call Microsoft text to speech service.
  </voice>
</speak>
```
- Create a new `sound.js` file and implement a way to play some sound file (Windows sample at the end of the tutorial)
- Create a new `app.js` file and add the following lines of code
- Import modules
``` JavaScript
const request = require('request');
const fs = require('fs');
const sound = require('./sound.js');
```
  - Configure the service with the Speech Services API Key, the Azure region where the service was created.
``` JavaScript
let serviceKey = "{{MY_SERVICE_KEY}}";
let azureRegion = "northeurope";
```
  - Read the `speechRequest.xml` file and store it into a string
```JavaScript
let speechRequest = "";
fs.readFile('speechRequest.xml', 'utf8', function(err, data){
  if(err) throw err;
  console.log(data);
  speechRequest = data;
});
```
  - Authenticate your application by using your Speech Services API Key, and retrieve your Authentication Token
``` JavaScript
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
    // Do Something
  }
});
```
  - Call then the Speech Services API using the previously retrieved token client, and your xml speech request
``` JavaScript
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
          // Do Something
        }
      });
    } catch(e) {
      console.log(e.message);
    }
```
  - Then do something with the result return from the Speech Services API, such as writing the file on your local disk, and read it.
```JavaScript
          try {
            let file = require('path').join('speech.wav');
            let wstream = fs.createWriteStream(file);
            wstream.write(speak_data, () =>{
              sound.Play('speech.wav');
            });
          } catch (e) {
            console.log(e.message);
          }
```

### Run your Node JS app
- Run `node app.js` and check that your app correctly played your text

![speech_03.png](/wiki/assets/speech_03.png)

### Annexe: Windows Node Sound Player sample
``` JavaScript
var edge = require('edge-js');

exports.Play = function Play(file){
  var play = edge.func(function() {/*
    async (input) => {
        return await Task.Run<object>(async () => {
            var player = new System.Media.SoundPlayer((string)input);
            player.PlaySync();
            return null;
        });
    }
*/});
  play(file, function (err) {
      if (err) throw err;
  });
}
```

## Natural Language Processing
- [Create a LUIS application on Azure](#create-a-luis-application-on-azure)
- [Create a python application](#create-a-python-application)
- [Run your python application](#run-your-python-application)

### Create a LUIS application on Azure
- Go to the European LUIS website : https://eu.luis.ai/home and connect with a Microsoft Login
- Create a new app, choose a language, such as `French` (*FYI: many built-in functionalities are available only in English*)
- Create a new `Intent` such as `GetJobInformation`
- Insert few sentences in this intent
```text
Est-ce qu'il y a eu de nouvelles annonces d'emploi postées aujourd'hui ?
Quels postes sont disponibles pour des ingénieurs senior ?
Est-ce qu'il y a des postes en lien avec des bases de données ?
Je recherche un nouvel emploi avec des responsabilités dans la comptabilité
Quelle est la liste des offres d'emploi ?
Où est la liste des offres d'emploi ?
Nouveaux emplois ?
Nouveaux postes ?
Est-ce qu'il y a de nouvelles offres d'emploi dans un bureau à paris ?
Je cherche un travail
Un poste pour un développeur ?
Un poste pour un développeur Node.js ?
Est-ce que tu as du travail pour moi ?
Je veux un poste de développeur back end
Je cherche un poste de chef de projet
Je cherche un poste de développeur web
```
- Identify some `Entities` to be able to determine the main subject of the intents
- Insert also few sentences in the `None` intent to show which kind of sentence should be ignored
```text
Les aboiements des chiens sont gênants
Commande moi une pizza
Les pingouins sont dans l'océan
Aujourd'hui j'ai mangé une pomme
```
- Click on `Train` to build the model
- Click on `Publish` to make it available publicly
- You can use the `Starter_Key` to try your model (*For production workload, it is recommended to create a Service Endpoint on Azure and use it in LUIS portal*)

### Create a python application
- Create a virtual environment using `python -m venv luis` (*where `luis` is the name of your python application*)
- Activate your venv using `Scripts\activate.bat`
- Install `requests` python package using `pip install requests` (*Python 3.6*)
- Create a new file `run.py`
- Add an import to the requests package
```python
import requests
```
- Create a `headers` object with a header named `Ocp-Apim-Subscription-Key`, and use the value of your Subscription Key
```python
headers = {
    'Ocp-Apim-Subscription-Key': '{{MY_SERVICE_KEY}}',
}
azureregion = "westeurope"
applicationid = "{{MY_APP_ID}}"
```
- Create a `params` object with a parameter named `q`, meaning query and specify a sentence you would like to analyze
```python
params = {
    'q': 'Je cherche un poste de développeur front'
}
```
- Send the request to the api and print the result
```python
try:
    r = requests.get("https://{0}.api.cognitive.microsoft.com/luis/v2.0/apps/{1}" format(azureregion, applicationid), headers=headers, params=params)
    print(r.json())

except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
```

### Run your python application
- Run `python run.py` and check that your app correctly recognized the intent

![nlp_11.PNG](/wiki/assets/nlp_11.PNG)
