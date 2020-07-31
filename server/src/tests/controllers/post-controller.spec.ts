import Config from '../../conf/config';
import chaiHttp from 'chai-http';
import {request} from 'express';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();

const config = Config.getInstance().getConfiguration().ROUTES.POSTING;

const userId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633694';
const forumId: string = '58062e83-5052-4b8d-a174-317f8ffe6dc1';
let postId: string = '';

const invalidUserId: string = 'invalid';
const invalidForumId: string = 'invalid';

const notExistedUserId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633699';
const notExistedForumId: string = '58062e83-5052-4b8d-a174-317f8ffe6dcc';

//@ts-ignore
const createPost = (userId: string, forumId: string, content: string): request.SuperAgentRequest => {
    return chai.request(app)
        .post(config.BASE + config.CREATE)
        .set('content-type', 'application/json')
        .send({userId, forumId, content});
}

const failedTest = (response: any, messageError: string) => {
    console.log(response.body);
    response.should.have.status(400);
    response.body.should.have.be.an('object');
    chai.expect(response.body.errors.form).to.be.equals(messageError);
}

describe('post controller', () => {
    it('Get all posts', done => {
        chai.request(app)
            .get(config.BASE + config.GET_ALL_POSTS)
            .end((error, response) => {
                console.log(response.body);
                response.should.have.status(200);
                response.body.should.be.an('array');
                done();
            });
    });

    it('Create post', done => {
        createPost(userId, forumId, 'This is a test post.').end((error: any, response: any) => {
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.have.be.a('object');
            response.body.should.have.keys('id', 'userId', 'content', 'votes', 'forumId', 'user');
            postId = response.body.id;
            done();
        });
    });

    it('Remove post', done => {
        chai.request(app)
            .delete(config.BASE + config.DELETE_POST + postId)
            .end((error, response) => {
                console.log(response.body);
                response.should.have.status(200);
                response.body.should.have.be.a('number');
                chai.expect(response.body).to.be.equals(1);
                done();
            });
    });

    it('Try create post with empty content', done => {
        createPost(userId, forumId, '').end((error: any, response: any) => {
            failedTest(response, "Can't create a post with empty body");
            done();
        });
    });

    it('Try create post with empty user id', done => {
        createPost('', forumId, 'This is a test post with user id.').end((error: any, response: any) => {
            failedTest(response, "Can't create a post with empty user id");
            done();
        })
    });

    it('Try create post with empty forum id', done => {
        createPost(userId, '', 'This is a test post with forum id.').end((error: any, response: any) => {
            failedTest(response, "Can't create a post with empty forum id");
            done();
        })
    });

    it('Try create post with invalid user id', done => {
        createPost(invalidUserId, forumId, 'This is a test post with invalid user id.').end((error: any, response: any) => {
            failedTest(response, 'SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"');
            done();
        });
    });

    it('Try create post with invalid forum id', done => {
        createPost(userId, invalidForumId, 'This is a test post with invalid forum id.').end((error: any, response: any) => {
            failedTest(response, 'SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"');
            done();
        });
    });

    it('Try create post with not existed user id', done => {
        createPost(notExistedUserId, forumId, 'This is a test post with not existed user id.').end((error: any, response: any) => {
            failedTest(response, `There is no user with id of ${notExistedUserId}`);
            done();
        });
    });

    it('Try create post with not existed forum id', done => {
        createPost(userId, notExistedForumId, 'This is a test post with not existed forum id.').end((error: any, response: any) => {
            failedTest(response, `There is no forum with id of ${notExistedForumId}`);
            done();
        });
    });
});
