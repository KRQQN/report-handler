import 'dotenv/config';
import express from "express";
import sequelize from '../.codebin/sequelize/sequelize.js';
import apiRouter from './routers/apiRouter.js';
import 'dotenv/config';


const server = express();

server.use(express.json());
server.use('/api', apiRouter)
server.get('/test', (req, res) => {
    console.log('test');
    console.log(req.ip)
    return res.status(200)
    
})


export default server;


