'use strict';

const path = require('path');

const SequelizeSessionStore = require(path.join(__dirname, '../../dist/index'));

describe('Class: SequelizeSessionStore', () => {
	let session;

	beforeEach(() => {
		session = {
			Store: function() {}
		};
	});

	describe('Method: constructor', () => {});

	describe('Method: validateConfig', () => {});

	describe('Method: createModel', () => {});

	describe('Method: all', () => {});

	describe('Method: destroy', () => {});

	describe('Method: clear', () => {});

	describe('Method: length', () => {});

	describe('Method: get', () => {});

	describe('Method: set', () => {});

	describe('Method: touch', () => {});

	describe('Method: cleanExpired', () => {});

	describe('Method: startCleanJob', () => {});

	describe('Method: stopCleanJob', () => {});
});
