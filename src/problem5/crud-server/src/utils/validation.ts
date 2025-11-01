import Joi from 'joi';

export const createResourceSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name must be less than 255 characters',
    'any.required': 'Name is required'
  }),
  description: Joi.string().trim().min(1).max(1000).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 1 character long',
    'string.max': 'Description must be less than 1000 characters',
    'any.required': 'Description is required'
  }),
  category: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Category is required',
    'string.min': 'Category must be at least 1 character long',
    'string.max': 'Category must be less than 100 characters',
    'any.required': 'Category is required'
  }),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const updateResourceSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name must be less than 255 characters'
  }),
  description: Joi.string().trim().min(1).max(1000).messages({
    'string.empty': 'Description cannot be empty',
    'string.min': 'Description must be at least 1 character long',
    'string.max': 'Description must be less than 1000 characters'
  }),
  category: Joi.string().trim().min(1).max(100).messages({
    'string.empty': 'Category cannot be empty',
    'string.min': 'Category must be at least 1 character long',
    'string.max': 'Category must be less than 100 characters'
  }),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

export const resourceFiltersSchema = Joi.object({
  category: Joi.string().allow('').max(100).optional(),
  status: Joi.string().valid('active', 'inactive').allow('').optional(),
  search: Joi.string().allow('').max(255).optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

export const resourceIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});