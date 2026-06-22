import { Client } from '@microsoft/microsoft-graph-client';
import { msalInstance, loginRequest } from './auth';

export function getGraphClient(): Client {
  if (!msalInstance) throw new Error('MSAL not configured');
  const msal = msalInstance;
  return Client.init({
    authProvider: async (done) => {
      try {
        const account = msal.getActiveAccount();
        if (!account) throw new Error('No active account');
        const res = await msal.acquireTokenSilent({ ...loginRequest, account });
        done(null, res.accessToken);
      } catch {
        done(new Error('Token acquisition failed'), null);
      }
    },
  });
}
