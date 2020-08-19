export class Logger {
  constructor(level) {
    switch (level) {
      case 'info': {
        this.levelNum = 0;
        break;
      }
      case 'debug': {
        this.levelNum = 1;
        break;
      }
      case 'warning': {
        this.levelNum = 2;
        break;
      }
      default:
        break;
    }
  }
  info(msg) {
    this.levelNum >= 0 && console.log('INFO: ' + msg);
  }
  debug(msg) {
    this.levelNum >= 1 && console.log('DEBUG: ' + msg);
  }
  warning(msg) {
    this.levelNum >= 2 && console.log('WARNING: ' + msg);
  }
}
