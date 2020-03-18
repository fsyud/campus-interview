'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
console.log("config/index.js","process.env.BUILD_ENV",process.env.BUILD_ENV)
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/eHireWeb2009/VInterview/api': {
        // target: 'http://sh-dev-5131.51job.com/RealTimeAV.Web',//后端接口地址
        target: 'http://localhost/eHireWeb2009/VInterview',//后端接口地址
        changeOrigin: true,//是否允许跨越
        pathRewrite: {
          '^/eHireWeb2009/VInterview/api': '/api',//重写,
        }
      }
  },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //////20200306 jason 这一段不需要了
    // //prod
    // //assetsPublicPath: '/VInterview/',
  
    // //dev
    // assetsPublicPath: '/eHireWeb2009/VInterview/',
    //////20200306 jason 这一段不需要了

    assetsPublicPath: process.env.BUILD_ENV=="development"?'/eHireWeb2009/VInterview/':'/VInterview/',

    // assetsPublicPath: '/web/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
