<template>
  <div class="login_container">
    <!-- 页面统一头部 -->
    <header class="clearfix" style="width:initial;">
      <div class="left">
        <img src="../static/img/logo.png" alt />
      </div>
      <div class="left">
        <span class="wht" style="display:inline-block;padding-top:5px;">智能视频面试</span>
      </div>
      <div @click="showCheckDevice=true" style="float:right;cursor:pointer;">
          <span class="wht" style="display:inline-block;padding-top:0px;">检测设备</span>
      </div>
    </header>
    <!-- 登录框 -->
    <div class="login_mainbody box_shadow">
      <div class="login_title">欢迎进入面试环节</div>
      <div class="input_box">
        <input type="unmber" placeholder="请输入邀请码" bindinput="bindKeyInput" v-model="authcode" />
      </div>
      <div class="login_btn">
        <button @click="authorizeLogin">开启视频面试</button>
      </div>
      <div class="warning_box">请正确填写通知信息中收到的8位面试邀请码</div>
    </div>

    <el-dialog title="检测设备" v-if="showCheckDevice" :visible.sync="showCheckDevice" width="50%">
      <CheckDevice />
      <div class="modal_button mt_20" style="text-align: center;margin-top: 20px;">
        <el-button style="background-color:#4c8cf8" type="primary" @click="showCheckDevice = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CheckDevice from "./CheckDevice";

export default {
  name: "Login",
  props: [],
  components: { CheckDevice },
  data() {
    return {
      authcode: "",
      showCheckDevice: false
    };
  },
  created() {},
  methods: {
    authorizeLogin: async function() {
      if (!this.$router.currentRoute.query.CtmID) {
        this.$message({
          message: "登录链接异常，请联系管理员",
          type: "warning"
        });
        return;
      }
      if (this.authcode.length == 0) {
        this.$message({
          message: "请输入登录邀请码",
          type: "warning"
        });
        return;
      }
      try {
        let res = await this.$http({
          method: "POST",
          url: this.$apiAddress.authorizecodelogin,
          data: {
            authorizecode: this.authcode,
            ctmid: this.$router.currentRoute.query.CtmID
          }
        });
        if (res.data.resCode == "-1002") {
          this.$message({
            message: "邀请码错误",
            type: "warning"
          });
          return;
        }
        if (res.data.resCode == "-1004") {
          this.$message({
            message: "您当前无法进入面试房间，面试间已过期或面试已结束",
            type: "warning"
          });
          return;
        }
        let userInfo;
        if (res.data.data[0].InterviewJobseekerID) {
          userInfo = {
            username: res.data.data[0].InterviewJobseekerName,
            userroom: res.data.data[0].InterviewRoomNum,
            roomguid: res.data.data[0].InterviewRoomID.toLowerCase(),
            systemtype: res.data.data[0].SystemType,
            userid: res.data.data[0].InterviewJobseekerID.toLowerCase(),
            usertype: "1",
            usersig: res.data.data[0].UserSig,
            sdkappid: res.data.data[0].SDKAppID
          };
        } else {
          let usertype = "2";
          if (
            res.data.data[0].IsMaster.toLowerCase() == "true" ||
            res.data.data[0].IsMaster.toLowerCase() == "1"
          ) {
            usertype = "0";
          }
          userInfo = {
            username: res.data.data[0].InterviewerName,
            userroom: res.data.data[0].InterviewRoomNum,
            roomguid: res.data.data[0].InterviewRoomID.toLowerCase(),
            systemtype: res.data.data[0].SystemType,
            userid: res.data.data[0].InterviewerID.toLowerCase(),
            usertype: usertype,
            usersig: res.data.data[0].UserSig,
            sdkappid: res.data.data[0].SDKAppID
          };
        }
        localStorage.setItem("userinfo", JSON.stringify(userInfo));
        localStorage.setItem("ctmid", this.$router.currentRoute.query.CtmID);
        console.log(userInfo.username);
        //200303 jason commentout
        // //获取房间内人物列表
        // let resInterviewerList = await this.$http({
        //   method: "post",
        //   url: this.$apiAddress.searchinterviewersbyroomid,
        //   data: {
        //     interviewroomid: res.data.data[0].InterviewRoomID,
        //     systemtype: res.data.data[0].SystemType,
        //     timestamp: Math.floor(Date.now() / 1000)
        //   }
        // });
        // let interviewerlist = resInterviewerList.data.data.sort((cur, nxt) =>
        //   cur.interviewername <= nxt.interviewername ? -1 : 1
        // );
        // localStorage.setItem(
        //   "interviewerlist",
        //   JSON.stringify(interviewerlist)
        // );
        // let resJobSeekerList = await this.$http({
        //   method: "post",
        //   url: this.$apiAddress.searchjobseekersbyroomid,
        //   data: {
        //     interviewroomid: res.data.data[0].InterviewRoomID,
        //     systemtype: res.data.data[0].SystemType,
        //     timestamp: Math.floor(Date.now() / 1000)
        //   }
        // });
        // var JobSeeker = resJobSeekerList.data.data.find(x=>x.userType==1 && x.userID==userInfo.userid && x.linkStatus == "7");
        // if(JobSeeker)
        // {
        //   this.$message({
        //     message: "您的视频面试已结束，感谢您的参与！",
        //     type: "warning"
        //   });
        //   return;
        // }
        // let jobSeekerlist = resJobSeekerList.data.data.sort((cur, nxt) =>
        //   cur.starttime <= nxt.starttime ? -1 : 1
        // );
        // localStorage.setItem("jobseekerlist", JSON.stringify(jobSeekerlist));
        //200303 jason commentout

        await this.$commonjs.refreshList(this);
        this.$router.push({
          path: "/interview"
        });
      } catch (err) {
        console.log(err);
      }
      // let url = "../videocall/videocall";
      // if (this.template === "grid") {
      //   url = "../meeting/meeting";
      // } else if (this.template === "customGrid") {
      //   url = `../interview/interview?name=${this.username}&id=${this.userid}&type=${this.usertype}&room=${this.userroom}&roomguid=${this.roomguid}&systemtype=${this.systemtype}`;
      // }
      // wx.navigateTo({
      //   url: url
      // });
    }
  }
};
</script>
<style scoped>
/**index.wxss**/

.container {
  background-image: url(https://mc.qcloudimg.com/static/img/7da57e0050d308e2e1b1e31afbc42929/bg.png);
  background-color: #333;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.container .title {
  color: #ffffff;
  padding-top: 32.5px;
  line-height: 30px;
}
.wrapper {
  padding-top: 10vh;
  border-box: box-sizing;
  width: 100%;
}

.choice-content {
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #ffffff;
}
.single-wrapper {
  width: 100px;
}
.choice-content .preview-item {
  margin-top: 10px;
  height: 105px;
  box-sizing: border-box;
  border: 2px solid rgba(0, 110, 255, 0);
}

.choice-content .preview-item.selected {
  border: 2px solid rgba(0, 110, 255, 0.5);
}
.choice-content .preview-item image {
  width: 100%;
  height: 100%;
}
.choice-content radio {
  color: #006eff;
}
.choice-content switch {
  color: #006eff;
  transform: scale(0.8);
}
.choice-content .radio-group-no-box {
  display: inline-block;
  color: #006eff;
  background-color: #ffffff;
  border: 1px solid #006eff;
  border-radius: 4px;
  margin-left: 5px;
}
.choice-content label {
  display: flex;
  justify-content: space-between;
}
.choice-content .radio-group-no-box .radio-item {
  padding: 3px 8px;
  text-align: center;
  border-right: 1px solid #006eff;
  display: inline-block;
}
.choice-content .radio-group-no-box .radio-item:last-child {
  border-right: none;
}
.choice-content .radio-group-no-box .radio-item.selected {
  color: #ffffff;
  background-color: #006eff;
}
.choice-content .radio-group-no-box radio {
  display: none;
}
.bottom-btn {
  position: fixed;
  width: 100vw;
  text-align: center;
  bottom: 5vh;
}
.bottom-btn button {
  width: 80%;
  background-color: #006eff;
  border-radius: 50px;
}
</style>
