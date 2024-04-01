import express, { Express, Request, Response } from "express";
import lightsController from "../controllers/lightsController"
const router = express.Router();

router.get('/scripts', async function (req, res, next) {
  const scripts = await lightsController.listScripts();
  res.send(JSON.stringify(scripts));
});

router.post('/scripts/run/:scriptName([A-z\.]*)', async function (req, res, next) {
    const scriptName = req.params.scriptName;
    const scripts = await lightsController.runScript(scriptName, []);
    res.send(JSON.stringify(scripts));
});

module.exports = router;
