import {
  KEYCLOAK_AUTH_GRANT_TYPE,
  rptRequest,
  Rpt,
  getAccessTokenStatus,
} from 'auth/keycloak-api/utils';
import { keycloakConfig } from './config';

export class RptManager {
  private static storedRpt?: Rpt;

  private static async requestNewRpt() {
    const data = encodeURIComponent(
      JSON.stringify({
        grant_type: KEYCLOAK_AUTH_GRANT_TYPE,
        audience: keycloakConfig.clientId,
      }),
    );
    return rptRequest(data);
  }

  private static async readRptFromStorage() {
    if (this.storedRpt == null) {
      this.storedRpt = await this.requestNewRpt();
    }

    return this.storedRpt;
  }

  public static async readRpt(): Promise<Rpt> {
    const rpt = await this.readRptFromStorage();
    const status = getAccessTokenStatus(rpt);

    if (!status.expired) {
      return rpt;
    }

    return this.requestNewRpt();
  }
}
