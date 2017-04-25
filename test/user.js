process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('../app/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
		User.remove({}, (err) => {
		   done();
		});
	});

    describe('/POST user/register', () => {
        it('it should successfully create a new user', (done) => {
            let user = {
                username: 'Login',
                password: 'password'
            };

            chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully created!');
                done();
            });
        });

        it('it should throw an error if provided field is incorrect', (done) => {
            let user = {
                username: 'Login',
                passworda: 'password'
            };

            chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
        });

        it('it should throw an error if user already exists', (done) => {
            let user = new User({ username: 'login', password: 'password' });

            user.save((err, user) => {
                chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User already exists');
                    done();
                });
            });
        });
    });

    describe('/POST user/login', () => {
        it('should return a token if provided data is correct', (done) => {
            let user = new User({ username: 'login', password: 'password' });

            user.save((err, user) => {
                chai.request(server)
                .post('/user/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                })
            });
        });

        it('should return an error if user doesnt exist', (done) => {
            let user = {
                username: 'test',
                password: 'test'
            };

            chai.request(server)
            .post('/user/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User doesnt exists');
                done();
            });
        })
    });
});
