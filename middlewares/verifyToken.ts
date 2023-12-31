import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  try {
    const decoded: JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    if (typeof decoded === 'string')
      return res.status(401).json({ message: 'Unauthorized' });

    req.userId = decoded.userId as string;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', err });
  }
};
