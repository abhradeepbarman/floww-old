import { Request, Response } from 'express';
import config from '../../../config';

export const getAuthUrl = (req: Request, res: Response) => {
  const state = req.session.id;
  const clientId = config.DISCORD_CLIENT_ID;
  const scopes = ['identify', 'guilds'];
  const redirectUri = config.DISCORD_REDIRECT_URI;
  const prompt = 'consent';
  const integrationType = 0;

  const authUrl = new URL('https://discord.com/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', prompt);
  authUrl.searchParams.set('integration_type', integrationType.toString());

  return res.redirect(authUrl.toString());
};
