type ArkynConfigProps = {
  arkynTrafficSourceId: string;
  arkynUserToken: string;
  arkynApiUrl: string;
};

type SetArkynConfigProps = {
  arkynTrafficSourceId: string;
  arkynUserToken: string;
  arkynLogBaseApiUrl?: string;
};

/**
 * The `ArkynLogService` class manages the configuration for the arkyn flow.
 * It allows you to set and retrieve the arkyn configuration, including the traffic source ID,
 * user token, and API URL.
 */

class ArkynLogService {
  private static arkynConfig?: ArkynConfigProps;

  /**
   * Sets the configuration for the arkyn. This method initializes the arkyn configuration
   * with the provided `arkynConfig` values. If the configuration has already been set,
   * the method will return early without making any changes.
   *
   * @param arkynConfig - An object containing the arkyn configuration properties.
   * @param arkynConfig.arkynTrafficSourceId - The key used to identify the arkyn.
   * @param arkynConfig.arkynUserToken - The user token for authenticating with the arkyn.
   * @param arkynConfig.arkynLogBaseApiUrl - (Optional) The API URL for the arkyn. If not provided,
   * a default URL will be used.
   */

  static setArkynConfig(arkynConfig: SetArkynConfigProps) {
    if (!!this.arkynConfig) return;

    let defaultArkynURL = `https://logs-arkyn-flow-logs.vw6wo7.easypanel.host`;
    let arkynLogBaseApiUrl = arkynConfig.arkynLogBaseApiUrl || defaultArkynURL;

    arkynLogBaseApiUrl =
      arkynLogBaseApiUrl + "/http-traffic-records/:trafficSourceId";

    this.arkynConfig = {
      arkynTrafficSourceId: arkynConfig.arkynTrafficSourceId,
      arkynUserToken: arkynConfig.arkynUserToken,
      arkynApiUrl: arkynLogBaseApiUrl,
    };
  }

  /**
   * Retrieves the current arkyn configuration for the ArkynLogService.
   *
   * @returns {ArkynConfigProps | undefined} The current arkyn configuration if set,
   * or `undefined` if no configuration has been initialized.
   */
  static getArkynConfig(): ArkynConfigProps | undefined {
    return this.arkynConfig;
  }

  /**
   * Resets the arkyn configuration to `undefined`.
   * This method can be used to clear the current configuration.
   */

  static resetArkynConfig() {
    this.arkynConfig = undefined;
  }
}

export { ArkynLogService };
