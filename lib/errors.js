'use strict';

class SequelizeSessionStoreError extends Error {
	constructor(message) {
		super(message);

		this.name = 'SequelizeSessionStoreError';
	}
}

module.exports = {
	SequelizeSessionStoreError: SequelizeSessionStoreError
};
