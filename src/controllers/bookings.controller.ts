import { RequestHandler } from 'express';
import { BookingType } from 'models/booking.model';
import { EnforceDocument } from 'mongoose';
import { db } from '../models/index';

const Booking = db.booking,
    Bike = db.bike;

export const createBooking: RequestHandler = (req, res) => {
    const { startDate, startTime, endDate, endTime, ...restBody } = req.body,
        calculatedStartTime = new Date(`${startDate} ${startTime}`),
        calculatedEndTime = new Date(`${endDate} ${endTime}`);

    return new Booking({
        isCancelled: false,
        // @ts-ignore
        userId: req.userId,
        ...restBody,
        startTime: calculatedStartTime,
        endTime: calculatedEndTime
    })
        .save()
        .then(() => res.send({ variant: 'success', message: 'Booking is done successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
};

const attachBikeInfo = (bookings: EnforceDocument<BookingType, unknown>[]) =>
    Promise.all(
        bookings.map(booking =>
            Bike.findOne({ _id: booking.bikeId }).then(bike => ({ ...bike.toJSON(), ...booking.toJSON(), id: booking.id }))
        )
    );

export const getAllBookings: RequestHandler = (req, res) =>
    Booking.find(req.query)
        .then(attachBikeInfo)
        .then(bookings => res.send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getPastBookings: RequestHandler = (req, res) =>
    // @ts-ignore
    Booking.find({ userId: req.userId, endTime: { $lte: new Date().getTime() } })
        .then(attachBikeInfo)
        .then(bookings => res.status(200).send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getAllUserBookings: RequestHandler = (req, res) =>
    // @ts-ignore
    Booking.find({ userId: req.params.userId })
        .then(attachBikeInfo)
        .then(bookings => res.status(200).send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getUpcomingBookings: RequestHandler = (req, res) =>
    // @ts-ignore
    Booking.find({ userId: req.userId, startTime: { $gte: new Date().getTime() } })
        .then(attachBikeInfo)
        .then(bookings => res.status(200).send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const updateBooking: RequestHandler = (req, res) =>
    Booking.updateOne({ _id: req.params.bookingId }, req.body, { strict: true, upsert: true })
        .then(() => res.send({ variant: 'success', message: 'Booking is updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const deleteBooking: RequestHandler = (req, res) =>
    Booking.deleteOne({ _id: req.params.bookingId })
        .then(() => res.send({ variant: 'success', message: 'Booking is deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
