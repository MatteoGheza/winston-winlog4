/*jslint node: true */
'use strict';

var util = require('util');
var circularJson = require('circular-json');
var Transport = require('winston').Transport;

var EventLogger;
try {
	var nodeEventLog = require('node-eventlog');
	EventLogger = nodeEventLog.EventLog;
}
catch ( err ) {
}


var EventLog = function (options) {
	Transport.call(this, options);
	options = options || {};

	this.name = 'eventlog';

	if ( EventLogger ) {
		var source = options.source || "node";
		this.logger = new EventLogger(source);
	}
};

util.inherits(EventLog, Transport);


EventLog.prototype.log = async function (level, msg, meta, callback) {
	if (this.silent || !this.logger) {
		return callback(null, true);
	}
	var message = msg;
	if (meta && Object.keys(meta).length > 0) {
		try {
			message += " metadata: " + circularJson.stringify(meta, null, 2);
		} catch (err) {
			message += " metadata: [Could not parse]";
		}
	}
	// new lines not supported by node-windows as it passes message on the command line through child_process.exec: Remove them
	message = message.replace(/[\r\n]+/g, ' ');

	try {
		switch (level) {
			default:
			case "info":
				await this.logger.log(message, "info");
				break;
			case "warn":
				await this.logger.log(message, "warn");
				break;
			case "error":
				await this.logger.log(message, "error");
				break;
		}
		this.emit('logged');
		callback(null, true);
	} catch (err) {
		callback(err, false);
	}
};

module.exports = EventLog;

