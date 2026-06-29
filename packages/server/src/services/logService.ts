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
	 * Sets the log service configuration once. Subsequent calls are ignored.
	 *
	 * @param config.trafficSourceId - Traffic source identifier.
	 * @param config.userToken - User token for authentication.
	 * @param config.logBaseApiUrl - Override the default log ingestion base URL.
	 */
	static setConfig(config: {
		trafficSourceId: string;
		userToken: string;
		logBaseApiUrl?: string;
	}): void {
		if (LogService.config) return;

		const { trafficSourceId, userToken, logBaseApiUrl } = config;
		const baseUrl = logBaseApiUrl || `http://62.238.8.44:8081`;
		const apiUrl = `${baseUrl}/ingest-log`;

		LogService.config = { trafficSourceId, userToken, apiUrl };
	}

	/** Returns the stored configuration, or `undefined` if `setConfig` has not been called. */
	static getConfig():
		| { trafficSourceId: string; userToken: string; apiUrl: string }
		| undefined {
		return LogService.config;
	}

	/**
	 * Resets the stored configuration, allowing a new initialization.
	 */
	static resetConfig() {
		LogService.config = undefined;
	}
}

export { LogService };
