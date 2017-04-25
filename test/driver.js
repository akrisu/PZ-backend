process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Driver = require('../app/models/driver');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Drivers', () => {
    beforeEach((done) => {
		Driver.remove({}, (err) => {
            done();
		});
	});

    describe('/POST driver', () => {
        it('it should POST a new driver', (done) => {
            let driver = {
                firstName: 'Jan',
                secondName: 'Kowalski',
                workerId: 1,
                phone: '660123123',
                workStartDate: new Date()
            }

            chai.request(server)
            .post('/driver')
            .send(driver)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Driver successfully created!');
                done();
            });
        });

        it('it should throw an error if provided data is incorrect', (done) => {
            let driver = {
                firstName: 'Jan',
                lastName: 'Kowalski',
                workerId: 1,
                phone: '660123123',
                workStartDate: new Date()
            }

            chai.request(server)
            .post('/driver')
            .send(driver)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
        });
    });
});
