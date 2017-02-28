"use strict";

var router = require("express").Router();
var path = require("path");
var getData = require("./data");

router.get("/", function(req, res, next) {
  res.render("index");
});

router.get("/json", function(req, res, next) {
  getData(req, res, next);
});

router.use(function(req, res, next) {
  res.status(404).render("404");
});

module.exports = router;