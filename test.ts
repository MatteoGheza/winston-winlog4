import winston from 'winston';
import EventLogTransport from './src/index.ts';

const logger = winston.createLogger({
  transports: [
    new EventLogTransport({
      source: 'MyApplicationName', // Optional, defaults to 'node'
      level: 'info'                // Set the minimum level for this transport
    })
  ]
});

// Example logs
logger.info('Application started');
logger.warn('Potential issue detected');
logger.error('An error occurred');
