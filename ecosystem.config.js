module.exports = {
    apps: [
      {
        name: 'PomoTS',
        script: './prod/index.js',
        node_args : '-r dotenv/config',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  }