type numFunc = (x:number) => void

interface config {
  batchSize?: number
  maxTime: number
  sleepTime: number
  asyncEntry?: numFunc
  asyncProgress?: numFunc
  asyncExit?: () => void
  then?: () => void

  progress?: {
    maxIter?: number
    remaining?: number
  }
}
/*
* Hello From Antimatter Dimensions.
* You can see these code in async-utils.js.*/
export const Async = {
  _enabled: true,
  get enabled() {
    return this._enabled
  },
  set enabled(value) {
    this._enabled = value
  },
  runForTime(fun: numFunc, maxIter:number, config:config) {
    const batchSize = config.batchSize || 1
    const maxTime = config.maxTime
    const startTime = Date.now()
    /*
    * Run the function until we've run for maxTime, or until we've run maxIter times.
    * */
    for (let remaining = maxIter; remaining > 0;) {
      for (let i = 0; i < Math.min(remaining, batchSize); i++) {
        fun(remaining)
        --remaining
      }
      if (Date.now() - startTime >= maxTime) return remaining
    }
    return 0

  },
  run(fun:numFunc, maxIter:number, config:config) {
    if (this.enabled) {
      // disable async because we cant start another at once.
      // that might cause some stupid things.
      this.enabled = false
      const runResult = this._run(fun, maxIter, config);
      if (config.then) {
        // Bypassing here because some linter has some stupid shits.
        const x = config.then, y = this
        return runResult.then(() => {
          x()
          y.enabled = true
        })
      } else {
        this.enabled = true
        return runResult
      }
    }
    for (let i = 0; i < maxIter; ++i) {
      fun(i)
    }
    if (config.then) config.then()
  },
  /**
   *  @private
   * */
  async _run(fun:numFunc, maxIter:number, config:config) {
    if (!config.progress) config.progress = {};
    // We need to use config.progress variables because something else could change them
    // (e.g. someone speeding up offline progress)
    config.progress.maxIter = maxIter;
    config.progress.remaining =
      this.runForTime(fun, config.progress.maxIter, config);
    const sleepTime = config.sleepTime || 1;
    if (!config.progress.remaining) return;
    if (config.asyncEntry)
      config.asyncEntry(config.progress.maxIter - config.progress.remaining);
    do {
      await this.sleepPromise(sleepTime);
      config.progress.remaining = this.runForTime(fun, config.progress.remaining, config);
      if (config.asyncProgress) config.asyncProgress(config.progress.maxIter - config.progress.remaining);
    } while (config.progress.remaining > 0);

    if (config.asyncExit)
      config.asyncExit();
  },
  sleepPromise: (ms:number) => new Promise(resolve => setTimeout(resolve, ms))
}