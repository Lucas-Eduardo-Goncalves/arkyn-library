import { flushDebugLogs } from "../utilities/flushDebugLogs";

/**
 * Static service for log endpoint configuration and access.
 *
 * Stores a singleton configuration containing the traffic source identifier,
 * service token, and log ingestion URL.
 *
 * `serviceToken` authenticates *this application* to the Arkyn log ingestion
 * API — it is a static, application-level credential (e.g. an env var),
 * the same for every request. It is **not** an end-user/session token:
 * because `setConfig` is a singleton that only applies on its first call
 * (see below), passing a per-request value (like `session.token`) here
 * would permanently leak whichever request happened to call `setConfig`
 * first to every other request's outbound telemetry for the lifetime of
 * the process. Call `setConfig` once, at application boot, outside of any
 * request handler.
 */
class LogService {
	private static config?: {
		trafficSourceId: string;
		serviceToken: string;
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
	 * Sets the log service configuration once. Subsequent calls are ignored
	 * (a warning is logged in development/debug mode so accidental
	 * per-request reconfiguration attempts — e.g. calling this from inside a
	 * request handler — aren't silently swallowed during development).
	 *
	 * There is no hardcoded fallback endpoint: if `logBaseApiUrl` is omitted, invalid,
	 * or points at an insecure (`http://`) non-local destination, remote log delivery
	 * is disabled (`getConfig().apiUrl` is `null`) instead of silently sending data to
	 * a default/insecure host — `logRequest` skips the network call in that case.
	 *
	 * @param config.trafficSourceId - Traffic source identifier.
	 * @param config.serviceToken - Static, application-level credential used to
	 * authenticate to the Arkyn log ingestion API. Must be the same value for every
	 * request (e.g. sourced from an env var) — never an end-user/session token.
	 * @param config.userToken - @deprecated Alias for `serviceToken`, kept for
	 * backward compatibility. Using this name for a per-request/session value is
	 * unsafe: `setConfig` is a singleton, so only the first call's value is kept.
	 * @param config.logBaseApiUrl - Log ingestion base URL. Must be `https://`, or
	 * `http://localhost`/`http://127.0.0.1` for local development.
	 */
	static setConfig(config: {
		trafficSourceId: string;
		serviceToken?: string;
		/** @deprecated Use `serviceToken` instead. */
		userToken?: string;
		logBaseApiUrl?: string;
	}): void {
		if (LogService.config) {
			flushDebugLogs({
				name: "LogServiceError",
				scheme: "yellow",
				debugs: [
					"LogService.setConfig() was already called and is a singleton — this call was ignored. " +
						"Call setConfig() once at application boot, never inside a request handler " +
						"(a per-request value would only ever apply to the first request that reaches it).",
				],
			});
			return;
		}

		const { trafficSourceId, logBaseApiUrl } = config;
		const serviceToken = config.serviceToken ?? config.userToken;

		if (config.userToken !== undefined && config.serviceToken === undefined) {
			flushDebugLogs({
				name: "LogServiceError",
				scheme: "yellow",
				debugs: [
					'LogService.setConfig({ userToken }) is deprecated — use "serviceToken" instead. ' +
						"It must be a static, application-level credential, not a per-user/session value.",
				],
			});
		}

		if (!serviceToken) {
			throw new Error(
				"LogService.setConfig() requires a serviceToken (or the deprecated userToken alias).",
			);
		}

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

		LogService.config = { trafficSourceId, serviceToken, apiUrl };
	}

	/** Returns the stored configuration, or `undefined` if `setConfig` has not been called. */
	static getConfig():
		| { trafficSourceId: string; serviceToken: string; apiUrl: string | null }
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
