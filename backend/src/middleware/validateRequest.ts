import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues.map((err: ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        res.status(400).json({
          error: 'Invalid request',
        });
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Normalize query parameters: remove undefined and single-element arrays
      const normalizedQuery: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(req.query)) {
        if (Array.isArray(value)) {
          normalizedQuery[key] = value[0];
        } else if (value !== undefined) {
          normalizedQuery[key] = value;
        }
      }

      console.log('validateQuery - normalized:', normalizedQuery);
      const result = schema.safeParse(normalizedQuery);
      console.log('validateQuery - result:', result);

      if (!result.success) {
        console.error('Query validation failed:', result.error);
        res.status(400).json({
          error: 'Validation error',
          details: result.error.issues.map((err: ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      // @ts-expect-error - Zod validates the data, so assignment is safe despite type mismatch
      req.query = result.data;
      next();
    } catch (error) {
      console.error('validateQuery unexpected error:', error);
      res.status(500).json({
        error: 'Unexpected validation error',
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      // @ts-expect-error - Zod validates the data, so assignment is safe despite type mismatch
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues.map((err: ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        res.status(400).json({
          error: 'Invalid request',
        });
      }
    }
  };
};
