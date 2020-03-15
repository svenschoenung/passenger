module.exports = {
  pluginOptions: {
    quasar: {
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar',
    'gpg-promised',
    'vue-clamp',
    'resize-detector'
  ],
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Passenger'
        args[0].dev = process.env.NODE_ENV === 'development'
        return args;
      });
  },
}
