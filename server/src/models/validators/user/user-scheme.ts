import joi from '@hapi/joi';

export default joi.object({
    username: joi.string().min(5).alphanum().required(),
    password: joi.string().min(5).required()
});