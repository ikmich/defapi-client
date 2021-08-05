const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Defapi API Definitions';
      return args;
    });

    // config.plugin('path').resolve('./src');
  }

  // configureWebpack: {
  //   resolve: {
  //     modules: [
  //       path.resolve('./src')
  //     ]
  //     // alias: {
  //     //   '@src': path.resolve('./src')
  //     // }
  //   }
  // }
};
