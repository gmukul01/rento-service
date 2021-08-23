import mongoose from 'mongoose';

export type BookingType = {
    bike: Record<string, unknown>;
    user: Record<string, unknown>;
    startTime: Date;
    endTime: Date;
    isCanceled: boolean;
};

export const Booking = mongoose.model<BookingType>(
    'Booking',
    new mongoose.Schema({
        startTime: Date,
        endTime: Date,
        isCanceled: Boolean,
        bike: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bike'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    })
);
