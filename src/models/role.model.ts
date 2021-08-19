import mongoose from 'mongoose';

export const Role = mongoose.model<{ _id: string; name: string }>(
    'Role',
    new mongoose.Schema({
        name: String
    })
);
