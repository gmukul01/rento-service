import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { db } from '../models/index';

const User = db.user,
    Role = db.role;

export const signUp: RequestHandler = (req, res) =>
    new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .save()
        .then(user => {
            if (req.body.roles) {
                return Role.find({
                    name: { $in: req.body.roles }
                })
                    .then(roles => {
                        // @ts-ignore
                        user.roles = roles.map(role => role._id);
                        return user
                            .save()
                            .then(() => res.send({ variant: 'success', message: 'User was registered successfully!' }))
                            .catch(err => res.status(500).send({ variant: 'error', message: err }));
                    })
                    .catch(err => res.status(500).send({ variant: 'error', message: err }));
            } else {
                return Role.findOne({ name: 'user' })
                    .then(role => {
                        user.roles = [role._id];
                        return user
                            .save()
                            .then(() => res.send({ variant: 'success', message: 'User was registered successfully!' }))
                            .catch(err => res.status(500).send({ variant: 'error', message: err }));
                    })
                    .catch(err => res.status(500).send({ variant: 'error', message: err }));
            }
        })
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const signIn: RequestHandler = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate('roles', '-__v')
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).send({ variant: 'error', message: 'User Not found.' });
            }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    variant: 'error',
                    message: 'Invalid Password!'
                });
            }

            const token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: 86400 // 24 hours
            });

            const authorities = user.roles.map((role: { name: string }) => 'ROLE_' + role.name.toUpperCase());

            return res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        })
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
};
