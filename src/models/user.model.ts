import mongoose from 'mongoose';

export const User = mongoose.model<{ username: string; email: string; password: string; roles: { name: string }[] }>(
    'User',
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ]
    })
);
