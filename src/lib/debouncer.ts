export class Debouncer {
  private _timer?: NodeJS.Timeout | null = null;

  constructor(
    private readonly fun: Function,
    private readonly delay: number
  ) {}

  private _run() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(async () => {
      this._clearTimer();
      await this.fun();
    }, this.delay);
  }

  private _clearTimer() {
    clearTimeout(this._timer!);
    this._timer = null;
  }

  call() {
    this._run();
  }
}
