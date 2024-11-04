# winston-winlog4

Windows Event Log logger for the node.js Winston module.

Exactly like the original winston-winlog, however uses Distributive-Network/node-eventlog instead of coreybutler/node-windows so no admin permissions are required.

Fork of https://github.com/peteward44/winston-winlog2

## Installation

    $ npm install winston-winlog4
    $ npm install winston


## Usage

Configure :

```js
  var winston = require('winston'),
      winlog = require("winston-winlog4");

  winston.add(winlog, { source: 'myapp' });
```

Then you can do:

```bash
  winston.info("this is an info message");
  winston.warning("this is an warning message");
  winston.error("this is an error message");
```


## How it works

This transport uses the module [node-windows](https://github.com/coreybutler/node-windows) to log events. 

The transport will do nothing (*doesn't throw!*) if you run it on a platform other than win32.
