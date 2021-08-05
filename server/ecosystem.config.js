module.exports = {
  apps: [
    {
      name: 'defapi-client',
      script: './dist/server.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: true,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'staging'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
