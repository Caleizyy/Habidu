import { Request, Response } from 'express';
import { GoogleJwtPayload } from '../types/index';
import { jwtDecode } from 'jwt-decode';
import * as authService from '../services/authService';

// carry on authentication procedure to service layer
export const googleAuth = async (req: Request<{}, {}, { credential: string }>, res: Response) => {
  const { credential } = req.body;
  const decoded = jwtDecode<GoogleJwtPayload>(credential);
  const user = authService.checkIfUserExists(decoded.sub);

  return res.status(201).json({
    message: 'User authenticated successfully',
    user: user,
  });
};
