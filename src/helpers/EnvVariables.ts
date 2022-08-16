export default class EnvironmentVariables {
  static vars: Record<string, string | undefined> = {
    // GENERAL
    ENV: process.env.NODE_ENV,
    INCLUDE_WEB_ROOT: process.env.REACT_APP_INCLUDE_WEB_ROOT,
    // APIS
    ARRANGER_API: process.env.REACT_APP_ARRANGER_API_URL,
    ARRANGER_PROJECT_ID: process.env.REACT_APP_ARRANGER_PROJECT_ID,
    USERS_API: process.env.REACT_APP_USERS_API_URL,
    // CAVATICA
    CAVATICA_USER_BASE_URL: process.env.REACT_APP_CAVATICA_USER_BASE_URL,
    // FENCES
    KEY_MANAGER_API_URL: process.env.REACT_APP_KEY_MANAGER_API_URL,
    FENCE_API_URL: process.env.REACT_APP_FENCE_API_URL,
    CAVATICA_FENCE_PROXY: process.env.REACT_APP_CAVATICA_FENCE_PROXY,
    GEN3_FENCE_PROXY: process.env.REACT_APP_GEN3_FENCE_PROXY,
    // KEYCLOAK
    KC_AUTH_SERVER_URL: process.env.REACT_APP_KC_AUTH_SERVER_URL,
    KC_CLIENT_ID: process.env.REACT_APP_KC_CLIENT_ID,
    KC_REALM: process.env.REACT_APP_KC_REALM,
    // USERSNAP
    USER_SNAP_API_KEY: process.env.REACT_APP_USER_SNAP_API_KEY,
    //REPORT
    REPORTS_API_URL: process.env.REACT_APP_REPORTS_API_URL,
  };

  static configFor(key: string): string {
    return EnvironmentVariables.vars[key] || '';
  }
}

export const getEnvVarByKey = <T>(key: string, defaultValue?: T): T =>
  (process.env[`REACT_APP_${key}`] as any) || defaultValue;

export const getFTEnvVarByKey = <T>(key: string, defaultValue?: T): T =>
  (process.env[`REACT_APP_FT_${key}`] as any) || defaultValue;
