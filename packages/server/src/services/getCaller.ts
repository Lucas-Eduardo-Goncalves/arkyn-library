import path from "path";
import { DebugService } from "./debugService";

/**
 * Retrieves information about the caller of the current function.
 *
 * This function analyzes the stack trace to determine the file path and function name
 * of the caller. It excludes stack trace entries related to the `@arkyn/server` package
 * and attempts to resolve the file path relative to the project root directory.
 *
 * @returns An object containing:
 * - `functionName`: The name of the function that called the current function, or "Unknown function" if it cannot be determined.
 * - `callerInfo`: The file path of the caller relative to the project root, or "Unknown caller" if it cannot be determined.
 */

function getCaller() {
  const projectRoot = process.cwd();

  const err = new Error();
  const stack = err.stack || "";
  const stackLines = stack.split("\n").map((line) => line.trim());

  const ignoreFiles = DebugService.ignoreFiles;

  let callerIndex = 2;

  while (
    callerIndex < stackLines.length &&
    (stackLines[callerIndex].includes("node:internal") ||
      stackLines[callerIndex].includes("/node_modules/"))
  ) {
    callerIndex++;
  }

  if (ignoreFiles.length > 0) {
    while (
      callerIndex < stackLines.length &&
      ignoreFiles.some((ignoreFile) =>
        stackLines[callerIndex].includes(ignoreFile)
      )
    ) {
      callerIndex++;
    }
  }

  const callerLine = stackLines[callerIndex] || "";

  let functionName = "Unknown function";
  let callerInfo = "Unknown caller";

  const namedFunctionMatch = callerLine.match(/at\s+([^(\s]+)\s+\(([^)]+)\)/);
  if (namedFunctionMatch) {
    functionName = namedFunctionMatch[1];
    callerInfo = namedFunctionMatch[2];
  } else {
    const anonymousFunctionMatch = callerLine.match(/at\s+(.+)/);
    if (anonymousFunctionMatch) {
      callerInfo = anonymousFunctionMatch[1];

      const objectMethodMatch = callerInfo.match(/at\s+([^(\s]+)\s+/);
      if (objectMethodMatch && objectMethodMatch[1] !== "new") {
        functionName = objectMethodMatch[1];
      }
    }
  }

  if (callerInfo.includes("(")) {
    callerInfo = callerInfo.substring(
      callerInfo.indexOf("(") + 1,
      callerInfo.lastIndexOf(")")
    );
  }

  callerInfo = callerInfo.split(":").slice(0, -2).join(":");

  try {
    callerInfo = path.relative(projectRoot, callerInfo);
  } catch (e) {}

  return { functionName, callerInfo };
}

export { getCaller };
