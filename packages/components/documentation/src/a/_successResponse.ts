/**
 * Base class for handling successful HTTP responses with debugging capabilities.
 * Provides logging functionality to track response and their context.
 */
class SuccessResponse {
  private _body: any = null;
  private _name: string = "SuccessResponse";
  private _status: number = 200;
  private _statusText: string = "OK";

  get body(): any {
    return this._body;
  }

  set body(value: any) {
    this._body = value ?? null;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  get statusText(): string {
    return this._statusText;
  }

  set statusText(value: string) {
    this._statusText = value;
  }

  makeBody(): any {
    return {
      name: this.name,
      message: this.statusText,
      body: this.body,
    };
  }
}

export { SuccessResponse };
