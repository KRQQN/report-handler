import express from 'express';
import reportRouter from './reportRouter.js';
import jobRouter from './jobRouter.js';
import planRouter from './planRouter.js';

const apiRouter = express.Router();

apiRouter.use('/report', reportRouter);
apiRouter.use('/plan', planRouter);
apiRouter.use('/job', jobRouter);

export default apiRouter;
