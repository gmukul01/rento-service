import mongoose from 'mongoose';

export const Bike = mongoose.model<{ color: string; model: string; location: string; rating: { [k: string]: number }[] }>(
    'Bike',
    new mongoose.Schema({
        color: String,
        model: String,
        location: String,
        ratings: {
            type: Map,
            of: Number
        }
    })
);
