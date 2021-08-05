/**
 * @type {DefapiSource | DefapiSource[]}
 */
module.exports = [
  {
    name: 'champions_service',
    label: 'Champions Service',
    manifestUrl: 'http://0.0.0.0:4050/champions/defapi/manifest'
  },
  {
    name: 'accounts_service',
    label: 'Accounts Service',
    manifestUrl: 'http://0.0.0.0:6011/users/defapi/manifest'
  }
];
