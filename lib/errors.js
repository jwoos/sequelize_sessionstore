'use strict';

class SequelizeSessionStoreError extends Error {
	constructor(message) {
		super(message);

		this.name = 'SequelizeSessionStoreError';
	}
}

class ValidationError extends Error {
	constructor(message) {
		super(message);

		this.name = 'ValidationError';
	}
}

module.exports = {
	SequelizeSessionStoreError: SequelizeSessionStoreError,
	ValidationError: ValidationError
};
