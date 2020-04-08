const title = 'Passenger'
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      title,
      dev
    },
    splash_light: {
      entry: 'src/splash.ts',
      template: 'public/splash.html',
      filename: 'splash_light.html',
      title,
      theme: 'light',
      dev,
      chunks: ['splash_light']
    },
    splash_dark: {
      entry: 'src/splash.ts',
      template: 'public/splash.html',
      filename: 'splash_dark.html',
      title,
      theme: 'dark',
      dev,
      chunks: ['splash_dark']
    }
  },
  pluginOptions: {
    quasar: {
      rtlSupport: false
    },
    electronBuilder: {
      builderOptions: {
        appId: "org.schoenung.passenger",
        productName: "Passenger",
        copyright: "Copyright © 2020 Sven Schoenung"
      }
    }
  },
  transpileDependencies: [
    'quasar',
    'gpg-promised',
    'vue-clamp',
    'resize-detector'
  ]
}
