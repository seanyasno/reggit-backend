import {Config} from '../../conf/config';
import chaiHttp from 'chai-http';
import {request} from 'express';
import app from '../../app';
import chai from 'chai';

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
    it('Successful login', done => {
        login('admin', 'admin').end(((error: any, response: any) => {
            response.should.have.status(200);
            response.should.have.be.an('object');
            chai.expect(response.body).to.have.key('token');
            done();
        }));
    });

    it('Short password', done => {
        login('admin', 'lol').end((error: any, response: any) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            chai.expect(response.body.errors.form).to.be.a('string')
                .equal('"password" length must be at least 5 characters long');
            done();
        });
    });

    it('Short username', done => {
        login('aaa', 'lollol').end((error: any, response: any) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            chai.expect(response.body.errors.form).to.be.a('string')
                .equal('"username" length must be at least 5 characters long');
            done();
        });
    });

    it('Wrong password', done => {
        login('admin', '123456').end((error: any, response: any) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            chai.expect(response.body.errors.form).to.be.a('string')
                .equal('Invalid Credentials');
            done();
        });
    });

    it('Wrong username', done => {
        login('aaaaa', '123456').end((error: any, response: any) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            chai.expect(response.body.errors.form).to.be.a('string')
                .equal('Invalid Credentials');
            done();
        });
    });

    it('Empty username', done => {
        login('', '123456').end((error: any, response: any) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            chai.expect(response.body.errors.form).to.be.a('string')
                .equal('"username" is not allowed to be empty');
            done();
        });
    });

    it('Empty password', done => {
        login('aaaaaa', '').end((error: any, response: any) => {
            response.should.have.status(401);
            response.should.have.be.an('object');
            chai.expect(response.body.errors.form).to.be.a('string')
                .equal('"password" is not allowed to be empty');
            done();
        });
    });
});