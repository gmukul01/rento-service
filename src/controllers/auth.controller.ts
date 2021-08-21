import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UserType } from 'models/user.model';
import { EnforceDocument } from 'mongoose';
import { authConfig } from '../config/auth.config';
import { db } from '../models/index';

const User = db.user,
    Role = db.role;

export const getRoleNames = (roles: { name: string }[]) => roles.map((role: { name: string }) => role.name),
    getAccessToken = (userId: string) =>
        jwt.sign({ id: userId }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        }),
    attachRoles = (user: EnforceDocument<UserType, unknown>, roles: string[]) => {
        if (roles) {
            return Role.find({
                name: { $in: roles }
            }).then(roles => {
                user.roles = roles.map(role => role._id);
                return user.save();
            });
        } else {
            return Role.findOne({ name: 'user' }).then(role => {
                user.roles = [role._id];
                return user.save();
            });
        }
    };

export const signUp: RequestHandler = (req, res) =>
    new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .save()
        .then(user => attachRoles(user, req.body.roles))
        .then(user =>
            res.send({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: getRoleNames(user.roles),
                accessToken: getAccessToken(user.id)
            })
        )
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

            return res.status(200).send({
                id: user.id,
                accessToken: getAccessToken(user.id),
                roles: getRoleNames(user.roles),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        })
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
};
