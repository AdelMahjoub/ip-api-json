"use strict";

var http = require("http");
var dns = require("dns");

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
      info.location = JSON.parse(data.toString());
      return res.json(info);
    });
  });
}