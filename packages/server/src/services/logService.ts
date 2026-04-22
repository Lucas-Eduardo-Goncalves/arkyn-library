/**
 * Static service for log endpoint configuration and access.
 *
 * Stores a singleton configuration containing the traffic source identifier,
 * user token, and log ingestion URL.
 */
class LogService {
  private static config?: {
    trafficSourceId: string;
    userToken: string;
    apiUrl: string;
  };

  /**
   * Sets the log service configuration only once.
   * If the configuration is already set, the call is ignored.
   *
   * @param {object} config - Service configuration parameters.
   * @param {string} config.trafficSourceId - Traffic source identifier.
   * @param {string} config.userToken - User token for authentication.
   * @param {string} [config.logBaseApiUrl] - Optional base URL for the log service.
   */
  static setConfig(config: {
    trafficSourceId: string;
    userToken: string;
    logBaseApiUrl?: string;
  }): void {
    if (!!this.config) return;

    const { trafficSourceId, userToken, logBaseApiUrl } = config;
    const baseUrl = logBaseApiUrl || `http://62.238.8.44:8081`;
    const apiUrl = `${baseUrl}/ingest-log`;

    this.config = { trafficSourceId, userToken, apiUrl };
  }

  /**
   * Returns the current service configuration, if it exists.
   * @returns {{ trafficSourceId: string; userToken: string; apiUrl: string } | undefined} The stored configuration or `undefined` if not set.
   */
  static getConfig():
    | { trafficSourceId: string; userToken: string; apiUrl: string }
    | undefined {
    return this.config;
  }

  /**
   * Resets the stored configuration, allowing a new initialization.
   */
  static resetConfig() {
    this.config = undefined;
  }
}

export { LogService };
