'use strict'
console.log("config/prod.env.js", "process.env.BUILD_ENV", process.env.BUILD_ENV)
module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: process.env.BUILD_ENV == 'development' ? '"development"' : '"production"'
}
