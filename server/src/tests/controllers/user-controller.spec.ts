import {replaceJsonVariable} from '../../utils';
import {Config} from '../../conf/config';
import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();

const config = Config.getInstance().getConfiguration().ROUTES.AUTHENTICATION;
const baseUrl = config.BASE;

const userId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633694';
const notExistedUserId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633699';
const invalidUserId: string = 'invalid';

describe('User Controller', () => {
   it('Get all users', async () => {
       const response = await chai.request(app).get(baseUrl + config.GET_ALL_USERS);
       console.log(response.body);
       response.should.have.status(200);
       response.body.should.have.key('users');
       response.body.users.should.have.be.an('array');
   });

   it('Get user profile', async () => {
      const response = await chai.request(app).get(baseUrl + replaceJsonVariable(config.GET_PROFILE_BY_ID, 'userId', userId));
      console.log(response.body);
      response.should.have.status(200);
      response.body.should.have.be.an('object');
      response.body.should.have.keys('id', 'userId', 'firstName', 'lastName');
   });

   it('Get user profile with empty user id', async () => {
      const response = await chai.request(app).get(baseUrl + replaceJsonVariable(config.GET_PROFILE_BY_ID, 'userId', ''));
      console.log(response.body);
      response.should.have.status(404);
   });

   it('Get user profile with not existed user id', async () => {
      const response = await chai.request(app).get(baseUrl + replaceJsonVariable(config.GET_PROFILE_BY_ID, 'userId', notExistedUserId));
      console.log(response.body);
      response.should.have.status(200);
   });

   it('Get user profile with invalid user id', async () => {
      const response = await chai.request(app).get(baseUrl + replaceJsonVariable(config.GET_PROFILE_BY_ID, 'userId', invalidUserId));
      console.log(response.body);
      response.should.have.status(400);
      response.body.errors.form.should.be.equals('SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"');
   });
});