import express, { Express, Request, Response } from "express";
import { verifyToken } from "./middlewares/authMiddleware";
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bearerToken = require('express-bearer-token');

const indexRouter = require('./routes/index');
const lightsRouter = require('./routes/lights');
const authRouter = require('./routes/auth');

const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bearerToken())


app.use('/', indexRouter);
app.use('/lights', verifyToken, lightsRouter);
app.use('/auth', authRouter);

module.exports = app;
