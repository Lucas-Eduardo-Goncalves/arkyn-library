/**
 * Service for managing HTTP debug configuration and behavior.
 *
 * This service provides functionality to configure how the `getCaller` function
 * identifies the actual caller in the stack trace by allowing specific files
 * to be ignored during stack trace analysis.
 *
 * @example
 * ```typescript
 * // Configure to ignore httpAdapter.ts in stack traces
 * HttpDebugService.setIgnoreFile("httpAdapter.ts");
 *
 * // Now when httpDebug is called from within httpAdapter.ts,
 * // it will show the actual caller (e.g., cart.ts) instead
 * ```
 */

class DebugService {
  /**
   * The name of the file to ignore when analyzing the stack trace.
   * When set, the `getCaller` function will skip stack frames containing this file name.
   */
  static ignoreFiles: string[] = [];

  /**
   * Sets the file name to be ignored during stack trace analysis.
   *
   * This method configures the debug service to skip specific files when
   * determining the actual caller of a function. This is useful when you have
   * adapter or wrapper functions that you want to be transparent in the debug output.
   *
   * @param file - The name of the file to ignore in stack traces (e.g., "httpAdapter.ts")
   *
   * @example
   * ```typescript
   * // Ignore the HTTP adapter file so debug shows the actual business logic caller
   * DebugService.setIgnoreFile("httpAdapter.ts");
   * ```
   */

  static setIgnoreFile(file: string) {
    this.ignoreFiles.push(file);
  }

  /**
   * Clears all configured ignore files.
   *
   * This method resets the ignore file configuration, allowing all files to be
   * considered in stack trace analysis again.
   *
   * @example
   * ```typescript
   * // Clear all ignore file configurations
   * DebugService.clearIgnoreFiles();
   * ```
   */

  static clearIgnoreFiles() {
    this.ignoreFiles = [];
  }
}

export { DebugService };
