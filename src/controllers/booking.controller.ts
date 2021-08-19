import { RequestHandler } from 'express';
import { db } from '../models/index';

const Booking = db.booking;

export const rentBike: RequestHandler = (req, res) =>
    // @ts-ignore
    new Booking({ ...req.body, userId: req.userId })
        .save()
        .then(() => res.send({ variant: 'success', message: 'Booking was registered successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getAllBookings: RequestHandler = (req, res) =>
    Booking.find(req.query)
        .then(bookings => res.send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const updateBooking: RequestHandler = (req, res) =>
    Booking.updateOne({ _id: req.params.bookingId }, req.body, { strict: true, upsert: true })
        .then(() => res.send({ variant: 'success', message: 'Booking was updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const deleteBooking: RequestHandler = (req, res) =>
    Booking.deleteOne({ _id: req.params.bookingId })
        .then(() => res.send({ variant: 'success', message: 'Booking was deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
