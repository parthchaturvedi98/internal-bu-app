import { PublicClientApplication } from '@azure/msal-browser';

// Fill these in after your Azure AD app registration
export const MSAL_CONFIG = {
  clientId: 'REPLACE_WITH_CLIENT_ID',    // Application (client) ID from Azure AD
  tenantId: 'REPLACE_WITH_TENANT_ID',    // Directory (tenant) ID from Azure AD
};

export const isConfigured =
  !MSAL_CONFIG.clientId.startsWith('REPLACE') &&
  !MSAL_CONFIG.tenantId.startsWith('REPLACE');

// Only created when config is valid — do not call if isConfigured is false
export const msalInstance = isConfigured
  ? new PublicClientApplication({
      auth: {
        clientId: MSAL_CONFIG.clientId,
        authority: `https://login.microsoftonline.com/${MSAL_CONFIG.tenantId}`,
        redirectUri: window.location.origin + import.meta.env.BASE_URL,
      },
      cache: { cacheLocation: 'localStorage' },
    })
  : null;

export const loginRequest = {
  scopes: ['User.Read', 'Sites.ReadWrite.All'],
};
