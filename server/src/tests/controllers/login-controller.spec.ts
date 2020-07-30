import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';
import {Config} from '../../conf/config';
import {request, Request, Response} from 'express';

chai.use(chaiHttp);
chai.should();

const config = Config.getInstance().getConfiguration();
const baseUrl = config.ROUTES.AUTHENTICATION.BASE;

// @ts-ignore
const login = (username: string, password: string): request.SuperAgentRequest => {
    return chai.request(app)
        .post(baseUrl + config.ROUTES.AUTHENTICATION.LOGIN)
        .set('content-type', 'application/json')
        .send({
            username,
            password
        });
}

describe('Login Controller', () => {
    it('should login and return user profile.', done => {
        login('seanyasno', 'bsgyns0w').end(((error: any, response: Response) => {
            response.should.have.status(200);
            response.should.have.be.an('object');
            done();
        }));
    });

    it('should not login and return an indicator', done => {
        login('seanyasno', 'lol').end((error: any, response: Response) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            done();
        });
    });
});