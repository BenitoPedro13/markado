module.exports = {
  apps: [{
    name: 'deploy-webhook',
    script: 'deploy-webhook.js',
    env: {
      NODE_ENV: 'production'
    },
    env_file: '.env.webhook'
  }]
}; 