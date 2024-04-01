import express, { Express, Request, Response } from "express";
import lightsController from "../controllers/lightsController"
var router = express.Router();

router.get('/scripts', async function (req, res, next) {
  const scripts = await lightsController.listScripts();
  res.send(JSON.stringify(scripts));
});

module.exports = router;
