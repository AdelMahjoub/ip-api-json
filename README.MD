# Whoami Api
## Usage
To receive the response, send a GET request to

https://[not available].herokuapp.com/json 
## Response

A successuful request will return the following:
```
{
  "ip": "::ffff:127.0.0.1",
  "language": "fr-FR",
  "software": "(X11; Linux x86_64)",
  "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
  "location": {
    "ip": "127.0.0.1",
    "country_code": "",
    "country_name": "",
    "region_code": "",
    "region_name": "",
    "city": "",
    "zip_code": "",
    "time_zone": "",
    "latitude": 0,
    "longitude": 0,
    "metro_code": 0
  },
  "isp": {}
}
```