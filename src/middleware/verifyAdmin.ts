import { RequestHandler } from 'express';
import { db } from '../models/index';

const User = db.user,
    Role = db.role;

export const verifyAdmin: RequestHandler = (req, res, next) =>
    // @ts-ignore
    User.findById(req.userId)
        .exec()
        .then(user =>
            // @ts-ignore
            Role.find({
                // @ts-ignore
                _id: { $in: user.roles }
            })
        )
        .then(roles => {
            roles.find((role: { name: string }) => role.name === 'admin')
                ? next()
                : res.status(403).send({ variant: 'error', message: 'Require Admin Role!' });
        })
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
