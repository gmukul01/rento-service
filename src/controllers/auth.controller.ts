import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { db } from '../models/index';

const User = db.user,
    Role = db.role;

export const signUp: RequestHandler = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        err && res.status(500).send({ variant: 'error', message: err });

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    err && res.status(500).send({ variant: 'error', message: err });

                    // @ts-ignore
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        err && res.status(500).send({ variant: 'error', message: err });
                        res.send({ variant: 'success', message: 'User was registered successfully!' });
                    });
                }
            );
        } else {
            // @ts-ignore
            Role.findOne({ name: 'user' }, (err, role) => {
                err && res.status(500).send({ variant: 'error', message: err });

                user.roles = [role._id];
                user.save(err => {
                    err && res.status(500).send({ variant: 'error', message: err });
                    res.send({ variant: 'success', message: 'User was registered successfully!' });
                });
            });
        }
    });
};

export const signIn: RequestHandler = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate('roles', '-__v')
        .exec((err, user) => {
            err && res.status(500).send({ variant: 'error', message: err });
            !user && res.status(404).send({ variant: 'error', message: 'User Not found.' });

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            if (!passwordIsValid) {
                res.status(401).send({
                    accessToken: null,
                    variant: 'error',
                    message: 'Invalid Password!'
                });
            }

            const token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: 86400 // 24 hours
            });

            const authorities = user.roles.map((role: { name: string }) => 'ROLE_' + role.name.toUpperCase());

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};
