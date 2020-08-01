import {replaceJsonVariable} from '../../utils';
import Config from '../../conf/config';
import IPost from '../../models/post';
import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();
const config = Config.getInstance().getConfiguration().ROUTES.POSTING;

const userId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633694';
const forumId: string = '58062e83-5052-4b8d-a174-317f8ffe6dc1';
let postId: string = '';

const invalidUserId: string = 'invalid';
const invalidPostId: string = 'invalid';
const invalidForumId: string = 'invalid';

const notExistedUserId: string = '39b14a61-73a3-4983-9ae2-7f4bbe633699';
const notExistedForumId: string = '58062e83-5052-4b8d-a174-317f8ffe6dcc';

const createPost = async (userId: string, forumId: string, content: string) => {
    return chai.request(app)
        .post(config.BASE + config.CREATE)
        .set('content-type', 'application/json')
        .send({userId, forumId, content});
}

const failedPostTest = async (messageError: string, userId: string, forumId: string, content: string) => {
    const response = await createPost(userId, forumId, content);
    console.log(response.body);
    response.should.have.status(400);
    response.body.should.have.be.an('object');
    chai.expect(response.body.errors.form).to.be.equals(messageError);
}

const votePost = async (userId: string, postId: string, voteState: string) => {
    let url = config.BASE + replaceJsonVariable(config.VOTE, 'postId', postId);
    url = replaceJsonVariable(url, 'voteState', voteState.toString());
    return chai.request(app)
        .put(url)
        .set('user_id', userId);
}

const failedVoteTest = async (messageError: string, userId: string, postId: string, voteState: string) => {
    const response = await votePost(userId, postId, voteState);
    console.log(response.body);
    response.should.have.status(400);
    response.body.should.have.be.an('object');
    response.body.errors.form.should.be.equals(messageError);
}

const successVoteTest = async (userId: string, postId: string, voteState: boolean, votesAmount: number) => {
    const response = await votePost(userId, postId, voteState.toString());
    console.log(response.body);
    response.should.have.status(200);
    response.body.should.have.be.an('object');
    response.body.should.have.keys('id', 'userId', 'content', 'votes', 'forumId');
    const post: IPost = response.body;
    chai.expect(post.votes).be.equals(votesAmount);
}

describe('Post controller', () => {
    it('Get all posts', async () => {
        const response = await chai.request(app).get(config.BASE + config.GET_ALL_POSTS);
        console.log(response.body);
        response.should.have.status(200);
        response.body.should.be.an('array');
    });

    describe('Create', () => {
        it('Create post', async () => {
            const response = await createPost(userId, forumId, 'This is a test post.');
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.have.be.a('object');
            response.body.should.have.keys('id', 'userId', 'content', 'votes', 'forumId', 'user');
            postId = response.body.id;
        });

        describe('Empty values', () => {
            it('Create post with empty content', async () => await failedPostTest("Can't create a post with empty body", userId, forumId, ''));

            it('Create post with empty user id', async () => await failedPostTest("Can't create a post with empty user id", '', forumId, 'This is a test post with user id.'));

            it('Create post with empty forum id', async () => await failedPostTest("Can't create a post with empty forum id", userId, '', 'This is a test post with forum id.'));
        });

        describe('Invalid values', () => {
            it('Create post with invalid user id', async () => await failedPostTest('SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"', invalidUserId, forumId, 'This is a test post with invalid user id.'));

            it('Create post with invalid forum id', async () => await failedPostTest('SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"', userId, invalidForumId, 'This is a test post with invalid forum id.'));
        });

        describe('Not existed values', () => {
            it('Create post with not existed user id', async () => await failedPostTest(`There is no user with id of ${notExistedUserId}`, notExistedUserId, forumId, 'This is a test post with not existed user id.'));

            it('Create post with not existed forum id', async () => await failedPostTest(`There is no forum with id of ${notExistedForumId}`, userId, notExistedForumId, 'This is a test post with not existed forum id.'));
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

        describe('Empty values', () => {
            it('Vote with empty user id', async () => {
                await failedVoteTest('User id is missing.', '', postId, 'true');
            });

            it('Vote with empty vote state', async () => {
                const response = await votePost(userId, postId, '');
                response.should.have.status(404);
            });

            it('Vote with empty post id', async () => {
                const response = await votePost(userId, '', 'true');
                response.should.have.status(404);
            });
        });

        describe('Invalid values', () => {
           it('Vote with invalid user id', async () => {
               await failedVoteTest('SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"', invalidUserId, postId, 'true');
           });

           it('Vote with invalid post id', async () => {
               await failedVoteTest('SequelizeDatabaseError: invalid input syntax for type uuid: "invalid"', userId, invalidPostId, 'true');
           });

           it('Vote with invalid vote state', async () => {
               await failedVoteTest('Vote state is at bad format.', userId, postId, 'invalid');
           });
        });
    });

    describe('Delete', () => {
        it('Remove post', async () => {
            const response = await chai.request(app).delete(config.BASE + config.DELETE_POST + postId);
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.have.be.a('number');
            chai.expect(response.body).to.be.equals(1);
        });
    });
});
