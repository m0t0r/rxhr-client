export abstract class Body {

  protected body: any;

  json(): Object {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }

    return this.body;
  }

  text(): string {
    if (!this.body) { return ''; }

    return this.body.toString();
  }

}