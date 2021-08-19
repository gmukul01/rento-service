import { RequestHandler } from 'express';
import { db } from '../models/index';

const Bike = db.bike;

export const createBike: RequestHandler = (req, res) =>
    new Bike({ ...req.body, ratings: {} })
        .save()
        .then(() => res.send({ variant: 'success', message: 'Bike was registered successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const updateBike: RequestHandler = (req, res) =>
    Bike.updateOne({ _id: req.params.bikeId }, req.body, { strict: true, upsert: true })
        .then(() => res.send({ variant: 'success', message: 'Bike was updated successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const deleteBike: RequestHandler = (req, res) =>
    Bike.deleteOne({ _id: req.params.bikeId })
        .then(() => res.send({ variant: 'success', message: 'Bike was deleted successfully!' }))
        .catch(err => res.status(500).send({ variant: 'error', message: err }));

export const rateBike: RequestHandler = (req, res) =>
    Bike.findOne({ _id: req.params.bikeId })
        .then(bike => {
            // @ts-ignore
            bike.ratings.set(req.userId, req.query.rating);
            return bike
                .save()
                .then(() => res.send({ variant: 'success', message: 'Rating was registered successfully!' }))
                .catch(err => res.status(500).send({ variant: 'error', message: err }));
        })
        .catch(err => res.status(500).send({ variant: 'error', message: err }));
