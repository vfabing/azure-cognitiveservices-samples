import requests

headers = {
    'Ocp-Apim-Subscription-Key': '{{MY_SERVICE_KEY}}',
}
azureregion = "westeurope"
applicationid = "{{MY_APP_ID}}"

params = {
    'q': 'Je cherche un poste de développeur front'
}

try:
    r = requests.get("https://{0}.api.cognitive.microsoft.com/luis/v2.0/apps/{1}".format(azureregion, applicationid), headers=headers, params=params)
    print(r.json())

except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
