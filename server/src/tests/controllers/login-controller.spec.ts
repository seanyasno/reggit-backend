import {Config} from '../../conf/config';
import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();

const config = Config.getInstance().getConfiguration();
const baseUrl = config.ROUTES.AUTHENTICATION.BASE;

const login = async (username: string, password: string) => {
    return chai.request(app)
        .post(baseUrl + config.ROUTES.AUTHENTICATION.LOGIN)
        .set('content-type', 'application/json')
        .send({
            username,
            password
        });
}

describe('Login Controller', () => {
    it('Successful login', async () => {
        const response = await login('admin', 'admin');
        response.should.have.status(200);
        response.should.have.be.an('object');
        chai.expect(response.body).to.have.key('token');
    });

    it('Short password', async () => {
        const response = await login('admin', 'lol');
        response.should.have.status(401);
        response.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.a('string')
            .equal('"password" length must be at least 5 characters long');
    });

    it('Short username', async () => {
        const response = await login('aaa', 'lollol');
        response.should.have.status(401);
        response.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.a('string')
            .equal('"username" length must be at least 5 characters long');
    });

    it('Wrong password', async () => {
        const response = await login('admin', '123456');
        response.should.have.status(401);
        response.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.a('string')
            .equal('Invalid Credentials');
    });

    it('Wrong username', async () => {
        const response = await login('aaaaa', '123456');
        response.should.have.status(401);
        response.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.a('string')
            .equal('Invalid Credentials');
    });

    it('Empty username', async () => {
        const response = await login('', '123456');
        response.should.have.status(401);
        response.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.a('string')
            .equal('"username" is not allowed to be empty');
    });

    it('Empty password', async () => {
        const response = await login('aaaaaa', '');
        response.should.have.status(401);
        response.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.a('string')
            .equal('"password" is not allowed to be empty');
    });
});