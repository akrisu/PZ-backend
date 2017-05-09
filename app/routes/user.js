const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

/*
* POST /user/register to register a new user.
*/
function createUser(req, res) {
    // Creates a new user from request
    var newUser = new User(req.body);
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (foundUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ message: 'Error occured' });
            }

            bcrypt.hash(req.body.password, salt, null, (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: 'Error occured' });
                }

                newUser.salt = salt;
                newUser.password = hash;
                newUser.role = 'driver';
            });
        });


        newUser.save((err, user) => {
            if (err) {
                return res.status(400).send(err);
            }

            return res.json({ message: 'User successfully created!' });
        });
    });
}

/*
* POST /user/login to login as a user
*/
function loginUser(req, res) {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (!foundUser || err) {
            return res.status(400).json({ message: 'User doesnt exists' });
        }

        bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
            if (err || result === false) {
                return res.status(400).json({ message: 'Provided data is incorrect' });
            }

            const payload = {
                username: foundUser.username,
                role: foundUser.role
            };

            const token = jwt.sign(payload, SECRET_KEY, {});

            return res.status(200).json({ token: token });
        });
    });
}

module.exports = { createUser, loginUser };
