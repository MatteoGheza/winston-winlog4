'use strict';

const { TransportStreamBase } = require('winston-transport');
const circularJson = require('circular-json');
const EventLogger = require('node-eventlog').EventLog;

class EventLogTransport extends TransportStreamBase {
    constructor(options) {
        super(options);

        options = options || {};
        this.name = 'eventlog';

        this.source = options.source || 'node';
        this.logger = new EventLogger(this.source);
    }

    async log(info, callback) {
        // If the transport is silent or logger is not initialized, skip logging
        if (this.silent || !this.logger) {
            return callback(null, true);
        }

        let { level, message, meta } = info;
        if (meta && Object.keys(meta).length > 0) {
            try {
                message += ` metadata: ${circularJson.stringify(meta, null, 2)}`;
            } catch (err) {
                message += ' metadata: [Could not parse]';
            }
        }

		// Level can be only info, warn, error
		if ( ['info', 'warn', 'error'].indexOf( level ) === -1 ) {
			level = 'info';
		}
        
        // Remove new lines since node-windows doesn't support them
        message = message.replace(/[\r\n]+/g, ' ');

        try {
            // Log the message according to its level
            await this.logger.log(message, level);
            this.emit('logged', info);
            callback(null, true);
        } catch (err) {
            callback(err, false);
        }
    }
}

module.exports = EventLogTransport;
