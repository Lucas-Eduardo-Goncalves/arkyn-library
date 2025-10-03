type FlushDebugLogsProps = {
  scheme: "yellow" | "cyan" | "red" | "green";
  name: string;
  debugs: string[];
};

function flushDebugLogs(props: FlushDebugLogsProps) {
  const isDebugMode =
    process.env.NODE_ENV === "development" ||
    process.env?.SHOW_ERRORS_IN_CONSOLE === "true";

  if (isDebugMode) {
    const reset = "\x1b[0m";

    const colors = {
      yellow: "\x1b[33m",
      cyan: "\x1b[36m",
      red: "\x1b[31m",
      green: "\x1b[32m",
    };

    const debugName = `${colors[props.scheme]}[${props.name}]${reset}`;
    let consoleData = `\n`;

    props.debugs.forEach((debug) => {
      consoleData += `${debugName} ${debug.trim()}\n`;
    });

    console.log(consoleData);
  }
}

export { flushDebugLogs };
