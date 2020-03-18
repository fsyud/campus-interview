<template>
<div class="endpage_container">
    <!-- begin -->
    <!-- 页面统一头部 -->
    <header class="clearfix">
      <div class="lft">
        <img src="../static/img/logo.png" alt />
      </div>
      <div class="top_border pr_mt10"></div>
      <div class="left">
        <div class="wht">智能视频面试</div>
      </div>
      <div class="clearfix top_right">
        <span class="top_avatar">
          <img src="../static/img/avatar.png" id="ucTopMenu_imgAvatar" />
        </span>
        <span class="top_name">
          <span id="ucTopMenu_lblUserName" class="wht">{{this.userinfo.username}}</span>
        </span>
        <i class="top_xiala"></i>
        <div class="top_xiala_con">
          <ul>
            <li>
              <a class="red" style="color: black" @click="logout">退出系统</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main>
        <div class="invite_start_con">
            <!-- 填写信息前后的样式在此处加con_content_nowrite控制， 填写完整则不加，未填写或者不完整则加类名con_content_nowrite-->
            <div class="con_content_end">
                <div class="con_logo_end">
                    <img src="../static/img/invite_icon.png" alt="">
                </div>
                <div class="con_font">本场面试已顺利完成！</div>
                <div>
                <p class="con_warn mt30">请您保持手机的畅通以及邮箱正常接收邮件，面试结果将通过</p>
                <p class="con_warn">电话、短信、邮件等方式进行通知，请注意查收，谢谢！</p></div>
            </div>
            <div class="invite_footer">
                <p>Copyright © www.51job.com, All Rights Reserved.</p>
                <p></p>
                </div>
        </div>
    </main>
</div>
</template>
<script>
export default {
  name: "Endpage",
  components: {},
  created: async function() {
    let that = this;
    if (!localStorage.getItem("userinfo")) {
      this.goback();
      return;
    }
    that.userinfo = JSON.parse(localStorage.getItem("userinfo"));
  },
  methods: {
      logout: function() {
      this.$confirm("您确定要退出吗?", "退出在线面试平台", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.leaveRoomToServer();
          let ctmid = localStorage.getItem("ctmid");
          localStorage.removeItem("userinfo");
          if (ctmid) {
            this.$router.push({
              path: "/login?CtmID=" + ctmid
            });
          } else {
            this.$router.push({
              path: "/login"
            });
          }
          return;
        })
        .catch(() => {});
    },
    leaveRoomToServer: async function() {
      let resEnterRoom = await this.$http({
        method: "POST",
        url: this.$apiAddress.leaveroom,
        data: {}
      });
    },
    goback: function() {
      let ctmid = localStorage.getItem("ctmid");
      if (ctmid) {
        this.$router.push({
          path: "/login?CtmID=" + ctmid
        });
      } else {
        this.$router.push({
          path: "/login"
        });
      }
    }
  },
  data() {
    return {
        userinfo: {}
        };
    }
  };
</script>
</script>