function calculateNextResetTime(windowMs: number): Date {
  const d = new Date();
  d.setMilliseconds(d.getMilliseconds() + windowMs);
  return d;
}

interface KeyStore {
  ip: string;
  count: number;
}

class MemoryIPStore {
  windowMs: number;

  storage: KeyStore[];

  resetTime: Date;

  interval: any;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
    this.storage = [];
    this.resetTime = calculateNextResetTime(this.windowMs);

    this.interval = setInterval(this.resetAll, this.windowMs);

    if (this.interval.unref) {
      this.interval.unref();
    }
  }

  incr = (key: string, cb: Function) => {
    const indexExists = this.storage.findIndex((item) => item.ip === key);

    if (indexExists >= 0) {
      this.storage[indexExists].count += 1;
    } else {
      this.storage.push({
        ip: key,
        count: 1,
      });
    }

    cb(
      this.storage[indexExists]?.count || 1,
      this.resetTime,
    );
  }

  decrement = (key: string) => {
    const indexExists = this.storage.findIndex((item) => item.ip === key);

    if (indexExists >= 0) {
      this.storage[indexExists].count -= 1;
    }
  }

  resetAll = () => {
    this.storage = [];
    this.resetTime = calculateNextResetTime(this.windowMs);
  }

  resetKey = (key: string) => {
    const indexExists = this.storage.findIndex((item) => item.ip === key);

    if (indexExists >= 0) {
      this.storage.splice(indexExists, 1);
    }
  }
}

export default MemoryIPStore;
