module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Defapi API Definitions';
      return args;
    });
  }
};
