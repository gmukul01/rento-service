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
    const { startDate, startTime, endDate, endTime, ratings, models, colors, ...restQuery } = req.query,
        query = {
            ...restQuery,
            ...(ratings ? { rating: { $in: (ratings as string).split(',') } } : {}),
            ...(models ? { model: { $in: (models as string).split(',') } } : {}),
            ...(colors ? { color: { $in: (colors as string).split(',') } } : {})
        };

    const startTimeQuery = startDate && startTime && new Date(`${startDate} ${startTime}`),
        endTimeQuery = endDate && endTime && new Date(`${endDate} ${endTime}`),
        isTimeQueryPresent = startTimeQuery || endTimeQuery;

    // @ts-ignore
    return Bike.find({ ...query })
        .then(bikes =>
            Promise.all(
                bikes.map(async bike => ({
                    ...bike.toJSON(),
                    id: bike.id,
                    isAvailable: await Booking.find({
                        isCanceled: false,
                        bike: bike._id,
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

export const getAllModels: RequestHandler = (req, res) =>
    Bike.find()
        .select('model -_id')
        .then(models => res.status(200).send(models.map(({ model }) => model)))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const getAllColors: RequestHandler = (req, res) =>
    Bike.find()
        .select('color -_id')
        .then(colors => res.status(200).send(colors.map(({ color }) => color)))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
