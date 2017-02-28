"use strict";

var express = require("express");
var path = require("path");
var dns = require("dns");
var http = require("http");
var whois = require("whois");

var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res, next) {
  // data to send
  var info = {};
  // Get GeoIP info
  http.get("http://freegeoip.net/json/78.197.142.117", function(response) {
    response.setEncoding('utf8');
    response.on("data", function(data) {
      info = JSON.parse(data);
      info.user_agent = req.get("user-agent");
      //Get ISP Info
      dns.reverse("78.197.142.117", function(err, domain) {
        // domain has this format [ 'aaa-xxx-xxx-xxx-xxx-xxx.y.domain.net' ]
        // extract domain's name for the whois request
        var domainArray = domain[0].split(".");
        var start = domainArray.length - 2;
        var end = domainArray.length - 1;
        // domainName shoul look like this domain.net
        var domainName = domainArray.splice(start, end).join(".");
        // Whois request
        whois.lookup(domainName, function(err, data) {
          // data is a string, each useful info is in a separate line
          // convert it to an array
          var ispDataArray = data.split("\n");
          // prepare the isp info in an object format
          var ispDataObject = {};
          var i = 0;
          // format the isp data array into an object
          ispDataArray.forEach(function(chunk) {
            // each element of the array is a string like this ["key: value"]
            // split each element
            chunk = chunk.replace(/\s/g,"").split(":");
            var key = chunk[0];
            switch(key) {
              case "NameServer":
                i++;
                key = "dns" + i;
                ispDataObject[key] = chunk[1];
                break;
              default:
                ispDataObject[key] = chunk[1];
              break;
            }
          });
          // extract some general info from the formatted whois response
          var isp = {}
          isp.organization = ispDataObject.RegistrantOrganization;
          isp.country = ispDataObject.RegistrantCountry;
          isp.dns1 = ispDataObject.dns1;
          isp.dns2 = ispDataObject.dns2;
          info.isp = isp;
          res.json(info);
        });
      });
    });
  });
});

app.listen(app.get("port"), function() {
  console.log("Server running on port: " + app.get("port"));
});