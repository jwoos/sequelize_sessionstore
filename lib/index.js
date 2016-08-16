'use strict';

const errors = require('./errors');

function storeManager(session) {
	class SequelizeSessionStore extends session.Store {
		constructor(config) {
			super();

			config = config || {};

			SequelizeSessionStore.validateConfig(config);

			this._sequelize = config.sequelize;
			this._model = config.model || this.createModel();
		}

		static validateConfig(config) {
			if (!('sequelize' in config)) {
				throw new errors.SequelizeSessionStoreError('Sequelize instance must be specified.');
			}

			// validate model
		}

		createModel() {}
	}

	return SequelizeSessionStore;
}

module.exports = storeManager;
