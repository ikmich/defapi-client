function isDev() {
  return process.env.NODE_ENV === 'development';
}

function getVersion() {
  return require('../package.json').version;
}

function getBaseUri() {
  return isDev() ? 'http://0.0.0.0:7500' : '';
}

export { isDev, getVersion, getBaseUri };
