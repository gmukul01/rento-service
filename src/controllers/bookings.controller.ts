import { RequestHandler } from 'express';
import { BookingType } from 'models/booking.model';
import { EnforceDocument } from 'mongoose';
import { db } from '../models/index';

const Booking = db.booking,
    User = db.user;

export const createBooking: RequestHandler = (req, res) => {
    const { startDate, startTime, endDate, endTime, bikeId, ...restBody } = req.body,
        calculatedStartTime = new Date(`${startDate} ${startTime}`),
        calculatedEndTime = new Date(`${endDate} ${endTime}`);

    return new Booking({
        isCanceled: false,
        ...restBody,
        // @ts-ignore
        user: req.userId,
        bike: bikeId,
        startTime: calculatedStartTime,
        endTime: calculatedEndTime
    })
        .save()
        .then(booking =>
            User.findOne({
                // @ts-ignore
                _id: req.userId
            }).then(user => {
                user.bookings.push(booking.id);
                return user.save();
            })
        )
        .then(() => res.send({ variant: 'success', message: 'Booking is done successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
};

const attachInfo = (bookings: EnforceDocument<BookingType, unknown>[]) =>
    bookings.map(booking => {
        const bookingJson = booking.toJSON();
        return { ...bookingJson.bike, ...bookingJson.user, ...bookingJson, password: undefined, id: booking.id };
    });

export const getAllBookings: RequestHandler = (req, res) =>
    Booking.find(req.query)
        .populate('bike')
        .populate('user')
        .exec()
        .then(attachInfo)
        .then(bookings => res.send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getAllUserBookings: RequestHandler = (req, res) =>
    // @ts-ignore
    Booking.find({ user: req.params.userId })
        .populate('bike')
        .populate('user')
        .exec()
        .then(attachInfo)
        .then(bookings => res.status(200).send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getPastBookings: RequestHandler = (req, res) =>
    // @ts-ignore
    Booking.find({ user: req.userId })
        // @ts-ignore
        .or([{ startTime: { $lte: new Date().getTime() } }, { isCanceled: true }])
        .populate('bike')
        .populate('user')
        .exec()
        .then(attachInfo)
        .then(bookings => res.status(200).send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getUpcomingBookings: RequestHandler = (req, res) =>
    // @ts-ignore
    Booking.find({ user: req.userId, startTime: { $gte: new Date().getTime() }, isCanceled: false })
        .populate('bike')
        .populate('user')
        .exec()
        .then(attachInfo)
        .then(bookings => res.status(200).send(bookings))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

const removeBookingFromUser = (booking: EnforceDocument<BookingType, unknown>) =>
    User.findOne({ _id: booking.user }).then(user => {
        // @ts-ignore
        user.bookings.pull(booking.id);
        return user.save();
    });

export const updateBooking: RequestHandler = (req, res) =>
    Booking.updateOne({ _id: req.params.bookingId }, req.body, { strict: true, upsert: true })
        .then(() => res.send({ variant: 'success', message: 'Booking is updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const deleteBooking: RequestHandler = (req, res) =>
    Booking.findOne({ _id: req.params.bookingId })
        .then(booking => booking.deleteOne().then(() => removeBookingFromUser(booking)))
        .then(() => res.send({ variant: 'success', message: 'Booking is deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
