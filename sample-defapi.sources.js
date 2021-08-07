/**
 * @type {DefapiSource | DefapiSource[]}
 */
module.exports = [
  {
    name: 'my_service_api',
    label: 'My Service API',
    manifestUrl: 'http://0.0.0.0:3456/defapi/manifest'
  },
  {
    name: 'my_other_service_api',
    label: 'My Other Service API',
    manifestUrl: 'http://0.0.0.0:8765/defapi/manifest'
  }
];
