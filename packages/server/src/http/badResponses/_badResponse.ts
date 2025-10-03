import { flushDebugLogs } from "../../services/flushDebugLogs";
import { getCaller } from "../../services/getCaller";

type Input = {
  name: string;
  body?: any;
  cause?: any;
  message?: string;
};

class BadResponse {
  onDebug(input: Input) {
    const { name, body, cause, message } = input;

    const debugs: string[] = [];
    const { callerInfo, functionName } = getCaller();

    debugs.push(`${name} initialized`);
    debugs.push(`Caller Function: ${functionName}`);
    debugs.push(`Caller Location: ${callerInfo}`);

    if (message) debugs.push(`Message: ${message}`);
    if (body) debugs.push(`Body: ${JSON.stringify(body, null, 2)}`);
    if (cause) debugs.push(`Cause: ${JSON.stringify(cause, null, 2)}`);

    flushDebugLogs({ scheme: "red", name: "ARKYN-BAD-RESPONSE-DEBUG", debugs });
  }
}

export { BadResponse };
