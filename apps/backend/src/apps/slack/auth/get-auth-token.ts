import axios from 'axios';
import config from '../../../config';

const API_ENDPOINT = 'https://slack.com/api/oauth.v2.access';

export const getAuthToken = async (code: string) => {
  const data = new URLSearchParams({
    code,
    client_id: config.SLACK_CLIENT_ID,
    client_secret: config.SLACK_CLIENT_SECRET,
  });

  const response = await axios.post(
    `${API_ENDPOINT}?${data}`,
    {},
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  return {
    accessToken: response.data.access_token,
  };
};
