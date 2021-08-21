import mongoose from 'mongoose';

export type UserType = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roles: { name: string }[];
    bookings: string[];
};

export const User = mongoose.model<UserType>(
    'User',
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ],
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking'
            }
        ]
    })
);
