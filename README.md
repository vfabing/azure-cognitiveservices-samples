# node-azure-cognitiveservices-samples
This repository show how to use Azure Cognitive Services with Node JS in just a few lines of code.

## Prerequisites
All of these demo require a *Microsoft Azure Subscription*
You can get a **free** Azure Account and get access to **free** Cognitive Services :
- **5 million** characters of **Text to Speech** for free
- **5 000** transactions of **Computer Vision** for free
- **10 000** transactions of **Language Understanding** (LUIS) for free

https://azure.microsoft.com/en-us/free/

## Computer Vision
### Create a Computer Vision service on Azure
- Connect to Azure Portal: https://portal.azure.com
- Create a new Computer Vision service
- Get your Computer Vision API Keys

### Create a Node JS app
- Create a package.json file with `npm init -f`
- Install the following dependencies:
  - `npm i ms-rest-azure` to connect to Cognitive Services
  - `npm i azure-cognitiveservices-computervision` to manipulate Computer Vision API
  - `npm i fs` to access file system (and especially the image from where we want to extract some text)
