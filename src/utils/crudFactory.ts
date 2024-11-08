import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase/supabase.js';

function createCrudRouter(table: string): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase.from(table).insert(req.body);

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase.from(table).select('*');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(req.body)
        .eq('id', req.params.id);

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export default createCrudRouter;
