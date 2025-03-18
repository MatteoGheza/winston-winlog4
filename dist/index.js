"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_transport_1 = __importDefault(require("winston-transport"));
const flatted_1 = require("flatted");
const os_1 = require("os");
class EventLogTransport extends winston_transport_1.default {
    constructor(options = {}) {
        super(options);
        this.logger = null;
        this.source = options.source || 'node';
        if ((0, os_1.platform)() === 'win32') {
            Promise.resolve().then(() => __importStar(require('node-eventlog'))).then((module) => {
                this.logger = new module.EventLog(this.source);
            }).catch((err) => {
                this.emit('error', err);
            });
        }
        else {
            this.logger = undefined;
        }
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
                message += ` metadata: ${(0, flatted_1.stringify)(meta, null, 2)}`;
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
