export class MemoryIPStore {
  private readonly windowMs: number;
  private readonly interval: NodeJS.Timer;
  private storage: { ip: string; count: number }[] = [];

  constructor(windowMs: number) {
    this.windowMs = windowMs;

    this.interval = setInterval(this.resetAll, this.windowMs);

    if (this.interval.unref) {
      this.interval.unref();
    }
  }

  increment(key: string): number {
    const index = this.storage.findIndex(({ ip }) => ip === key);

    if (index >= 0) {
      this.storage[index].count += 1;
      return this.storage[index].count;
    }

    this.storage.push({ ip: key, count: 1 });
    return 1;
  }

  resetAll() {
    this.storage = [];
  }
}
