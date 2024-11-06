# winston-winlog4

`winston-winlog4` is a custom transport for [Winston](https://github.com/winstonjs/winston), designed to log messages to the Windows Event Log. It is a fork of [`winston-winlog2`](https://github.com/peteward44/winston-winlog2) and uses the `node-eventlog` library to write structured log data directly to the Windows Event Viewer. This transport is ideal for applications running on Windows where centralized, system-wide logging is beneficial.

## Installation

Install via npm:

```bash
npm install winston-winlog4
```

## Usage

To use `winston-winlog4`, import and add it to your Winston logger's transports.

```javascript
import winston from 'winston';
import EventLogTransport from 'winston-winlog4';

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
```

This will log messages to the Windows Event Log under the specified source name, with levels `info`, `warn`, or `error`.

## Options

The `EventLogTransport` class accepts the following options:

| Option       | Type     | Description                                               | Default |
|--------------|----------|-----------------------------------------------------------|---------|
| `source`     | `string` | The source name shown in the Event Viewer                 | `node`  |
| `level`      | `string` | The minimum level of messages to log (`info`, `warn`, `error`) | `info` |

## Features

- **Direct Windows Event Logging**: Logs are sent to the Windows Event Log, accessible in the Windows Event Viewer.
- **JSON Metadata Support**: Includes metadata with each log, formatted as a JSON string, for easier log analysis.
- **Supported Levels**: Only logs at `info`, `warn`, or `error` levels are supported to match typical Windows Event Viewer log levels.

## Handling Metadata

Metadata is supported in the `info` parameter of the `log` function, where it is converted to a JSON string using `flatted`. If metadata cannot be parsed, it falls back gracefully with an error message. Any newlines in the log messages are removed for compatibility with the Event Viewer.

## Development

To clone the repository and contribute:

```bash
git clone https://github.com/matteogheza/winston-winlog4
cd winston-winlog4
npm install
```

## License

This module is licensed under the MIT License. See the LICENSE file for details.
