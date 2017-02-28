"use strict";

var express = require("express");
var path = require("path");
var dns = require("dns");
var os = require("os");
var tcp = require("net");
var http = require("http")

var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res, next) {
  var info = {};
  http.get("http://freegeoip.net/json/" + req.ip, function(response) {
    response.setEncoding('utf8');
    response.on("data", function(data) {
      info = JSON.parse(data);
      info.user_agent = req.get("user-agent");
      res.json(info);
    });
  });
});

app.listen(app.get("port"), function() {
  console.log("Server running on port: " + app.get("port"));
});