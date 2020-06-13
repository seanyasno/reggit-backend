import IUserAuth from '../user-auth';
import {Document} from 'mongoose';

export default interface IUserDocument extends Document, IUserAuth {}