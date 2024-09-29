////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

class CustomizedAppender {
  constructor() {
    this.logs = [];
  }

  trace(...args) {
    this.logs.push({ type: 'TRACE', args });
    console.trace(...args);
  }

  debug(...args) {
    this.logs.push({ type: 'DEBUG', args });
    console.debug(...args);
  }

  info(...args) {
    this.logs.push({ type: 'INFO', args });
    console.info(...args);
  }

  warn(...args) {
    this.logs.push({ type: 'WARN', args });
    console.warn(...args);
  }

  error(...args) {
    this.logs.push({ type: 'ERROR', args });
    console.error(...args);
  }

  clear() {
    this.logs = [];
  }
}

export default CustomizedAppender;
