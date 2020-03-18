import TIM from "tim-js-sdk"
import COSSDK from "cos-js-sdk-v5"
import Vue from 'vue'

export default class timClientClass {
  constructor(options) {
  //初始化SDK实例
  this.tim = TIM.create({
    SDKAppID: options.SDKAppID
  })

  window.setLogLevel = this.tim.setLogLevel

  // 无日志级别
  this.tim.setLogLevel(1)

  // 注册 cos
  this.tim.registerPlugin({
    'cos-js-sdk': COSSDK
  })
}
}