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
				throw new errors.ValidationError('Sequelize instance must be specified.');
			}

			config.sequelize.authenticate().then(() => {
				if ('model' in config) {
					const required = ['sid', 'sess', 'expire'];

					let missing = [];

					for (let req of required) {
						if (!(req in config.model)) {
							missing.push(req);
						}
					}

					if (missing.length) {
						throw new errors.ValidationError('The following required columns are missing: ${missing.join(', ')}');
					}

					if (config.model.primaryKeyField !== 'sid') {
						throw new errors.ValidationError('Expected sid for primary key field but got ${config.model.primaryKeyField}')l
					}
				}
			}).catch((err) => {
				throw new errors.ValidationError(`Unable to connect to database: ${err}`);
			});

		}

		createModel() {}

		all(cb) {}

		destroy(sid, cb) {}

		clear(cb) {}

		length(cb) {}

		get(sid, cb) {}

		set(sid, session, cb) {}

		touch(sid, session, cb) {}
	}

	return SequelizeSessionStore;
}

module.exports = storeManager;
