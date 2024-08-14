import express from "express";
import 'dotenv/config'
import apiRouter from "./routers/apiRouter.js";

const server = express();


server.use('/api', apiRouter)

export default server;


