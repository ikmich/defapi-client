function isDev() {
  return process.env.NODE_ENV === 'development';
}

function getVersion() {
  return require('../package.json').version;
}

function getBaseUri() {
  return process.env.VUE_APP_SERVER_BASE_URI ?? '';
}

export { isDev, getVersion, getBaseUri };
