import mongoose from 'mongoose';

export const Bike = mongoose.model<{ color: string; model: string; location: string; rating: number; ratings: Map<string, number> }>(
    'Bike',
    new mongoose.Schema({
        color: String,
        model: String,
        location: String,
        rating: Number,
        ratings: {
            type: Map,
            of: Number
        }
    })
);
