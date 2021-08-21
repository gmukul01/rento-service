import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import { UserType } from 'models/user.model';
import { EnforceDocument } from 'mongoose';
import { db } from '../models/index';
import { attachRoles, getRoleNames } from './auth.controller';

const User = db.user;

const attachInfo = (users: EnforceDocument<UserType, unknown>[]) =>
    users.map(user => ({
        ...user.toJSON(),
        password: undefined,
        id: user.id,
        roles: user.roles.map((role: { name: string }) => role.name)
    }));

export const getAllUsers: RequestHandler = (req, res) =>
    User.find({
        ...(typeof req.query.hasBookings === 'boolean' ? { $where: `this.bookings.length ${req.query.hasBookings ? '> 1' : '= 0'}` } : {})
    })
        .populate('roles')
        .populate('bookings')
        .exec()
        .then(attachInfo)
        .then(users => res.status(200).send(users))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const createUser: RequestHandler = (req, res) =>
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
            res.status(200).send({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: getRoleNames(user.roles)
            })
        )
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const updateUser: RequestHandler = (req, res) =>
    User.findOne({
        _id: req.params.userId
    })
        .then(user =>
            Promise.all([
                User.updateOne(
                    {
                        _id: req.params.userId
                    },
                    { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.username },
                    { strict: true, upsert: true }
                ),
                attachRoles(user, req.body.roles)
            ])
        )
        .then(() => res.send({ variant: 'success', message: 'User is updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const deleteUser: RequestHandler = (req, res) =>
    User.deleteOne({ _id: req.params.userId })
        .then(() => res.send({ variant: 'success', message: 'Booking is deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
