import { IApp } from '..';
import auth from './auth';

const discord: IApp = {
  name: 'Discord',
  key: 'DISCORD',
  icon: '/discord.png',
  description: 'connect your discord account',
  auth,
};

export default discord;
