import mongoose from 'mongoose';

type User = { username: string; email: string; firstName: string; lastName: string; password: string; roles: { name: string }[] };

export const User = mongoose.model<User>(
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
        ]
    })
);
