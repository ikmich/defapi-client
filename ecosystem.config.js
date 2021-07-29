module.exports = {
  apps: [
    {
      name: 'defapi-client',
      script: './server/dist/index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 4,
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
