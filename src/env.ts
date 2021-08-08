import { Path } from './deps';

require('dotenv').config({
  path: Path.join(__dirname, '../.env')
});

export const env = {
  port: process.env.PORT
};
