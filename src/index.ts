import TransportStream, { TransportStreamOptions } from 'winston-transport';
import { stringify } from 'flatted';
import { platform } from 'os';

type Severity = "info" | "warn" | "error";
declare class EventLogClass {
  public readonly source: string;
  constructor(source: string);
  log(message: string, severity?: Severity, code?: number): Promise<boolean>;
}

interface EventLogTransportOptions extends TransportStreamOptions {
  source?: string;
}

class EventLogTransport extends TransportStream {
  private source: string;
  private logger: EventLogClass | null = null;

  constructor(options: EventLogTransportOptions = {}) {
    super(options);

    this.source = options.source || 'node';
    if (platform() === 'win32') {
      import('@matteogheza/node-eventlog').then((module) => {
        this.logger = new module.EventLog(this.source);
      }).catch((err) => {
        this.emit('error', err);
      });
    } else {
      this.logger = undefined;
    }
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
