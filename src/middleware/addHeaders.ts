import { RequestHandler } from 'express';

export const addHeaders: RequestHandler = (req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
};
