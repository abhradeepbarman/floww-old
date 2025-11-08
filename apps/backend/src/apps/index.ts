import discord from './discord';
import slack from './slack';

export interface IApp {
  name: string;
  key: string;
  icon: string;
  description: string;
  auth: {
    getAuthUrl: Function;
    getAuthToken: Function;
  };
}

const apps = {
  discord,
  slack,
};

export default apps;
