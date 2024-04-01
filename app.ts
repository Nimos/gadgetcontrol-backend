import express, { Express, Request, Response } from "express";
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const lightsRouter = require('./routes/lights');

const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use('/', indexRouter);
app.use('/lights', lightsRouter);

module.exports = app;
