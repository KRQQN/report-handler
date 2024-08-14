import express from 'express'

const planRouter = express.Router()

planRouter.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});

export default planRouter;