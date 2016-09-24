'use strict';

const path = require('path');

const bluebird = require('bluebird');
const session = require('express-session');

const SequelizeSessionStore = require(path.join(__dirname, '../../dist/index'))(session.Store);
const errors = require(path.join(__dirname, '../../dist/errors'));

describe('Sequelize Session Store', () => {});
