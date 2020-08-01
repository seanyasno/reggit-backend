import {replaceJsonVariable} from '../../utils';
import Config from '../../conf/config';
import IPost from '../../models/post';
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

const failedPostTest = (done: Mocha.Done, messageError: string, userId: string, forumId: string, content: string) => {
    createPost(userId, forumId, content).end((error: any, response: any) => {
        console.log(response.body);
        response.should.have.status(400);
        response.body.should.have.be.an('object');
        chai.expect(response.body.errors.form).to.be.equals(messageError);
        done();
    });
}

const votePost = async (userId: string, postId: string, voteState: boolean) => {
    let url = config.BASE + replaceJsonVariable(config.VOTE, 'postId', postId);
    url = replaceJsonVariable(url, 'voteState', voteState.toString());
    return chai.request(app)
        .put(url)
        .set('user_id', userId);
}

const successVoteTest = async (userId: string, postId: string, voteState: boolean, votesAmount: number) => {
    const response = await votePost(userId, postId, voteState);
    console.log(response.body);
    response.should.have.status(200);
    response.body.should.have.be.an('object');
    response.body.should.have.keys('id', 'userId', 'content', 'votes', 'forumId');
    const post: IPost = response.body;
    chai.expect(post.votes).be.equals(votesAmount);
}

describe('Post controller', () => {
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

    describe('Create', () => {
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

        describe('Empty values', () => {
            it('Create post with empty content', done => failedPostTest(done, "Can't create a post with empty body", userId, forumId, ''));

            it('Create post with empty user id', done => failedPostTest(done, "Can't create a post with empty user id", '', forumId, 'This is a test post with user id.'));

            it('Create post with empty forum id', done => failedPostTest(done, "Can't create a post with empty forum id", userId, '', 'This is a test post with forum id.'));
        });

        describe('Invalid values', () => {
            it('Create post with invalid user id', done => failedPostTest(done, 'SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"', invalidUserId, forumId, 'This is a test post with invalid user id.'));

            it('Create post with invalid forum id', done => failedPostTest(done, 'SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"', userId, invalidForumId, 'This is a test post with invalid forum id.'));
        });

        describe('Not existed values', () => {
            it('Create post with not existed user id', done => failedPostTest(done, `There is no user with id of ${notExistedUserId}`, notExistedUserId, forumId, 'This is a test post with not existed user id.'));

            it('Create post with not existed forum id', done => failedPostTest(done, `There is no forum with id of ${notExistedForumId}`, userId, notExistedForumId, 'This is a test post with not existed forum id.'));
        });
    });

    describe('Voting', () => {
        it('Upvote post and cancel', async () => {
            await successVoteTest(userId, postId, true, 1);
            await successVoteTest(userId, postId, true, 0);
        });

        it('Downvote post and cancel', async () => {
            await successVoteTest(userId, postId, false, -1);
            await successVoteTest(userId, postId, false, 0);
        });

        it('Upvote, downvote and upvote', async () => {
            await successVoteTest(userId, postId, true, 1);
            await successVoteTest(userId, postId, false, -1);
            await successVoteTest(userId, postId, true, 1);
        });
    });

    describe('Delete', () => {
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
    });
});
