import { RequestHandler } from 'express';
import { db } from '../models/index';

export const checkDuplicateUsername: RequestHandler = (req, res, next) => {
    db.user
        .findOne({
            username: req.body.username
        })
        .exec((err, user) => {
            err && res.status(500).send({ variant: 'error', message: err });
            user && res.status(400).send({ variant: 'error', message: 'Failed! Username is already in use!' });
            next();
        });
};
