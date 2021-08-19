import { RequestHandler } from 'express';
import { db } from '../models/index';

export const checkDuplicateEmail: RequestHandler = (req, res, next) => {
    db.user
        .findOne({
            email: req.body.email
        })
        .exec((err, user) => {
            err && res.status(500).send({ variant: 'error', message: err });
            user && res.status(400).send({ variant: 'error', message: 'Failed! Email is already in use!' });
            next();
        });
};
