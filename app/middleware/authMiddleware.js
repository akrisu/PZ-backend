var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('./../models/user');
var app = express();

module.exports.verifyUser = function(req, res, next) {
    var authorizationHeader = req.headers['authorization'] || '';

    if (authorizationHeader.indexOf('Bearer ') > -1) {
        var token = authorizationHeader.split(' ')[1];
    } else {
      var token = authorizationHeader.split(' ')[0];
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, function(err, decode) {
            if (err) {
                return res.status(401).send('Invalid token');
            }

            User.findOne({ username: decode.username }, function(err, user) {
                if (err) {
                    return res.status(401).send('Unauthorized');
                }
                res.userId = user.id;
                res.role = user.role;

                next();
            });
        });
    } else {
        return res.status(403).send('Please send a token');
    }
}

module.exports.verifyAdmin = function(req, res, next) {
    if (res.role !== 'admin') {
        return res.status(401).send('Unauthorized');
    }

    next();
}

