export class Logger {
  log(level: string, ...elements: any[]) {
    let s = ' '
    if (elements.length && typeof elements[0] === 'string') {
      // special case for the first arg, which is probably a string
      s += elements.shift()
    }
    console.log(`${new Date().toISOString()} ${level}${s}`, elements)
  }
  debug(...elements: any[]) {
    this.log('DEBUG', ...elements)
  }
  info(...elements: any[]) {
    this.log('INFO', ...elements)
  }
  warn(...elements: any[]) {
    this.log('WARN', ...elements)
  }
  error(...elements: any[]) {
    this.log('ERROR', ...elements)
    console.trace()
  }
}