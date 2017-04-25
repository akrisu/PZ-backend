let mongoose = require('mongoose');
let User = require('../models/user');
let bcrypt = require('bcrypt-nodejs');

/*
* POST /druseriver to register a new user.
*/
function createUser(req, res) {
    // Creates a new user from request
    var newUser = new User(req.body);

    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (foundUser) {
            return res.status(400).json({ message: 'User already exists'});
        }

        newUser.save((err, user) => {
            if (err) {
                return res.status(400).send(err);
            }

            return res.json({ message: 'User successfully created!', user });
        });
    });
}

function loginUser(req, res) {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (foundUser) {
            return res.status(200).json({ token: '' });
        }

        return res.status(400).send(err);

    });
}

module.exports = { createUser, loginUser };
