import mongoose from 'mongoose';
import IPostDocument from './post-document';

const post = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: false,
        default: 0
    }
});

export default mongoose.model<IPostDocument>('Post', post);