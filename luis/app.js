const LUISClient = require("./luis-node/luis_sdk")

let appId = "{{MY_LUIS_APPID}}";
let appKey = "{{MY_LUIS_APPKEY}}";

var client = LUISClient({
  appId: appId,
  appKey: appKey,
  verbose: true,
  luisURL: "westeurope.api.cognitive.microsoft.com"
});

client.predict("Hi", {
  onSuccess: function(response){
    console.log(response);
  },

  onFailure: function(err){
    console.error(err);
  }
});
