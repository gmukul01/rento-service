import mongoose from 'mongoose';
import { Role } from './role.model';
import { User } from './user.model';
mongoose.Promise = global.Promise;

export const db = {
    mongoose,
    role: Role,
    user: User,
    ROLES: ['user', 'admin', 'moderator']
};
