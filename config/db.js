var	Db = require('mongodb').Db,
	Server = require('mongodb').Server,
	Connection = require('mongodb').Connection,
	opts = require('./options'),
	options = {};

module.exports = new Db(opts.db.name, new Server(opts.db.host, opts.db.port ||
		Connection.DEFAULT_PORT, options), {safe: true});
