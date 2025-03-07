export class EventEmitter{
  private callbacks: Record<string, CallableFunction[]> = {}

  constructor() {
    this.callbacks = {}
  }

  public on(event: string, cb: CallableFunction) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(cb)
  }

  public emit(event: string, data?: unknown) {
    let cbs = this.callbacks[event]
    if (cbs) {
      cbs.forEach(cb => cb(data))
    }
  }
}
