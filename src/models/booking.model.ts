import mongoose from 'mongoose';

export type BookingType = { bikeId: string; userId: string; startTime: Date; endTime: Date; isCancelled: boolean };

export const Booking = mongoose.model<BookingType>(
    'Booking',
    new mongoose.Schema({
        bikeId: String,
        userId: String,
        startTime: Date,
        endTime: Date,
        isCancelled: Boolean
    })
);
