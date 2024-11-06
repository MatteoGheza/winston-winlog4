import TransportStream, { TransportStreamOptions } from 'winston-transport';
import { stringify } from 'flatted';
import { EventLog, Severity } from 'node-eventlog';

interface EventLogTransportOptions extends TransportStreamOptions {
  source?: string;
}

class EventLogTransport extends TransportStream {
  private source: string;
  private logger: EventLog;

  constructor(options: EventLogTransportOptions = {}) {
    super(options);

    this.source = options.source || 'node';
    this.logger = new EventLog(this.source);
  }

  emit(event: string, ...args: unknown[]): boolean {
    return super.emit(event, ...args);
  }

  log(info: { level: string, message: string, meta: string }, callback: (err?: Error) => void): void {
    if (this.silent || !this.logger) {
      return callback();
    }

    let { level, message } = info;
    const meta = info.meta || {};
    if (meta && Object.keys(meta).length > 0) {
      try {
        message += ` metadata: ${stringify(meta, null, 2)}`;
      } catch {
        message += ' metadata: [Could not parse]';
      }
    }

    if (level === 'warning') level = 'warn';

    if (!['info', 'warn', 'error'].includes(level)) {
      // Return silently, as we only support info, warn, and error
      return callback();
    }

    message = message.replace(/[\r\n]+/g, ' ');

    this.logger.log(message, level as Severity)
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
