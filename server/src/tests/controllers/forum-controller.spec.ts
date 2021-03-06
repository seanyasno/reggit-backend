import {Config} from "../../conf/config";
import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();

const config = Config.getInstance().getConfiguration().ROUTES.FORUMS;
const baseUrl = config.BASE;

const forumId = '58062e83-5052-4b8d-a174-317f8ffe6dc1';
const wrongForumId = 'wrong';

describe('Forum controller', () => {
    it('Get all forums', async () => {
        const response = await chai.request(app).get(baseUrl + config.GET_ALL_FORUMS);
        response.should.have.status(200);
        response.body.should.be.an('array');
        console.log(response.body);
    });

    it('Get forum by id', async () => {
        const response = await chai.request(app).get(baseUrl + config.GET_FORUM_BY_ID + forumId);
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.keys('id', 'name', 'description');
        console.log(response.body);
    });

    it('Get all posts by forum id', async () => {
        const response = await chai.request(app).get(baseUrl + config.GET_ALL_POSTS_BY_FORUM_ID + forumId);
        response.should.have.status(200);
        response.body.should.have.be.an('array');
        console.log(response.body);
    });

    it('Fail at getting forum with invalid id', async () => {
        const response = await chai.request(app).get(baseUrl + config.GET_FORUM_BY_ID + wrongForumId);
        response.should.have.status(404);
    });

    it('Fail at getting posts with invalid forum id', async () => {
        const response = await chai.request(app).get(baseUrl + config.GET_ALL_POSTS_BY_FORUM_ID + wrongForumId);
        response.should.have.status(400);
    });
});