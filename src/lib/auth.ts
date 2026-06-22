import { PublicClientApplication } from '@azure/msal-browser';

// Fill these in after your Azure AD app registration
// See README or ask the assistant for instructions
export const MSAL_CONFIG = {
  clientId: 'REPLACE_WITH_CLIENT_ID',    // Application (client) ID from Azure AD
  tenantId: 'REPLACE_WITH_TENANT_ID',    // Directory (tenant) ID from Azure AD
};

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: MSAL_CONFIG.clientId,
    authority: `https://login.microsoftonline.com/${MSAL_CONFIG.tenantId}`,
    redirectUri: window.location.origin + import.meta.env.BASE_URL,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
});

export const loginRequest = {
  scopes: ['User.Read', 'Sites.ReadWrite.All'],
};
