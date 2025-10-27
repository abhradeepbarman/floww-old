import axios from 'axios';
import config from '../../../config';

const API_ENDPOINT = 'https://discord.com/api/v10';

export const getAuthToken = async (code: string) => {
  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.DISCORD_REDIRECT_URI,
  });

  const response = await axios.post(`${API_ENDPOINT}/oauth2/token`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: config.DISCORD_CLIENT_ID,
      password: config.DISCORD_CLIENT_SECRET,
    },
  });

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
  };
};
