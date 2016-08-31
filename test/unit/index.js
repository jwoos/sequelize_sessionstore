'use strict';

const path = require('path');

const bluebird = require('bluebird');

const SequelizeSessionStore = require(path.join(__dirname, '../../dist/index'));

describe('Class: SequelizeSessionStore', () => {
	let mockSession, store, instance;

	beforeAll(() => {
		// this handler is local meaning that it must be defined here
		bluebird.onPossiblyUnhandledRejection((err) => {
			throw err;
		});
	});

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

		it('should set bluebird unhandled rejection option', () => {
			spyOn(bluebird, 'onPossiblyUnhandledRejection').and.callThrough();
			instance = new store();

			expect(bluebird.onPossiblyUnhandledRejection).toHaveBeenCalled();
		});

		it('should call validateConfig', () => {
			instance = new store();

			expect(store.validateConfig).toHaveBeenCalled();
		});

		it('should set options', () => {
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

			expect(instance._sequelize).toBe(options.sequelize);
			expect(instance._model).toBe(options.model);
			expect(instance._extras).toBe(options.extras);
			expect(instance._expirationInterval).toEqual(1000);
			expect(instance._sessionLife).toEqual(2500);
		});

		it('should use defaults', () => {
			instance = new store();

			expect(instance._expirationInterval).toEqual(1000 * 60 * 60);
			expect(instance._sessionLife).toEqual(1000 * 60 * 60 * 24);
		});

		it('should create a model if one is not given', () => {
			let mockModel = {};
			instance = new store();
			mockDeferred.resolve(mockModel);

			mockDeferred.promise.then(() => {
				expect(store.prototype.createModel).toHaveBeenCalled();
				expect(instance._model).toBe(mockModel);
			});
		});

		// TODO figure out why it's not throwing error outright
		xit('should throw an error if model could not be created', () => {
			instance = new store();
			mockDeferred.reject();
		});

		it('should call startCleanJob', () => {
			instance = new store();

			expect(store.prototype.startCleanJob).toHaveBeenCalled();
		});

		it('should not call startCleanJob if no interval', () => {
			instance = new store({
				expiration: {
					interval: 0
				}
			});

			expect(store.prototype.startCleanJob).not.toHaveBeenCalled();
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
			mockDeferred.promise.then(() => {

			});
		});

		it('should throw error if any required fields are missing', () => {
			mockDeferred.promise.then(() => {
			});
		});

		it('should throw error if wrong primary key', () => {
			mockDeferred.promise.then(() => {
			});
		});

		it('should throw error if wrong type for expiration', () => {
			mockDeferred.promise.then(() => {
			});
		});

		xit('should throw an error if unable to authenticate', () => {});
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
