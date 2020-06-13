import IUserDocument from './user-document';
import mongoose from 'mongoose';

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model<IUserDocument>('User', user);