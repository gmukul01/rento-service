import mongoose from 'mongoose';

export const Booking = mongoose.model(
    'Booking',
    new mongoose.Schema({
        bikeId: String,
        userId: String,
        startTime: Date,
        endTime: Date,
        isCancelled: Boolean
    })
);
