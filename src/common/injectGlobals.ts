export const getApplicationEnvVar = (envVarName: string) =>
  (process.env[`REACT_APP_${envVarName}`] || '') as string;

export const devDebug = process.env.NODE_ENV === 'development';
export const debugGoogleAnalytics = getApplicationEnvVar('DEBUG_GOOGLE_ANALYTICS') === 'true';

export const shortUrlApi = getApplicationEnvVar('SHORTURL_API');
export const shortUrlResolveRoot = getApplicationEnvVar('SHORTURL_RESOLVE_ROOT');

export const arrangerApiRoot = getApplicationEnvVar('ARRANGER_API');
export const kfArrangerApiRoot = getApplicationEnvVar('KF_ARRANGER_API');

export const arrangerProjectId = getApplicationEnvVar('PROJECT_ID');
export const arrangerApiProjectId = getApplicationEnvVar('PROJECT_API_ID');

export const personaApiRoot: string = getApplicationEnvVar('PERSONA_API') || '';
export const secretStorageApiRoot: string = getApplicationEnvVar('SECRETS_API');

export const cavaticaApiRoot: string = getApplicationEnvVar('CAVATICA_API');
export const cavaticaWebRoot: string = getApplicationEnvVar('CAVATICA_WEB');
export const cavaticaWebRegistrationRoot: string = getApplicationEnvVar(
  'CAVATICA_WEB_REGISTRATION',
);

export const googleMapsKey = getApplicationEnvVar('GOOGLE_MAPS_KEY');

export const orcidAuthAppId = getApplicationEnvVar('ORCID_AUTH_APP_ID');
export const orcidAuthApiBaseUri = getApplicationEnvVar('ORCID_AUTH_API_URI');
export const orcidAuthScope = getApplicationEnvVar('ORCID_AUTH_API_SCOPE');
export const orcidAuthRedirectUri = getApplicationEnvVar('ORCID_AUTH_REDIRECT_URI');

export const gaTrackingID: string = getApplicationEnvVar('GA_TRACKING_ID');

export const requireLogin = getApplicationEnvVar('REQUIRE_LOGIN') === 'true';

export const kfWebRoot: string = getApplicationEnvVar('KF_WEB_ROOT');
export const notionWebRoot: string = getApplicationEnvVar('NOTION_WEB_ROOT');
export const kfFacebook: string = getApplicationEnvVar('KF_FACEBOOK');
export const kfTwitter: string = getApplicationEnvVar('KF_TWITTER');
export const kfGithub: string = getApplicationEnvVar('KF_GITHUB');

export const maintenanceMode: Boolean = getApplicationEnvVar('MAINTENANCE_MODE') === 'true';

export const gen3ApiRoot = getApplicationEnvVar('GEN3_API');
export const gen3WebRoot = getApplicationEnvVar('GEN3_WEB') || 'http://www.gen3.org/';
export const gen3OauthRedirect = encodeURIComponent(`${window.location.origin}/gen3_redirect/`);

export const dcfApiRoot = getApplicationEnvVar('DCF_API');
export const dcfWebRoot = getApplicationEnvVar('DCF_WEB') || 'https://dcf.gen3.org/';
export const dcfOauthRedirect = encodeURIComponent(`${window.location.origin}/dcf_redirect/`);

export const fenceAuthClientUri = getApplicationEnvVar('FENCE_AUTH_CLIENT_URI') || '';
export const fenceRefreshUri = getApplicationEnvVar('FENCE_REFRESH_URI') || '';
export const fenceTokensUri = getApplicationEnvVar('FENCE_TOKENS_URI') || '';

export const reactApiDataVersionApi = getApplicationEnvVar('DATA_VERSION_API') || null;
export const reactApiDataVersionFallback: string =
  getApplicationEnvVar('DATA_VERSION_FALLBACK') || '';
export const reactApiSearchMembersApi = getApplicationEnvVar('SEARCH_MEMBERS_API') || null;
export const kfVariantClusterUrl = getApplicationEnvVar('VARIANT_CLUSTER_API') || null;

export const arrangerAdminApiRoot = getApplicationEnvVar('ARRANGER_ADMIN_ROOT') || null;

// Reports API
export const reportsApiRoot = getApplicationEnvVar('REPORTS_API') || '';

export const userSnapApiKey = getApplicationEnvVar('USER_SNAP_API_KEY') || '';

// Idp (ras || fence)
export const idp = getApplicationEnvVar('IDP');

export const kcRealm = getApplicationEnvVar('KC_REALM');
export const kcAuthUrl = getApplicationEnvVar('KC_AUTH_SERVER_URL');
export const kcClientId = getApplicationEnvVar('KC_CLIENT_ID');
