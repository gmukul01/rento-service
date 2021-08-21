import { RequestHandler } from 'express';
import { db } from '../models/index';

const Bike = db.bike,
    Booking = db.booking;

export const createBike: RequestHandler = (req, res) =>
    new Bike({ ...req.body, ratings: {}, rating: 0 })
        .save()
        .then(() => res.send({ variant: 'success', message: 'Bike is registered successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const updateBike: RequestHandler = (req, res) =>
    Bike.updateOne({ _id: req.params.bikeId }, req.body, { strict: true, upsert: true })
        .then(() => res.send({ variant: 'success', message: 'Bike is updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getAllBikes: RequestHandler = (req, res) => {
    const { startDate, startTime, endDate, endTime, ratings = [0, 1, 2, 3, 4, 5], ...restQuery } = req.query;

    const startTimeQuery = startDate && startTime && new Date(`${startDate} ${startTime}`),
        endTimeQuery = endDate && endTime && new Date(`${endDate} ${endTime}`),
        isTimeQueryPresent = startTimeQuery || endTimeQuery;

    // @ts-ignore
    return Bike.find({ ...restQuery, rating: { $in: ratings } })
        .then(bikes =>
            Promise.all(
                bikes.map(async bike => ({
                    ...bike.toJSON(),
                    id: bike.id,
                    isAvailable: await Booking.find({
                        isCancelled: false,
                        bikeId: bike._id,
                        ...(startTimeQuery ? { endTime: { $gt: startTimeQuery } } : {}),
                        ...(endTimeQuery ? { startTime: { $lt: endTimeQuery } } : {})
                    }).then(bookings => (isTimeQueryPresent ? !bookings.length : true))
                }))
            )
        )
        .then(bikes => res.status(200).send(bikes))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
};

export const deleteBike: RequestHandler = (req, res) =>
    Bike.deleteOne({ _id: req.params.bikeId })
        .then(() => res.send({ variant: 'success', message: 'Bike is deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const rateBike: RequestHandler = (req, res) =>
    Bike.findOne({ _id: req.params.bikeId })
        .then(bike => {
            // @ts-ignore
            bike.ratings.set(req.userId, req.body.rating);
            bike.rating = Math.floor(Array.from(bike.ratings).reduce((acc, curr) => acc + curr[1], 0) / bike.ratings.size);
            return bike
                .save()
                .then(() => res.send({ variant: 'success', message: 'Rating is saved successfully!' }))
                .catch(err => res.status(500).send({ variant: 'error', message: err }));
        })
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
