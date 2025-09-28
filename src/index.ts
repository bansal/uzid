export interface UzidOptions {
  /** Prefix for identification, default "" */
  prefix?: string;
  /** Base for encoding (36 for alphanumeric, 62 for alphanumeric with uppercase), default 36 */
  base?: 36 | 62;
  /** Length of random suffix, default 4 */
  length?: number;
  /** Precision of timestamp, "s" for seconds or "ms" for milliseconds, default "s" */
  precision?: "ms"; // Currently not exposed in constructor options
}

export class Uzid {
  private readonly prefix: string;
  private readonly base: 36 | 62;
  private readonly length: number;
  private readonly chars: string = "0123456789abcdefghijklmnopqrstuvwxyz";
  private readonly precision?: string;

  constructor(options: UzidOptions = {}) {
    this.prefix = options.prefix || "";
    this.base = options.base || 36;
    this.length = options.length ?? 4;

    if (options.precision && options.precision !== "ms") {
      throw new Error('Precision must be "ms" if specified');
    }
    this.precision = options.precision;

    if (this.base !== 36 && this.base !== 62) {
      throw new Error("Base must be either 36 or 62");
    }

    if (
      typeof this.length !== "number" ||
      !Number.isInteger(this.length) ||
      this.length < 0 ||
      this.length > 20
    ) {
      throw new Error("Length must be a non-negative integer between 0 and 20");
    }

    this.chars += this.base === 62 ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
  }

  private toBaseString(num: number, base: 36 | 62): string {
    if (base === 36) return num.toString(36);
    if (num === 0) return "0";

    let out = "";
    let n = num;

    while (n > 0) {
      out = this.chars[n % base] + out;
      n = Math.floor(n / base);
    }
    return out;
  }

  private fromBaseString(str: string, base: 36 | 62): number {
    if (base === 36) return parseInt(str, 36);
    let out = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const value = this.chars.indexOf(char);
      if (value === -1) {
        throw new Error(`Invalid character '${char}' for base ${base}`);
      }
      out = out * base + value;
    }
    return out;
  }

  single(): string {
    const ts = Math.floor(Date.now() / (this.precision === "ms" ? 1 : 1000));
    return this.prefix + this.toBaseString(ts, this.base) + this.random();
  }

  generate(): string;
  generate(count: number): string[];
  generate(count?: number): string | string[] {
    return count === undefined ? this.single() : this.multiple(count);
  }

  verify(id: string): boolean {
    if (
      typeof id !== "string" ||
      id.length === 0 ||
      !id.startsWith(this.prefix)
    )
      return false;

    const withoutPrefix = id.slice(this.prefix.length);
    if (withoutPrefix.length === 0) return false;

    for (let i = 0; i < withoutPrefix.length; i++) {
      if (!this.chars.includes(withoutPrefix[i])) return false;
    }

    const randomPart =
      this.length === 0 ? "" : withoutPrefix.slice(-this.length);
    if (randomPart.length !== this.length) return false;

    const timestampPart =
      this.length === 0 ? withoutPrefix : withoutPrefix.slice(0, -this.length);

    try {
      return !isNaN(
        new Date(
          this.fromBaseString(timestampPart, this.base) *
            (this.precision === "ms" ? 1 : 1000)
        ).getTime()
      );
    } catch {
      return false;
    }
  }

  random(): string {
    let s = "";
    for (let i = 0; i < this.length; i++) {
      s += this.chars[Math.floor(Math.random() * this.chars.length)];
    }
    return s;
  }

  multiple(count: number): string[] {
    if (!Number.isInteger(count) || count < 2) {
      throw new Error("Count must be a positive integer greater than 1");
    }
    const ids = new Set<string>();
    while (ids.size < count) {
      ids.add(this.single());
    }
    return Array.from(ids).sort();
  }
}
