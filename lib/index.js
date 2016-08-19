'use strict';

const path = require('path');

const errors = require('./errors');

function storeManager(session) {
	class SequelizeSessionStore extends session.Store {
		constructor(config) {
			super();

			config = config || {};

			SequelizeSessionStore.validateConfig(config);

			this._sequelize = config.sequelize;

			if (config.model) {
				this._model = config.model;
			} else {
				this.createModel().then((Session) => {
					this._model = Session;
				});
			}

			this._extras = config.extras;
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
						throw new errors.ValidationError('Expected sid for primary key field but got ${config.model.primaryKeyField}');
					}
				}
			}).catch((err) => {
				throw new errors.ValidationError(`Unable to connect to database: ${err}`);
			});

			if (typeof config.extras !== 'function') {
				throw new errors.ValidationError(`Expected field extras to be type function but got type ${typeof config.extras}`);
			}
		}

		createModel() {
			let Session = this._sequelize.import(path.join(__dirname, './model.js'));

			Session.sync().then(() => {
				return Session;
			}).catch((err) => {
				throw new errors.DatabaseError(`Could not create default table: ${err}`);
			});
		}

		all(cb) {
			this._model.findAll().then((sessions) => {
				cb(null, sessions);
			}, (err) => {
				cb(err, null);
			});
		}

		destroy(sid, cb) {
			this._model.destroy({
				where: {
					sid: sid
				}
			}).then(() => {
				cb(null);
			}, (err) => {
				cb(err);
			});
		}

		clear(cb) {
			this._model.destroy().then(() => {
				cb(null);
			}, (err) => {
				cb(err);
			});
		}

		length(cb) {
			this._model.count().then((count) => {
				cb(null, count);
			}, (err) => {
				cb(err, null);
			});
		}

		get(sid, cb) {
			this._model.findOne({
				where: {
					sid: sid
				}
			}).then((session) => {
				cb(null, session);
			}, (err) => {
				cb(err, null);
			});
		}

		set(sid, session, cb) {
			let missing = [];

			let values = {
				sid: sid,
				session: session,
				expire: session.cookie.expire
			};

			let extended = {};
			this._extras(extended);

			for (let col in this._model.rawAttributes) {
				if (col in values) {
					continue;
				}

				if (!(col in extended)) {
					missing.push(col);
				}
			}

			if (missing.length) {
				throw new errors.SequelizeSessionStoreError(`The following fields were specified in the model but are missing from the extras field: ${missing.join(', ')}`);
			}

			this._model.upsert(Object.assign({}, extended, values)).then(() => {
				cb(null);
			}, (err) => {
				cb(err);
			});
		}

		touch(sid, session, cb) {

		}
	}

	return SequelizeSessionStore;
}

module.exports = storeManager;
