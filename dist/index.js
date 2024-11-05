"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_transport_1 = __importDefault(require("winston-transport"));
const circular_json_1 = __importDefault(require("circular-json"));
const node_eventlog_1 = require("node-eventlog");
class EventLogTransport extends winston_transport_1.default {
    constructor(options = {}) {
        super(options);
        this.source = options.source || 'node';
        this.logger = new node_eventlog_1.EventLog(this.source);
    }
    emit(event, ...args) {
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
                message += ` metadata: ${circular_json_1.default.stringify(meta, null, 2)}`;
            }
            catch {
                message += ' metadata: [Could not parse]';
            }
        }
        if (level === 'warning')
            level = 'warn';
        if (!['info', 'warn', 'error'].includes(level)) {
            // Return silently, as we only support info, warn, and error
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
exports.default = EventLogTransport;
