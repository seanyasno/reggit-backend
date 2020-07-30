import Config from "../../conf/config";
import chaiHttp from "chai-http";
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();

const config = Config.getInstance().getConfiguration().ROUTES.POSTING;

const userId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633694';
const forumId: string = '58062e83-5052-4b8d-a174-317f8ffe6dc1';
let postId: string = '';

describe('post controller', () => {
    it('Get all posts', done => {
        chai.request(app)
            .get(config.BASE + config.GET_ALL_POSTS)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.an('array');
                console.log(response.body);
                done();
            });
    });

    it('Create post', done => {
        chai.request(app)
            .post(config.BASE + config.CREATE)
            .set('content-type', 'application/json')
            .send({
                userId,
                forumId,
                content: 'This is a test post.'
            })
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.be.a('object');
                response.body.should.have.keys('id', 'userId', 'content', 'votes', 'forumId', 'user');
                postId = response.body.id;
                console.log(response.body);
                done();
            });
    });

    it('Remove post', done => {
        chai.request(app)
            .delete(config.BASE + config.DELETE_POST + postId)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.be.a('number');
                chai.expect(response.body).to.be.equals(1);
                console.log(response.body);
                done();
            });
    });

    it('Try create post with empty content', done => {
       chai.request(app)
           .post(config.BASE + config.CREATE)
           .set('content-type', 'application/json')
           .send({
               userId,
               forumId,
               content: ''
           })
           .end((error, response) => {
               response.should.have.status(400);
               response.body.should.have.be.an('object');
               chai.expect(response.body.errors.form).to.be.equals("Can't create a post with empty body");
               console.log(response.body);
               done();
           });
    });
});
