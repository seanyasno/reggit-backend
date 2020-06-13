import {ValidationResult} from '@hapi/joi';
import IUserAuth from '../../user-auth';
import userScheme from './user-scheme';

export default (user: IUserAuth): ValidationResult => userScheme.validate(user);