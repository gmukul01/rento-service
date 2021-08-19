import { RequestHandler } from 'express';
import { db } from '../models/index';

const Bike = db.bike;

export const createBike: RequestHandler = (req, res) => {
    const bike = new Bike(req.body);

    bike.save((err, bike) => {
        err && res.status(500).send({ variant: 'error', message: err });
        bike && res.send({ variant: 'success', message: 'Bike was registered successfully!' });
    });
};

export const rateBike: RequestHandler = (req, res) => {
    // @ts-ignore
    Bike.findOne({ _id: req.params.bikeId }, (err, bike) => {
        err && res.status(500).send({ variant: 'error', message: err });
        // @ts-ignore
        bike.ratings.set(req.userId, req.query.rating);
        bike.save((err: unknown) => {
            err && res.status(500).send({ variant: 'error', message: err });
            res.send({ variant: 'success', message: 'Rating was registered successfully!' });
        });
    });
};
