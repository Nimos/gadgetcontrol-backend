import express, { Express, Request, Response } from "express";
import authController from "../controllers/authController"
var router = express.Router();

router.post('/login', async function (req, res, next) {
    res.json(authController.login(req));
});

module.exports = router;
