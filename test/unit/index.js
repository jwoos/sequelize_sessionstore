'use strict';

const path = require('path');

const bluebird = require('bluebird');

const SequelizeSessionStore = require(path.join(__dirname, '../../dist/index'));
const errors = require(path.join(__dirname, '../../dist/errors'));

describe('Class: SequelizeSessionStore', () => {
	let mockSession, store, instance;

	beforeEach(() => {
		mockSession = {
			Store: function() {}
		};

		store = SequelizeSessionStore(mockSession);
	});

	describe('Method: constructor', () => {
		let mockDeferred;

		beforeEach(() => {
			mockDeferred = bluebird.defer();

			spyOn(store, 'validateConfig');
			spyOn(store.prototype, 'createModel').and.returnValue(mockDeferred.promise);
			spyOn(store.prototype, 'startCleanJob');
		});

		it('should be an instance of session store', () => {
			expect(Object.getPrototypeOf(store)).toEqual(mockSession.Store);
		});

		it('should call validateConfig', () => {
			instance = new store();

			expect(store.validateConfig).toHaveBeenCalled();
		});

		it('should set options', (done) => {
			let options = {
				sequelize: () => {},
				model: {},
				extras: {
					col1: 'test',
					col2: 'more data'
				},
				expiration: {
					interval: 1000,
					life: 2500
				}
			};

			instance = new store(options);
			mockDeferred.resolve();

			mockDeferred.promise.then(() => {
				expect(instance._sequelize).toBe(options.sequelize);
				expect(instance._model).toBe(options.model);
				expect(instance._extras).toBe(options.extras);
				expect(instance._expirationInterval).toEqual(1000);
				expect(instance._sessionLife).toEqual(2500);
				done();
			});
		});

		it('should use defaults', () => {
			instance = new store();

			expect(instance._expirationInterval).toEqual(1000 * 60 * 60);
			expect(instance._sessionLife).toEqual(1000 * 60 * 60 * 24);
		});

		xit('should create a model if one is not given', (done) => {
			let mockModel = {};
			instance = new store();
			mockDeferred.resolve(mockModel);

			mockDeferred.promise.finally(() => {
				expect(store.prototype.createModel).toHaveBeenCalled();
				expect(instance._model).toBe(mockModel);
				done();
			});
		});

		xit('should call startCleanJob', (done) => {
			instance = new store();
			mockDeferred.resolve({});

			mockDeferred.promise.finally(() => {
				expect(store.prototype.startCleanJob).toHaveBeenCalled();
				done();
			});
		});

		it('should reject an error if model could not be created', (done) => {
			spyOn(errors, 'SequelizeSessionStoreError');
			instance = new store();
			mockDeferred.reject();

			mockDeferred.promise.finally(() => {
				expect(errors.SequelizeSessionStoreError).toHaveBeenCalledWith('Could not initialize a Session model');
				done();
			});
		});

		it('should not call startCleanJob if no interval', (done) => {
			instance = new store({
				expiration: {
					interval: 0
				}
			});
			mockDeferred.resolve();

			mockDeferred.promise.finally(() => {
				expect(store.prototype.startCleanJob).not.toHaveBeenCalled();
				done();
			});
		});
	});

	describe('Method: validateConfig', () => {
		let config, mockDeferred;

		beforeEach(() => {
			mockDeferred = bluebird.defer();
			config = {
				sequelize: {
					authenticate: () => {
						return mockDeferred.promise;
					}
				}
			};
			spyOn(config.sequelize, 'authenticate').and.callThrough();
		});

		it('should throw error if there is no sequelize', () => {
			expect(() => {
				store.validateConfig({});
			}).toThrowError(Error, 'Sequelize instance must be specified');
		});

		it('should authenticate', () => {
			mockDeferred.promise.finally(() => {

			});
		});

		it('should throw an error if unable to authenticate', (done) => {
			spyOn(errors, 'ValidationError');
			mockDeferred.reject('REJECTION');

			mockDeferred.promise.catch(() => {
				expect(errors.ValidationError).toHaveBeenCalledWith('Unable to connect to database: REJECTION');
				done();
			});
		});

		it('should throw error if any required fields are missing', () => {
			mockDeferred.promise.finally(() => {
			});
		});

		it('should throw error if wrong primary key', () => {
			mockDeferred.promise.finally(() => {
			});
		});

		it('should throw error if wrong type for expiration', () => {
			mockDeferred.promise.finally(() => {
			});
		});
	});

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
