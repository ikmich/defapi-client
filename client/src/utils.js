function isDev() {
  return process.env.NODE_ENV === 'development';
}

function getVersion() {
  return require('../package.json').version;
}

function getBaseUri() {
  return '';
}

export { isDev, getVersion, getBaseUri };
