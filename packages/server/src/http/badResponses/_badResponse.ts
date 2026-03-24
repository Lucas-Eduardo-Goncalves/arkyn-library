import { formatJsonString } from "@arkyn/shared";

import { DebugService } from "../../services/debugService";
import { flushDebugLogs } from "../../utilities/flushDebugLogs";

class BadResponse {
  private _cause?: any;
  private _name: string = "BadResponse";
  private _status: number = 500;
  private _statusText: string = "Unknown error";
  private _debugColor: "green" | "yellow" | "cyan" | "red" = "red";

  get cause(): any {
    return this._cause;
  }

  set cause(value: any) {
    this._cause = value;
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

  get debugColor(): "green" | "yellow" | "cyan" | "red" {
    return this._debugColor;
  }

  set debugColor(value: "green" | "yellow" | "cyan" | "red") {
    if (!["green", "yellow", "cyan", "red"].includes(value)) return;
    this._debugColor = value;
  }

  onDebug() {
    const debugs: string[] = [];
    const { callerInfo, functionName } = DebugService.getCaller();

    debugs.push(`Caller Function: ${functionName}`);
    debugs.push(`Caller Location: ${callerInfo}`);

    if (this._statusText) debugs.push(`Message: ${this._statusText}`);
    if (this._cause) {
      debugs.push(`Cause: ${formatJsonString(JSON.stringify(this._cause))}`);
    }

    flushDebugLogs({ scheme: "red", name: this._name, debugs });
  }

  makeBody() {
    return {
      name: this._name,
      message: this._statusText,
      cause: this._cause,
    };
  }
}

export { BadResponse };
