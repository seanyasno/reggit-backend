import chaiHttp from 'chai-http';
import app from '../../app';
import chai from 'chai';

chai.use(chaiHttp);
chai.should();

describe('forum controller', () => {
   it('should return all forums', (done) => {
      chai.request(app)
          .get('/api/forum/getAllForums')
          .end((error, response) => {
             response.should.have.status(200);
             response.body.should.be.an('array');
             done();
          });
   });
});