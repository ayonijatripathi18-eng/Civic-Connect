import { Router, Request, Response } from 'express';

export const healthRouter = Router();

/**
 * GET /api/health
 * Health check endpoint indicating service availability.
 */
healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'civic-connect-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});
