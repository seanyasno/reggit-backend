import {ValidationResult} from '@hapi/joi';
import userScheme from './user-scheme';
import UserAuth from '../../user-auth';

export default (user: UserAuth): ValidationResult => userScheme.validate(user);