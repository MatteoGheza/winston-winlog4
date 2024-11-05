import TransportStream, { TransportStreamOptions } from 'winston-transport';
interface EventLogTransportOptions extends TransportStreamOptions {
    source?: string;
}
declare class EventLogTransport extends TransportStream {
    private source;
    private logger;
    constructor(options?: EventLogTransportOptions);
    emit(event: string, ...args: unknown[]): boolean;
    log(info: {
        level: string;
        message: string;
        meta: string;
    }, callback: (err?: Error) => void): void;
}
export default EventLogTransport;
