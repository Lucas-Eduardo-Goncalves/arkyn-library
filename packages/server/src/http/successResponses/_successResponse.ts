import { DebugService } from "../../services/debugService";
import { flushDebugLogs } from "../../utilities/flushDebugLogs";

/**
 * Base class for handling successful HTTP responses with debugging capabilities.
 * Provides logging functionality to track response and their context.
 */
class SuccessResponse {
	private _body: any = null;
	private _name: string = "SuccessResponse";
	private _status: number = 200;
	private _statusText: string = "OK";
	private _debugColor: "green" | "yellow" | "cyan" | "red" = "green";

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

	get debugColor(): "green" | "yellow" | "cyan" | "red" {
		return this._debugColor;
	}

	set debugColor(value: "green" | "yellow" | "cyan" | "red") {
		if (!["green", "yellow", "cyan", "red"].includes(value)) return;
		this._debugColor = value;
	}

	/**
	 * Logs debug information for success responses including caller context and response details.
	 *
	 * @param {any} body - The response body or success data to be logged
	 *
	 * @example
	 * ```typescript
	 * const SuccessResponse = new SuccessResponse();
	 * SuccessResponse.onDebug({ data: "Operation completed successfully" });
	 * ```
	 */
	onDebug(body?: any): void {
		const debugs: string[] = [];
		const { callerInfo, functionName } = DebugService.getCaller();

		debugs.push(`Caller Function: ${functionName}`);
		debugs.push(`Caller Location: ${callerInfo}`);

		if (this.statusText) debugs.push(`Message: ${this.statusText}`);
		if (body) debugs.push(`Body: ${JSON.stringify(body)}`);

		flushDebugLogs({ scheme: this._debugColor, name: this.name, debugs });
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
