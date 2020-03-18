<template>
  <div class="wrap">
    <!-- <div class="top block-grey flex items-center">
      <div class="top-logo center">
        <img src="../linkfiles/images/logo_blue.png" />
      </div>
      <div class="top-title flex">
        <img src="../linkfiles/images/slogen.png" />
      </div>
    </div>-->
    <div class>
      <div class="flex items-center justify-center">
        <div class="dialog-box" id="form-box">
          <div class="dialog-content form">
            <div class="dialog-content-form">
              <div class="check-list">
                浏览器兼容性
                <img class="arrow" src="../static/img/arrow.png" />
              </div>
              <ul class="check-list-box" id="checkSystem">
                <p id="browerTxt"></p>
              </ul>
              <div class="check-list">
                麦克风检测
                <img class="arrow" src="../static/img/arrow.png" />
              </div>
              <ul class="check-list-box" id="checkAudio">
                <p id="micTxt"></p>
              </ul>
              <div class="check-list">
                摄像头检测
                <img class="arrow" src="../static/img/arrow.png" />
              </div>
              <ul class="check-list-box" id="checkVideo">
                <p id="cameraTxt"></p>
              </ul>
              <div class="check-list">
                网络检测
                <img class="arrow" src="../static/img/arrow.png" />
              </div>
              <ul class="check-list-box" id="checkServer">
                <p id="connectionTxt"></p>
              </ul>
            </div>
          </div>
          <div class="dialog-bottom center">
            <div id="load">正在检测中....</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  navigator.enumerateDevices = function(callback) {
    navigator.mediaDevices.enumerateDevices().then(callback);
  };
}

var MediaDevices = [];
var canEnumerate = false;

if (
  typeof MediaStreamTrack !== "undefined" &&
  "getSources" in MediaStreamTrack
) {
  canEnumerate = true;
} else if (
  navigator.mediaDevices &&
  !!navigator.mediaDevices.enumerateDevices
) {
  canEnumerate = true;
}

var hasMicrophone = false;
var hasSpeakers = false;
var hasWebcam = false;
var hasPermission = false;
var isMicrophoneAlreadyCaptured = false;
var isWebcamAlreadyCaptured = false;
var isConnetion = false;

export default {
  name: "CheckDevice",
  components: {},
  created: async function() {
    this.check();
  },
  destroyed: function() {
    if (this.streamAudio) {
      this.streamAudios.getTracks().forEach(function(track) {
        console.log(track);
        track.stop();
      });
    }
    if (this.streamVideo) {
      this.streamVideo.getTracks().forEach(function(track) {
        console.log(track);
        track.stop();
      });
    }
  },
  methods: {
    checkDeviceSupport: function(callback) {
      //检测设备
      if (!canEnumerate) {
        return;
      }

      if (
        !navigator.enumerateDevices &&
        window.MediaStreamTrack &&
        window.MediaStreamTrack.getSources
      ) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
          window.MediaStreamTrack
        );
      }

      if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
      }

      if (!navigator.enumerateDevices) {
        if (callback) {
          callback();
        }
        return;
      }

      MediaDevices = [];
      var isHTTPs = location.protocol === "https:";
      navigator.enumerateDevices(function(devices) {
        devices.forEach(function(_device) {
          var device = {};
          for (var d in _device) {
            device[d] = _device[d];
          }

          if (device.kind === "audio") {
            device.kind = "audioinput";
          }

          if (device.kind === "video") {
            device.kind = "videoinput";
          }

          var skip;
          MediaDevices.forEach(function(d) {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true;
            }
          });

          if (skip) {
            return;
          }

          if (!device.deviceId) {
            device.deviceId = device.id;
          }

          if (!device.id) {
            device.id = device.deviceId;
          }

          if (!device.label) {
            hasPermission = false;
          } else {
            hasPermission = true;
            if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true;
            }

            if (device.kind === "audioinput" && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true;
            }
          }
          //检测音频输入
          if (device.kind === "audioinput") {
            hasMicrophone = true;
          }
          //检测音频输出
          if (device.kind === "audiooutput") {
            hasSpeakers = true;
          }
          //检测视频输入
          if (device.kind === "videoinput") {
            hasWebcam = true;
          }
          MediaDevices.push(device);
        });

        if (callback) {
          callback();
        }
      });
    },
    checkBrower: function() {
      var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
      return isChrome;
    },
    check: function() {
      let that = this;
      this.checkDeviceSupport(async function() {
        document.getElementById("checkSystem").style.display = "block";
        document.getElementById("checkAudio").style.display = "block";
        document.getElementById("checkVideo").style.display = "block";
        document.getElementById("checkServer").style.display = "block";
        var isChrome = that.checkBrower();
        if (!isChrome) {
          document.getElementById("browerTxt").innerHTML =
            "请使用最新版谷歌浏览器！";
          document.getElementById("browerTxt").className = "test-box2";
        } else {
          document.getElementById("browerTxt").innerHTML = "浏览器正常";
          document.getElementById("browerTxt").className = "test-box1";
        }

        if (hasPermission) {
          if (!hasWebcam) {
            document.getElementById("cameraTxt").innerHTML =
              "检测到摄像头无法正常工作";
            document.getElementById("cameraTxt").className = "test-box2";
          } else if (isWebcamAlreadyCaptured) {
            document.getElementById("cameraTxt").innerHTML =
              "检测到摄像头正常工作";
            document.getElementById("cameraTxt").className = "test-box1";
          } else {
            document.getElementById("cameraTxt").innerHTML =
              "检测到摄像头，但未授权浏览器使用。请授权后重新检测";
            document.getElementById("cameraTxt").className = "test-box2";
          }
          if (!hasMicrophone) {
            document.getElementById("micTxt").innerHTML =
              "检测到麦克风无法正常工作";
            document.getElementById("micTxt").className = "test-box2";
          } else if (isMicrophoneAlreadyCaptured) {
            document.getElementById("micTxt").innerHTML =
              "检测到麦克风正常工作";
            document.getElementById("micTxt").className = "test-box1";
          } else {
            document.getElementById("micTxt").innerHTML =
              "检测到麦克风，但未授权浏览器使用。请授权后重新检测";
            document.getElementById("micTxt").className = "test-box2";
          }
        } else {
          //需要授权
          if (hasWebcam && (await that.GetVideo())) {
            document.getElementById("cameraTxt").innerHTML =
              "检测到摄像头正常工作";
            document.getElementById("cameraTxt").className = "test-box1";
          } else {
            document.getElementById("cameraTxt").innerHTML =
              "检测到摄像头无法正常工作";
            document.getElementById("cameraTxt").className = "test-box2";
          }
          if (hasMicrophone && (await that.GetAudio())) {
            document.getElementById("micTxt").innerHTML =
              "检测到摄像头正常工作";
            document.getElementById("micTxt").className = "test-box1";
          } else {
            document.getElementById("micTxt").innerHTML =
              "检测到麦克风无法正常工作";
            document.getElementById("micTxt").className = "test-box2";
          }
        }
        //检测网络
        that.onLine(function(flag) {
          if (flag) {
            document.getElementById("connectionTxt").innerHTML = "网络正常";
            document.getElementById("connectionTxt").className = "test-box1";
          } else {
            document.getElementById("connectionTxt").innerHTML = "网络故障"; //document.write('网络故障', "", '<br>');
            document.getElementById("connectionTxt").className = "test-box2";
          }
        });

        if (
          isChrome &&
          isConnetion &&
          isWebcamAlreadyCaptured &&
          isMicrophoneAlreadyCaptured
        ) {
        } else {
          document.getElementById("load").style.display = "none";
        }
      });
    },
    GetAudio: async function() {
      //音频授权
      if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true, video: false };
        try {
          this.streamAudio = await navigator.mediaDevices.getUserMedia(
            constraints
          );
          console.log("麦克风授权成功！");
          return true;
        } catch (error) {
          console.error("麦克风授权失败！" + error);
          return false;
        }
      } else {
        console.error("浏览器不支持 getUserMedia");
        return false;
      }
    },
    GetVideo: async function() {
      //摄像头授权
      if (navigator.mediaDevices.getUserMedia) {
        const constraints = { video: true, audio: false };
        try {
          this.streamVideo = await navigator.mediaDevices.getUserMedia(
            constraints
          );
          console.log("摄像头授权成功！");
          return true;
        } catch (error) {
          console.error("摄像头授权失败！" + error);
          return false;
        }
      } else {
        console.error("浏览器不支持 getUserMedia");
        return false;
      }
    },
    onLine: function(callback) {
      //检测网络
      var img = new Image();
      img.src = "https://www.baidu.com/favicon.ico";
      img.onload = function() {
        isConnetion = true;
        if (callback) callback(true);
      };
      img.onerror = function() {
        isConnetion = false;
        if (callback) callback(false);
      };
    }
  },
  data() {
    return {
      streamAudio: null,
      streamVideo: null
    };
  }
};
</script>
<style scoped>
@import "../assets/css/checkdevice.css";
.test-box1 {
  color: limegreen;
}
.test-box2 {
  color: red;
}
</style>