import {IPost} from '../../';
import {Document} from 'mongoose';

export default interface IPostDocument extends Document, IPost {}