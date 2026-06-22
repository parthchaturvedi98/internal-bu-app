import { Client } from '@microsoft/microsoft-graph-client';
import { msalInstance, loginRequest } from './auth';

export function getGraphClient(): Client {
  return Client.init({
    authProvider: async (done) => {
      try {
        const account = msalInstance.getActiveAccount();
        if (!account) throw new Error('No active account');
        const res = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
        done(null, res.accessToken);
      } catch {
        done(new Error('Token acquisition failed'), null);
      }
    },
  });
}
