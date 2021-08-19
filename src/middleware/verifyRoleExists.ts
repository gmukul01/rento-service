import { RequestHandler } from 'express';
import { db } from '../models/index';

export const verifyRoleExists: RequestHandler = (req, res, next) => {
    req.body.roles?.forEach((role: string) => {
        if (!db.ROLES.includes(role)) {
            return res.status(400).send({
                variant: 'error',
                message: `Failed! Role ${role} does not exist!`
            });
        }
    });
    next();
};
