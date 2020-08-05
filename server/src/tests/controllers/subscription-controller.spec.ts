import Config from '../../conf/config';
import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();
const config = Config.getInstance().getConfiguration().ROUTES.SUBSCRIPTION;

const userId: string = '21e0bac7-5079-457a-ad10-fbfe3fe08518';
const forumId: string = 'b39fb97b-f840-403a-92b5-be9cf7302d70';

describe('Subscription Controller', () => {
    it('New subscribe', async () => {
        const response = await chai.request(app).post(config.BASE + config.CREATE).set('content-type', 'application/json').send({userId, forumId});
        console.log(response.body);
        response.should.have.status(200);
        response.body.should.be.an('object');
        response.body.should.have.keys('id', 'userId', 'forumId');
    });

    it('Remove subscribe', async () => {
        const response = await chai.request(app).delete(config.BASE + config.REMOVE).set('content-type', 'application/json').send({userId, forumId});
        console.log(response.body);
        response.should.have.status(200);
        response.body.should.be.an('number');
        response.body.should.have.be.equals(1);
    });
});