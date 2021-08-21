import { RequestHandler } from 'express';
import { UserType } from 'models/user.model';
import { EnforceDocument } from 'mongoose';
import { db } from '../models/index';

const User = db.user;

const attachRoleNames = (users: EnforceDocument<UserType, unknown>[]) =>
    users.map(user => ({ ...user.toJSON(), id: user.id, roles: user.roles.map((role: { name: string }) => role.name) }));

export const getAllUsers: RequestHandler = (_, res) =>
    User.find()
        .populate('roles', '-__v')
        .exec()
        .then(attachRoleNames)
        .then(users => res.status(200).send(users))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const updateUser: RequestHandler = (req, res) =>
    User.updateOne({ _id: req.params.userId }, req.body, { strict: true, upsert: true })
        .then(() => res.send({ variant: 'success', message: 'User is updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const deleteUser: RequestHandler = (req, res) =>
    User.deleteOne({ _id: req.params.userId })
        .then(() => res.send({ variant: 'success', message: 'Booking is deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
