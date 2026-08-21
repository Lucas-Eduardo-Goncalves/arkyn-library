import { flushDebugLogs } from "../utilities/flushDebugLogs";

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
		apiUrl: string | null;
	};

	/**
	 * Checks whether a log ingestion URL is safe to send telemetry to: `https://`
	 * is always accepted, and plain `http://` is only accepted for local development
	 * (`localhost` / `127.0.0.1`). Every other `http://` destination is rejected so
	 * request/response data is never transmitted in plaintext over the network.
	 */
	private static isSecureEndpoint(url: URL): boolean {
		if (url.protocol === "https:") return true;
		return url.hostname === "localhost" || url.hostname === "127.0.0.1";
	}

	/**
	 * Sets the log service configuration once. Subsequent calls are ignored.
	 *
	 * There is no hardcoded fallback endpoint: if `logBaseApiUrl` is omitted, invalid,
	 * or points at an insecure (`http://`) non-local destination, remote log delivery
	 * is disabled (`getConfig().apiUrl` is `null`) instead of silently sending data to
	 * a default/insecure host — `logRequest` skips the network call in that case.
	 *
	 * @param config.trafficSourceId - Traffic source identifier.
	 * @param config.userToken - User token for authentication.
	 * @param config.logBaseApiUrl - Log ingestion base URL. Must be `https://`, or
	 * `http://localhost`/`http://127.0.0.1` for local development.
	 */
	static setConfig(config: {
		trafficSourceId: string;
		userToken: string;
		logBaseApiUrl?: string;
	}): void {
		if (LogService.config) return;

		const { trafficSourceId, userToken, logBaseApiUrl } = config;
		let apiUrl: string | null = null;

		if (logBaseApiUrl) {
			try {
				const parsedUrl = new URL(logBaseApiUrl);

				if (LogService.isSecureEndpoint(parsedUrl)) {
					apiUrl = `${logBaseApiUrl}/ingest-log`;
				} else {
					flushDebugLogs({
						name: "LogServiceError",
						scheme: "red",
						debugs: [
							`Insecure logBaseApiUrl "${logBaseApiUrl}" rejected: use https://, or http:// only for localhost/127.0.0.1. Remote logging disabled.`,
						],
					});
				}
			} catch {
				flushDebugLogs({
					name: "LogServiceError",
					scheme: "red",
					debugs: [
						`Invalid logBaseApiUrl "${logBaseApiUrl}". Remote logging disabled.`,
					],
				});
			}
		}

		LogService.config = { trafficSourceId, userToken, apiUrl };
	}

	/** Returns the stored configuration, or `undefined` if `setConfig` has not been called. */
	static getConfig():
		| { trafficSourceId: string; userToken: string; apiUrl: string | null }
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
