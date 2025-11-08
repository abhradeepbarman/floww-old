import { IApp } from '..';
import auth from './auth';

const slack: IApp = {
  name: 'Slack',
  description: 'connect your slack account',
  icon: '/slack.svg',
  key: 'SLACK',
  auth,
};

export default slack;
