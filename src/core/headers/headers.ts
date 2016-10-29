
export class Headers {

  protected _headers: Map<string, string[]> = new Map();
  protected _normalizedNames: Map<string, string> = new Map();

  constructor(headers?: Headers|{[name: string]: any}) {
    if (!headers) { return; }

    if(headers instanceof Headers) {
      headers._headers.forEach((values: string[], name: string) => {
        values.forEach((value: string) => this.append(name, value));
      });

      return;
    }


    Object.keys(headers).forEach((name: string) => {
      const values: string[] = Array.isArray(headers[name]) ? headers[name] : [headers[name]];
      this.delete(name);

      values.forEach((value: string) => this.append(name, value));
    });
  }

  set(name: string, value: string|string[]): void {
    if(Array.isArray(value)) {
      if(value.length) {
        this._headers.set(name.toLowerCase(), [value.join(',')])
      }
    } else {
      this._headers.set(name.toLowerCase(), [value]);
    }
    this.setNormalizedName(name);
  }

  get(name: string): string|string[] {
    let values = this.getAll(name);
    if (values === null) {
      return null;
    }

    return values.length > 0 ? values[0] : null;
  }

  getAll(name: string): string[] {
    return this.has(name) ? this._headers.get(name.toLowerCase()) : null;
  }

  delete(name: string): void {
    name = name.toLowerCase();
    this._headers.delete(name);
    this._normalizedNames.delete(name);
  }

  append(name: string, value: string): void {
    let values = this.getAll(name);

    if(values === null) {
      this.set(name, value);
    } else {
      values.push(value);
    }
  }

  has(name: string): boolean {
    return this._headers.has(name.toLowerCase());
  }

  forEach(fn: (values: string[], name: string, headers: Map<string, string[]>) => void): void {
    this._headers.forEach((values, name) => fn(values, this._normalizedNames.get(name), this._headers));
  }

  toJSON(): {[name: string]: string[]} {
    let serializedHash: {[name: string]: string[]} = {};

    this._headers.forEach((values: string[], name: string) => {
      let splitValues: string[] = [];

      values.forEach((value: string) => {
        let values = value.split(',');
        splitValues.push(...values);
      });
      serializedHash[this._normalizedNames.get(name)] = splitValues;
    });

    return serializedHash;
  }

  keys(): string[] {
    return Array.from(this._normalizedNames.keys());
  }

  values(): string[][] {
    return Array.from(this._headers.values());
  }

  entries(): any {
    return this._headers.entries();
  }

  static fromResponseHeaderString(headersString: string): Headers {
    let headers = new Headers();

    headersString.split('\n').forEach((line: string) => {
      let index = line.indexOf(':');
      if (index > 0) {
        const name = line.slice(0, index);
        const value = line.slice(index + 1).trim();
        headers.set(name, value);
      }
    });

    return headers;
  }

  private setNormalizedName(name: string): void {
    let normalizedName = name.toLowerCase();

    if(!this._normalizedNames.has(normalizedName)) {
      this._normalizedNames.set(normalizedName, name);
    }
  }
}