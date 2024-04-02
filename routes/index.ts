import express, { Express, Request, Response } from "express";
import authController from "../controllers/authController";
var router = express.Router();

router.get('/', async function (req, res, next) {
  res.send(":)");
});

module.exports = router;
