import express from "express";
import sequelize from "./db/sequelize/sequelize.js";
import apiRouter from "./routers/apiRouter.js";
import 'dotenv/config'

const server = express();

sequelize.authenticate()
server.use('/api', apiRouter)

export default server;


