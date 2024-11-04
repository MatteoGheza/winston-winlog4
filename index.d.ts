declare module 'winston-winlog4' {
    import { TransportStreamOptions } from 'winston-transport';

    interface Winlog4Options extends TransportStreamOptions {
        source?: string;
    }

    export class Winlog4Transport {
        constructor(options?: Winlog4Options);
        log(info: any, callback?: (error?: Error | null) => void): Promise<void>;
    }
}
