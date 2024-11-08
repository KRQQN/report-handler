import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase/supabase.js';

const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const x = await supabase.auth.signUp({
    email: req.body.email,
    password: req.body.password,
  });

  console.log(x);
  return res.status(201).json(x);
});

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const x = await supabase.auth.signInWithPassword({
    email: req.body.email,
    password: req.body.password,
  });
  console.log(x);
  return res.status(200).json(x);
});

export default userRouter;
