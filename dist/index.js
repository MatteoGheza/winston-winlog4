import TransportStream from 'winston-transport';
import circularJson from 'circular-json';
import { EventLog } from 'node-eventlog';
class EventLogTransport extends TransportStream {
    constructor(options = {}) {
        super(options);
        this.source = options.source || 'node';
        this.logger = new EventLog(this.source);
    }
    emit(event, ...args) {
        // @ts-expect-error - emit method is not defined on TransportStream class
        return super.emit(event, ...args);
    }
    log(info, callback) {
        if (this.silent || !this.logger) {
            return callback();
        }
        let { level, message } = info;
        const meta = info.meta || {};
        if (meta && Object.keys(meta).length > 0) {
            try {
                message += ` metadata: ${circularJson.stringify(meta, null, 2)}`;
            }
            catch {
                message += ' metadata: [Could not parse]';
            }
        }
        if (level === 'warning')
            level = 'warn';
        if (!['info', 'warn', 'error'].includes(level)) {
            this.emit('error', new Error(`Unknown log level: ${level}`));
            return callback();
        }
        message = message.replace(/[\r\n]+/g, ' ');
        this.logger.log(message, level)
            .then(() => {
            this.emit('logged', info);
            callback();
        })
            .catch((err) => {
            this.emit('error', err);
            callback(err);
        });
    }
}
export default EventLogTransport;
