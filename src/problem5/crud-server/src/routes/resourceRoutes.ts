import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';

export const resourceRoutes: Router = Router();

resourceRoutes.post('/', ResourceController.create);

resourceRoutes.get('/', ResourceController.getAll);

resourceRoutes.get('/:id', ResourceController.getById);

resourceRoutes.put('/:id', ResourceController.update);

resourceRoutes.delete('/:id', ResourceController.delete);