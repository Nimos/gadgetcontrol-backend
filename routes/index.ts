import express, { Express, Request, Response } from "express";
import lightsController from "../controllers/lightsController"
var router = express.Router();

router.get('/', async function (req, res, next) {
  res.send(":)");
});

module.exports = router;
