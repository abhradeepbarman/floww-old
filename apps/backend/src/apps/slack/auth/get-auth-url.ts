import config from '../../../config';

export const getAuthUrl = (sessionId: string) => {
  const clientId = config.SLACK_CLIENT_ID;
  const scopes = ['users:read'];
  const redirectUri = config.SLACK_REDIRECT_URI;

  const authUrl = new URL('https://slack.com/oauth/v2/authorize');
  authUrl.searchParams.set('scope', scopes.join(','));
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', sessionId);

  return authUrl.toString();
};
