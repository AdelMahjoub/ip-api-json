"use strict";

var http = require("http");
var dns = require("dns");
var whois = require("whois");

module.exports = function(req, res, next) {
  var info = {}; // data to send
  info.ip = req.get("X-Forwarded-For");
  info.language = req.get("Accept-Language").split(",")[0];
  info.software = req.get("user-agent").match(/\(.+?\)/)[0];
  info.user_agent = req.get("user-agent");
  // Get GeoIP info
  http.get("http://freegeoip.net/json/" + info.ip, function(response) {
    response.setEncoding('utf8');
    response.on("data", function(data) {
      info.location = JSON.parse(data);
      //Get ISP Info
      dns.reverse(info.ip, function(err, domain) {
        if(err) {
          return res.json(info);
        }
        // domain has this format: [ 'aaa-xxx-xxx-xxx-xxx-xxx.y.domain.net' ]
        // extract domain's name for the whois request
        var domainArray = domain[0].split(".");
        var start = domainArray.length - 2;
        var end = domainArray.length - 1;
        // domainName shoul look like this: domain.net
        var domainName = domainArray.splice(start, end).join(".");
        // Whois request
        whois.lookup(domainName, function(err, data) {
          if(err) {
            return res.json(info);
          }
          // data is a string, each useful info is in a separate line
          // convert it to an array
          var ispDataArray = data.split("\n");
          // prepare the isp info in an object format
          var ispDataObject = {};
          var i = 0;
          // format the isp data array into an object
          ispDataArray.forEach(function(chunk) {
            // each element of the array is a string like this: ["key: value"]
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
          isp.primaryDns = ispDataObject.dns1;
          isp.secondaryDns = ispDataObject.dns2;
          info.isp = isp;
          res.json(info);
        });
      });
    });
  });
}