import express from 'express';
import reportRouter from './reportRouter.js';
import jobRouter from '../../.codebin/jobRouter.js';
import planRouter from '../../.codebin/planRouter.js';
import createCrudRouter from '../utils/crudFactory.js';
import userRouter from './userRouter.js';

const apiRouter = express.Router();
apiRouter.use('/task', createCrudRouter('task'));
apiRouter.use('/report', reportRouter);
apiRouter.use('/auth', userRouter);

export default apiRouter;
