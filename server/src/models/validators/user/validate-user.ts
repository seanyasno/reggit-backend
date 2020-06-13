import {ValidationResult} from '@hapi/joi';
import userScheme from './user-scheme';
import IUserAuth from '../../user-auth';

export default (user: IUserAuth): ValidationResult => userScheme.validate(user);