import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';

export const verifyToken: RequestHandler = (req, res, next) => {
    const token = req.headers['x-access-token'] as string;

    if (!token) {
        return res.status(403).send({ variant: 'error', message: 'No token provided!' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        err && res.status(401).send({ variant: 'error', message: 'Unauthorized!' });

        if (decoded) {
            // @ts-ignore
            req.userId = decoded.id;
            next();
        }
    });
};
