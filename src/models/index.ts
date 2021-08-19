import mongoose from 'mongoose';
import { Bike } from './bike.model';
import { Role } from './role.model';
import { User } from './user.model';
mongoose.Promise = global.Promise;

export const db = {
    mongoose,
    role: Role,
    user: User,
    bike: Bike,
    ROLES: ['user', 'admin', 'moderator']
};
