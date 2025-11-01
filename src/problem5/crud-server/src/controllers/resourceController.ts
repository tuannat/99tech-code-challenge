import { Request, Response, NextFunction } from 'express';
import { ResourceModel } from '../models/resource';
import { ApiError } from '../middleware/errorHandler';
import {
  createResourceSchema,
  updateResourceSchema,
  resourceFiltersSchema,
  resourceIdSchema,
} from '../utils/validation';

export class ResourceController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = createResourceSchema.validate(req.body);
      if (error) {
        const apiError: ApiError = new Error(error.details[0]?.message || 'Validation error');
        apiError.statusCode = 400;
        throw apiError;
      }

      const resource = await ResourceModel.create(value);
      res.status(201).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = resourceFiltersSchema.validate(req.query);
      if (error) {
        const apiError: ApiError = new Error(error.details[0]?.message || 'Validation error');
        apiError.statusCode = 400;
        throw apiError;
      }

      const [resources, total] = await Promise.all([
        ResourceModel.findAll(value),
        ResourceModel.count(value),
      ]);

      res.status(200).json({
        success: true,
        data: resources,
        pagination: {
          total,
          limit: value.limit,
          offset: value.offset,
          hasMore: value.offset + value.limit < total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = resourceIdSchema.validate({ id: parseInt(req.params.id || '') });
      if (error) {
        const apiError: ApiError = new Error('Invalid resource ID');
        apiError.statusCode = 400;
        throw apiError;
      }

      const resource = await ResourceModel.findById(value.id);
      if (!resource) {
        const apiError: ApiError = new Error('Resource not found');
        apiError.statusCode = 404;
        throw apiError;
      }

      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error: idError, value: idValue } = resourceIdSchema.validate({ 
        id: parseInt(req.params.id || '') 
      });
      if (idError) {
        const apiError: ApiError = new Error('Invalid resource ID');
        apiError.statusCode = 400;
        throw apiError;
      }

      const { error: bodyError, value: bodyValue } = updateResourceSchema.validate(req.body);
      if (bodyError) {
        const apiError: ApiError = new Error(bodyError.details[0]?.message || 'Validation error');
        apiError.statusCode = 400;
        throw apiError;
      }

      const resource = await ResourceModel.update(idValue.id, bodyValue);
      if (!resource) {
        const apiError: ApiError = new Error('Resource not found');
        apiError.statusCode = 404;
        throw apiError;
      }

      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = resourceIdSchema.validate({ id: parseInt(req.params.id || '') });
      if (error) {
        const apiError: ApiError = new Error('Invalid resource ID');
        apiError.statusCode = 400;
        throw apiError;
      }

      const deleted = await ResourceModel.delete(value.id);
      if (!deleted) {
        const apiError: ApiError = new Error('Resource not found');
        apiError.statusCode = 404;
        throw apiError;
      }

      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}