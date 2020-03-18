<template>
  <div class="homepage_container" @click="hideHover">
    <el-dialog
      title="提示"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @close="hideBigModal"
      width="90%"
    >
      <div class="body_middle">
        <div class="video_box">
          <template v-for="jobseeker in jobseekerlistonline" style>
            <div
              class="jobseeker-grid"
              :key="jobseeker.userID"
              :id="jobseeker.userID==userinfo.userid?'local_stream':'remote-'+jobseeker.userID"
            >
              <div
                class="icons_box jobseeker_icons_box"
                style=""
              >
                <span class="jobseeker-video-name">{{jobseeker.userName}}</span>
                <img
                  src="../static/img/icon_microphone_white.png"
                  alt
                  :style="{borderRadius:'100px',backgroundImage:'url('+greenBgImg+')',backgroundRepeat:'no-repeat',backgroundPosition:audioLevel[jobseeker.userID]?audioLevel[jobseeker.userID]:'0px 100px'}"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideBigModal">取 消</el-button>
        <el-button type="primary" @click="hideBigModal">确 定</el-button>
      </span>
    </el-dialog>
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
            <!-- <a id="ucTopMenu_lnkbtnLogout" class="red" href="javascript:__doPostBack('ucTopMenu$lnkbtnLogout','')" style="color: black">退出系统</a></li> -->
          </ul>
        </div>
      </div>
    </header>
    <!-- 页面主体部分 -->
    <main>
      <!-- 主体header -->
      <div class="mainbody_top clearfix">
        <div class="top_list left">
          <img src="../static/img/icon_room.png" alt />
          <span class="fc_777">面试房间：</span>
          <span class="fc_444">{{roomname}}</span>
        </div>
        <div class="top_list left">
          <img src="../static/img/icon_time.png" alt />
          <span class="fc_777">面试时间：</span>
          <span class="fc_444">{{interviewtime}}~{{interviewendtime}}</span>
        </div>
        <div class="top_list left" @click="showHover">
          <img src="../static/img/icon_history.png" alt style="cursor:pointer;" />
          <span class="fc_777" style="cursor:pointer;">已面试人数：</span>
          <span class="fc_444">{{jobseekerlistfinished?jobseekerlistfinished.length:0}}</span>
          <div class="hover_list_box" v-if="userinfo.usertype=='0' || userinfo.usertype=='2'">
            <div class="box_title">
              <img src="../static/img/icon_history.png" alt />已面试人数：
              <strong>{{jobseekerlistfinished?jobseekerlistfinished.length:0}}</strong>
            </div>
            <ul class="box_content">
              <li v-for="(item) in jobseekerlistfinished" :key="item.userID">
                {{item.userName}}
                <img
                  src="../static/img/icon_evaluate.png"
                  class="mr_8"
                  alt
                  title="评分"
                  style="cursor:pointer;"
                  :data-userid="item.userID"
                  :data-username="item.userName"
                  @click="showComment"
                />
                <template>
                  <el-popconfirm
                    v-if="userinfo.usertype=='0'"
                    :title="`是否将${item.userName}移回等待队列？`"
                    @onConfirm="backInQueue(item.userID,item.userName)"
                  >
                    <img
                      src="../static/img/icon_sort.png"
                      alt
                      slot="reference"
                      class="mr_8"
                      style="cursor:pointer;"
                      title="移回等待"
                    />
                  </el-popconfirm>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 主体三分部分 -->
      <div class="mainbody">
        <!-- 左侧面板 -->
        <div class="body_left box_shadow">
          <div class="waiting_list_box">
            <h3>正在面试人员</h3>
            <!-- <p class="empty_text">请添加面试人员</p> -->
            <div class="waiting_list paddLeft" v-if="userinfo.usertype=='1'">
              <div class="single_line" v-for="(item) in jobseekerlistonline" :key="item.userID">
                <span :class="[item.isInRoom==true?'circle bg_4c8cf8':'circle']"></span>
                <span
                  class="single_detaile" :title="item.userName"
                >{{item.userName}}</span><span class="single_detaile2">{{item.isSelf?"(本人)":""}}{{item.isInRoom?"(在线)":""}}{{item.linkStatus=="4"?"(已暂停)":''}}</span>
                <span class="edit_btns">
                  <!-- <img src="../static/img/icon_evaluate.png" alt class="mr_8" />
                  <img src="../static/img/icon_sort.png" alt />-->
                </span>
              </div>
            </div>
            <div class="waiting_list paddLeft" v-else>
              <div
                style="cursor:pointer;"
                class="single_line"
                v-for="(item) in jobseekerlistonline"
                :key="item.userID"
                @click="showHover"
              >
                <span :class="[item.isInRoom==true?'circle bg_4c8cf8':'circle']"></span>
                <span
                  class="single_detaile" :title="item.userName"
                >{{item.userName}}</span><span class="single_detaile2">{{item.isSelf?"(本人)":""}}{{item.isInRoom?"(在线)":""}}{{item.linkStatus=="4"?"(已暂停)":''}}</span>
                <span class="edit_btns">
                  <img
                    src="../static/img/icon_resume.png"
                    alt
                    title="查看简历"
                    class="mr_8"
                    :data-userid="item.userID"
                    :data-username="item.userName"
                    @click="showResume"
                  />
                  <!-- <img src="../static/img/icon_sort.png" alt />-->
                </span>
                <span class="edit_btns">
                  <img
                    src="../static/img/icon_evaluate.png"
                    alt
                    class="mr_8"
                    :data-userid="item.userID"
                    :data-username="item.userName"
                    @click="showComment"
                  />
                  <!-- <img src="../static/img/icon_sort.png" alt />-->
                </span>
                <img
                  class="mr_8"
                  src="../static/img/icon_microphone_white_square.png"
                  alt
                  :style="{backgroundImage:'url('+greenBgImg+')',backgroundRepeat:'no-repeat',backgroundPosition:audioLevel[item.userID]?audioLevel[item.userID]:'0px 100px',width:'25px',verticalAlign:'middle',backgroundColor:'black',position:'absolute',right:'0px',bottom:'5px'}"
                />

                <!-- hover效果框 -->
                <div class="hover_box" v-if="userinfo.usertype=='0'">
                  <div class="line_height28">
                    <span class="circle bg_4c8cf8"></span>
                    <span
                      class="single_detaile" :title="item.userName"
                    >{{item.userName}}</span><span class="single_detaile2">{{item.isSelf?"(本人)":""}}{{item.isInRoom?"(在线)":""}}{{item.linkStatus=="4"?"(已暂停)":''}}</span>
                    <span class="edit_btns">
                      <img
                        src="../static/img/icon_resume.png"
                        alt
                        title="查看简历"
                        class="mr_8"
                        :data-userid="item.userID"
                        :data-username="item.userName"
                        @click="showResume"
                      />
                      <!-- <img src="../static/img/icon_sort.png" alt />-->
                    </span>
                    <span class="edit_btns">
                      <img
                        src="../static/img/icon_evaluate.png"
                        alt
                        class="mr_8"
                        :data-userid="item.userID"
                        :data-username="item.userName"
                        @click="showComment"
                      />
                      <!-- <img src="../static/img/icon_sort.png" alt />-->
                    </span>
                  </div>
                  <div class="operate_btns line_height28">
                    <template>
                      <el-popconfirm
                        :title="`是否将${item.userName}移回等待队列？`"
                        @onConfirm="backInQueue(item.userID,item.userName)"
                      >
                        <span slot="reference" class="operate_btn">
                          <img
                            src="../static/img/icon_bottom.png"
                            alt
                            style="width:100%;height:100%"
                          />
                          <span class="expand_btn">
                            <img src="../static/img/icon_bottom_hover.png" alt />
                            等待
                          </span>
                        </span>
                      </el-popconfirm>
                    </template>
                    <template>
                      <el-popconfirm
                        :title="`是否完成${item.userName}的面试？`"
                        @onConfirm="endInterview(item.userID,item.userName)"
                      >
                        <span slot="reference" class="operate_btn">
                          <img src="../static/img/icon_add.png" alt style="width:100%;height:100%" />
                          <span class="expand_btn">
                            <img src="../static/img/icon_add_hover.png" alt />
                            结束
                          </span>
                        </span>
                      </el-popconfirm>
                    </template>
                    <!-- <span
                      class="operate_btn"
                      :data-userid="item.userID"
                      :data-username="item.userName"
                      @click="showComment"
                    >
                       <img src="../static/img/icon_down.png" alt style="width:100%;height:100%" />
                      <span class="expand_btn">
                        <img src="../static/img/icon_down_hover.png" alt />
                        评价
                      </span> 
                    </span>-->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="waiting_list_box">
            <h3>
              等待面试人员
              <a
                href="javascript:void(0);"
                @click="refreshList"
                v-if="userinfo.usertype=='0'"
              >刷新</a>
            </h3>
            <div class="waiting_list paddLeft">
              <div v-if="userinfo.usertype=='1'">
                <div class="single_line" v-for="(item) in jobseekerlist" :key="item.userID">
                  <span :class="[item.isInRoom==true?'circle bg_4c8cf8':'circle']"></span>
                  <span
                    class="single_detaile" :title="item.userName"
                  >{{item.userName}}</span><span class="single_detaile2">{{item.isSelf?"(本人)":""}}{{item.isInRoom?"(在线)":""}}</span>
                  <span class="edit_btns">
                    <!-- <img src="../static/img/icon_evaluate.png" alt class="mr_8" />
                    <img src="../static/img/icon_sort.png" alt />-->
                  </span>
                </div>
              </div>
              <div v-else>
                <div
                  style="cursor:pointer;"
                  class="single_line"
                  v-for="(item) in jobseekerlist"
                  :key="item.userID"
                  @click="showHover"
                >
                  <span :class="[item.isInRoom==true?'circle bg_4c8cf8':'circle']"></span>
                  <span
                    class="single_detaile" :title="item.userName"
                  >{{item.userName}}</span><span class="single_detaile2">{{item.isSelf?"(本人)":""}}{{item.isInRoom?"(在线)":""}}</span>
                  <span class="edit_btns">
                    <img
                      src="../static/img/icon_resume.png"
                      alt
                      title="查看简历"
                      class="mr_8"
                      :data-userid="item.userID"
                      :data-username="item.userName"
                      @click="showResume"
                    />
                    <!-- <img src="../static/img/icon_sort.png" alt />-->
                  </span>
                  <span class="edit_btns">
                    <img
                      src="../static/img/icon_evaluate.png"
                      alt
                      class="mr_8"
                      :data-userid="item.userID"
                      :data-username="item.userName"
                      @click="showComment"
                    />
                    <!-- <img src="../static/img/icon_sort.png" alt />-->
                  </span>
                  <!-- hover效果框 -->
                  <div class="hover_box" v-if="userinfo.usertype=='0'">
                    <div class="line_height28">
                      <span :class="[item.isInRoom==true?'circle bg_4c8cf8':'circle']"></span>
                      <span
                        class="single_detaile" :title="item.userName"
                      >{{item.userName}}</span><span class="single_detaile2">{{item.isSelf?"(本人)":""}}{{item.isInRoom?"(在线)":""}}</span>
                      <span class="edit_btns">
                        <img
                          src="../static/img/icon_resume.png"
                          alt
                          title="查看简历"
                          class="mr_8"
                          :data-userid="item.userID"
                          :data-username="item.userName"
                          @click="showResume"
                        />
                        <!-- <img src="../static/img/icon_sort.png" alt />-->
                      </span>
                      <span class="edit_btns">
                        <img
                          src="../static/img/icon_evaluate.png"
                          alt
                          class="mr_8"
                          :data-userid="item.userID"
                          :data-username="item.userName"
                          @click="showComment"
                        />
                        <!-- <img src="../static/img/icon_sort.png" alt />-->
                      </span>
                    </div>
                    <div class="operate_btns line_height28">
                      <template>
                        <el-popconfirm
                          :title="`是否开始${item.userName}的面试？`"
                          @onConfirm="startInterview(item.userID,item.userName)"
                          v-if="item.isInRoom"
                        >
                          <span slot="reference" class="operate_btn" :data-userid="item.userID">
                            <img
                              src="../static/img/icon_stick.png"
                              alt
                              style="width:100%;height:100%"
                            />
                            <span class="expand_btn">
                              <img src="../static/img/icon_stick_hover.png" alt />
                              面试
                            </span>
                          </span>
                        </el-popconfirm>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 中间视频面板 -->
        <div class="body_middle box_shadow">
          <div class="video_box" v-if="!dialogVisible">
            <!-- 视频界面 -->
            <!-- jason:本人推送流求职者 -->
            <!-- <div v-if="userinfo.usertype === '1'" id="local_stream" class="jobseeker-grid"></div> -->
            <!-- jason:本人推送流求职者 -->

            <!-- jason:求职者远程流 -->

            <template v-for="jobseeker in jobseekerlistonline" style>
              <div
                class="jobseeker-grid"
                :key="jobseeker.userID"
                :id="jobseeker.userID==userinfo.userid?'local_stream':'remote-'+jobseeker.userID"
              >
                <template v-if="userinfo.usertype!='1' || (userinfo.usertype=='1' && jobseeker.userID==userinfo.userid)">
                  <div
                    class="icons_box jobseeker_icons_box"
                    style=""
                  >
                    <span class="jobseeker-video-name">{{jobseeker.userName}}</span>
                    <template v-if="(userinfo.usertype=='1' && jobseeker.userID==userinfo.userid)">
                      <img
                        v-if="turnaudio"
                        @click="closeaudio"
                        class="mr_8"
                        src="../static/img/icon_microphone_white.png"
                        alt
                        :style="{borderRadius:'100px',backgroundImage:'url('+greenBgImg+')',backgroundRepeat:'no-repeat',backgroundPosition:audioLevel[userinfo.userid]?audioLevel[userinfo.userid]:'0px 100px'}"
                      />
                      <img
                        v-if="!turnaudio"
                        @click="openaudio"
                        class="mr_8"
                        src="../static/img/icon_microphone_forbid.png"
                        alt
                      />
                      <img
                        v-if="turnvideo"
                        @click="closevideo"
                        src="../static/img/icon_camera_white.png"
                        alt
                      />
                      <img
                        v-if="!turnvideo"
                        @click="openvideo"
                        src="../static/img/icon_camera_forbid.png"
                        alt
                      />
                    </template>              
                  </div>
                </template>    
              </div>
            </template>
            <!-- <template v-if="trtcClient && trtcClient.remoteStreams_">
              <template v-for="jobseeker in jobseekerlistonline" style>
                <template v-for="item in trtcClient.remoteStreams_">
                  <div
                    class="jobseeker-grid"
                    :key="item.getUserId()"
                    :id="'remote-'+item.getUserId()"
                    v-if="jobseeker.isInRoom && item.getUserId()==jobseeker.userID"
                  ></div>
                </template>
              </template>
            </template>-->
            <!-- jason:求职者远程流 -->
            <!-- <img src="../static/img/camera.png" alt />
            <p class="empty_text fs_14">面试未开始</p>-->
            <!-- 摄像头麦克风脚标 -->
            <!-- <div class="icons_box" v-if="userinfo.usertype=='1'">
              <img
                v-if="turnaudio"
                @click="closeaudio"
                class="mr_8"
                src="../static/img/icon_microphone_white.png"
                alt
                :style="{borderRadius:'100px',backgroundImage:'url('+greenBgImg+')',backgroundRepeat:'no-repeat',backgroundPosition:audioLevel[userinfo.userid]?audioLevel[userinfo.userid]:'0px 100px'}"
              />
              <img
                v-if="!turnaudio"
                @click="openaudio"
                class="mr_8"
                src="../static/img/icon_microphone_forbid.png"
                alt
              />
              <img
                v-if="turnvideo"
                @click="closevideo"
                src="../static/img/icon_camera_white.png"
                alt
              />
              <img
                v-if="!turnvideo"
                @click="openvideo"
                src="../static/img/icon_camera_forbid.png"
                alt
              />
            </div> -->
          </div>
          <div class="bottom_videos_list clearfix" style="height:120px">
            <div class="left" v-if="userinfo.usertype === '0' || userinfo.usertype === '2'">
              <!-- jason:本人推送流面试官 -->
              <div class="interviewer_video">
                <div id="local_stream" style="height: 100%;"></div>
                <div class="icons_box">
                  <img
                    v-if="turnaudio"
                    @click="closeaudio"
                    class="mr_8"
                    src="../static/img/icon_microphone_white.png"
                    alt
                    :style="{borderRadius:'100px',backgroundImage:'url('+greenBgImg+')',backgroundRepeat:'no-repeat',backgroundPosition:audioLevel[userinfo.userid]?audioLevel[userinfo.userid]:'0px 100px'}"
                  />
                  <img
                    v-if="!turnaudio"
                    @click="openaudio"
                    class="mr_8"
                    src="../static/img/icon_microphone_forbid.png"
                    alt
                  />
                  <img
                    v-if="turnvideo"
                    @click="closevideo"
                    src="../static/img/icon_camera_white.png"
                    alt
                  />
                  <img
                    v-if="!turnvideo"
                    @click="openvideo"
                    src="../static/img/icon_camera_forbid.png"
                    alt
                  />
                </div>
              </div>
              <p style="text-align:center;margin:8px 15px 0px 0px;">
                <span class="fc_777" style="display:inline-block;vertical-align: bottom;">考官:</span>
                <span class="fc_444 interviewer_name">{{userinfo.username}}</span>
              </p>
            </div>
            <!-- jason:本人推送流面试官 -->
            <!-- jason:面试官远程流 -->
            <div v-for="item in interviewerlist" :key="item.userID" style>
              <!-- width:120px;height:90px;display:inline-block;margin-right:15px -->
              <div class="left">
                <div
                  class="interviewer_video"
                  style="width:120px;height:90px;display:inline-block;margin-right:15px;"
                  v-if="((userinfo.usertype=='0' || userinfo.usertype=='2') && userinfo.userid!= item.userID) || userinfo.usertype=='1'"
                >
                  <div :id="'remote-'+item.userID" style="width:120px;height:90px"></div>
                  <div class="icons_box">
                    <img
                      src="../static/img/icon_microphone_white.png"
                      alt
                      :style="{borderRadius:'100px',backgroundImage:'url('+greenBgImg+')',backgroundRepeat:'no-repeat',backgroundPosition:audioLevel[item.userID]?audioLevel[item.userID]:'0px 100px'}"
                    />
                  </div>
                </div>
                <p
                  style="text-align:center;margin:4px 15px 0px 0px;"
                  v-if="((userinfo.usertype=='0' || userinfo.usertype=='2') && userinfo.userid!= item.userID) || userinfo.usertype=='1'"
                >考官：{{item.userName}}</p>
              </div>

              <!-- 
              <div v-if="trtcClient && trtcClient.remoteStreams_" style="width:120px;height:90px">
                <div v-for="(item) in trtcClient.remoteStreams_" :key="item.getUserId()" style>
                  <div class="left">
                    <div
                      class="interviewer_video"
                      v-if="interviewer.isInRoom && item.getUserId()==interviewer.userID"
                      style="width:120px;height:90px"
                    >
                      <div :id="'remote-'+item.getUserId()" style="width:120px;height:90px"></div>
                    </div>
                  </div>
                </div>
              </div>-->
            </div>
            <!-- jason:面试官远程流 -->
          </div>
          <div class="bottom_btns">
            <button
              v-if="userinfo.usertype === '0' && jobseekerlistonline && jobseekerlistonline.length>0"
              class="bg_fc8339"
              @click="pauseContinueInterview"
            >{{isInterviewPaused?"继续":"暂停"}}</button>
            <!-- <button>开启面试</button> -->
            <!-- <button>下一位</button> -->
            <button
              @click="showCommentList"
              v-if="userinfo.usertype === '0' || userinfo.usertype === '2'"
            >查看评分</button>
            <!-- <button
              @click="showBigModal"
              v-if="userinfo.usertype === '0' || userinfo.usertype === '2'"
            >大屏显示</button> -->
          </div>
        </div>
        <!-- 右侧面板 -->
        <div class="body_right box_shadow">
          <div class="box_title" @click="switchTab">
            <h3 class="box_title_left" ref="box_title_left" v-if="userinfo.usertype=='1'">注意事项</h3>
            <h3
              style=" padding-left: 8px;width: calc(50% - 8px);"
              class="box_title_left"
              ref="box_title_left"
              v-else-if="isShowComment"
              :title="'对'+targetjobseeker.username+'进行评分'"
            >对{{targetjobseeker.username}}进行评分</h3>
            <h3 class="box_title_left" ref="box_title_left" v-else>评分</h3>
            <h3 class="box_title_right box_unselected" ref="box_title_right">实时聊天</h3>
          </div>
          <div class="box_right hidden" ref="box_right">
            <div class="message-box" ref="message-box">
              <template v-for="(message,index) in CurrentMessageList">
                <div :key="index" v-if="message.payload.data&&message.payload.data!='group_create'">
                  <div>
                    <span
                      class="circle"
                      :style="{'background-color':message.payload.extension === '0'?'#41DB16':'#0095ff'}"
                    ></span>
                    <span class="txtfrom">{{message.payload.description}}</span>
                  </div>
                  <span class="txtmessage">{{message.payload.data}}</span>
                  <span class="txtsplit" v-if="index<CurrentMessageList.length-1"></span>
                </div>
              </template>
            </div>
            <div>
              <textarea
                class="message-content"
                v-model="messageContent"
                @keydown.enter.exact.prevent="handleEnter"
                placeholder="可以随时聊天沟通"
              ></textarea>
              <div class="btn-send" @click="sendTextMessage">发送</div>
            </div>
          </div>
          <div class="box_left" ref="box_left" v-if="userinfo.usertype=='1'">
            <p>面试过程中，眼睛要直视对方，目光游移不定会影响面试官对你的信赖，要注意口齿清晰，做到思维有条理。</p>
            <p>1、准备。</p>
            <p>准备一个摄像头和一个耳麦；如果使用麦克风和音箱，在使用中，别把麦克风对着音箱，否则会产生回音，二者的距离最好稍远一点。不要让强光直接对着摄像头的镜头，应该采用柔和一点的明亮的灯光。</p>
            <p>2、服饰准备。</p>
            <p>虽然视频面试通过视频进行的，但着装仍然很重要。要做到干净整洁、朴实大方、和谐得体。</p>
            <p>3、谈吐要礼貌，要充分展示自我，作好自我介绍。</p>
          </div>
          <div class="box_left" ref="box_left" v-else-if="isShowComment">
            <div class="rate_content clear">
              <template v-for="(evaluation,index) in targetjobseekerEvalList">
                <h4 :key="index">{{evaluation.evaluationfieldname}}</h4>
                <input
                  :key="'evaltext'+index"
                  type="text"
                  v-model="evaluation.evaluationfieldvalue"
                  v-if="evaluation.evaluationfieldtype=='1'"
                />
                <textarea
                  :key="'evaltextarea'+index"
                  cols="30"
                  rows="10"
                  v-model="evaluation.evaluationfieldvalue"
                  v-else-if="evaluation.evaluationfieldtype=='0'"
                ></textarea>
                <div
                  class="tags clearfix"
                  :key="'evaldiv'+index"
                  v-else-if="evaluation.evaluationfielddict&&evaluation.evaluationfieldtype=='2'"
                >
                  <template v-for="(fielddict,index) in evaluation.evaluationfielddict.split('|')">
                    <label
                      :key="'fieldlbl'+index"
                      :for="fielddict"
                      :class="''+evaluation.evaluationfieldvalue==fielddict?'tag left active':'tag left'"
                      @click="handleRadio"
                      ref="fielddictradio"
                    >{{fielddict}}</label>
                    <input
                      :key="'fieldradio'+index"
                      type="radio"
                      name="fielddict"
                      :id="fielddict"
                      class="hidden"
                      :value="fielddict"
                      v-model="evaluation.evaluationfieldvalue"
                    />
                  </template>
                </div>
              </template>
              <div>
                <div style="float:left;line-height:37px;color:grey;margin-left:10px;cursor:pointer"
                  @click="isShowComment = false"
                >暂不评分</div>
              <div class="submit_btn" @click="makeComment">
                <button style="cursor:pointer">提交评分</button>
              </div>
              </div>
            </div>
          </div>
          <div class="box_left" ref="box_left" v-else>
            <!-- <p>面试即将开始，请您做好准备！</p>
            <p>1、设备准备。</p>
            <p>准备一个摄像头和一个耳麦；如果使用麦克风和音箱，在使用中，别把麦克风对着音箱，否则会产生回音，二者的距离最好稍远一点。不要让强光直接对着摄像头的镜头，应该采用柔和一点的明亮的灯光。</p>
            <p>2、面试准备。</p>
            <p>为保证面试顺利进行，请您注意面试时间，面试过程中，注意观察求职者的各项表现，秉着公平、公正、客观的态度，为每一位应聘者评价。</p>-->
            <div
              class="rate_content"
              style="position: absolute;top: 50%;left: 50%;transform: translate(-50% , -100%);font-size: 14px;color: #969798;"
            >
              <img src="../static/img/null.png" alt style="padding-left: 20px;" />
              <p style="height: 30px;line-height: 30px;padding-left: 30px;">请添加面试人员</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- end -->
    <!-- 查看评分 -->
    <div class="mask_tips_watch_grade dn" v-if="isShowCommentList==='1'">
      <div class="mt_head_title">
        <div class="mth_border mth_watch_grade">查看评分</div>
      </div>
      <div style="height:300px;width:560px;">
        <el-table   highlight-current-row height="50" style="width:100%">
          <el-table-column label="学生姓名" width="112">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.interviewername"
                placeholder="请输入内容"
                v-show="!scope.row.showEdit"
              ></el-input>
              <span v-show="scope.row.showEdit">{{scope.row.interviewername}}</span>
            </template>
          </el-table-column>
          <el-table-column  width="112" v-for="(item) in commentHeadColmnsList.split('|')" :key="item" :label="item">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row[item]"
                placeholder="请输入内容"
                v-show="!scope.row.showEdit"
              ></el-input>
              <span v-show="scope.row.showEdit">{{scope.row[item]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="" width="112">
            <template slot-scope="scope">
              <img
                src="../static/img/modify.png"
                alt
                v-show="scope.row.showEdit"
                style="padding-left: 35px;"
                @click="handleEdit(scope.$index, scope.row)"
              />
              <img
                class="dn"
                src="../static/img/determine.png"
                alt
                v-show="!scope.row.showEdit"
                style="padding-left: 35px;"
                @click="saveEdit(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <el-table :data="commentList"  highlight-current-row height="250" style="width:100%" :show-header="false">
          <el-table-column label="学生姓名" width="112">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.interviewername"
                placeholder="请输入内容"
                v-show="!scope.row.showEdit"
              ></el-input>
              <span v-show="scope.row.showEdit">{{scope.row.interviewername}}</span>
            </template>
          </el-table-column>
          <el-table-column  width="112" v-for="(item) in commentBodyColmnsList.split('|')" :key="item" :label="item">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row[item]"
                placeholder="请输入内容"
                v-show="!scope.row.showEdit"
              ></el-input>
              <span v-show="scope.row.showEdit">{{scope.row[item]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="" width="112">
            <template slot-scope="scope">
              <img
                src="../static/img/modify.png"
                alt
                v-show="scope.row.showEdit"
                style="padding-left: 35px;"
                @click="handleEdit(scope.$index, scope.row)"
              />
              <img
                class="dn"
                src="../static/img/determine.png"
                alt
                v-show="!scope.row.showEdit"
                style="padding-left: 35px;"
                @click="saveEdit(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      
      </div>
      <div class="mt_footer mt_watch_footer">
        <button @click="freshCommentList" class="btn_blue mt_btn_continue l">刷新</button>
        <button @click="hideCommentList" class="btn_blue mt_btn_quit l">关闭</button>
      </div>
    </div>
    <div class="mask_tips_end_view mask_tips_one" v-if="isShowCommentList==='0'">
      <div class="mt_head_title">
        <div class="mth_border">查看评分</div>
      </div>
      <div class="mt_contain_info">
        <img src="../static/img/icon_caution.png" alt style="height:60px" />
        <p>尚未对面试者进行评分！</p>
      </div>
      <div class="mt_footer">
        <div class="btn_blue mt_btn_back l" @click="hideCommentList">返回</div>
      </div>
    </div>
    <!-- 查看评分 -->
    <!-- 提交成功提示信息 -->
    <div class="mask_tips_end_view mask_tips_one" v-if="isShowSubmitResult">
      <div class="mt_head_title">
        <div class="mth_border">提交评价结果</div>
      </div>
      <div class="mt_contain_info">
        <img src="../static/img/icon_finish.png" alt style="height:60px" />
        <p>提交成功！</p>
      </div>
    </div>

    <el-dialog title="面试房间提示" :visible.sync="showPauseDialog" width="30%">
      <div>面试官暂停了面试，请您耐心等候，谢谢！</div>
      <div style="color:darkgrey;padding-top:10px">请不要离开面试房间</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showPauseDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="面试房间提示" :visible.sync="showEndDialog" width="30%">
      <div>本次面试已顺利完成，感谢您的参与</div>
      <div style="color:darkgrey;padding-top:10px">后续请留意面试结果通知</div>
      <span slot="footer" class="dialog-footer">
        <router-link to='end'><el-button type="primary" @click="showEndDialog = false">确 定</el-button></router-link>
      </span>
    </el-dialog>
  </div>
</template>
<script>
var waitingRoomTimerID;
var queryallroomuserstatusTimerID;
import greenBgImg from "../static/img/green.png";
import { Notification } from 'element-ui';
import RtcClient from "../assets/js/trtc/rtc-client";
import timClientClass from "../assets/js/tim/tim";
export default {
  name: "Homepage",
  components: {},
  beforeUpdate: function() {
    let videoBox = document.getElementsByClassName("video_box")[0];
    switch (document.getElementsByClassName("jobseeker-grid").length) {
      case 1:
      case 2:
      case 3:
        videoBox.attributes["class"].nodeValue = "video_box";
        break;
      case 4:
        videoBox.attributes["class"].nodeValue = "video_box four";
        break;
      case 5:
        videoBox.attributes["class"].nodeValue = "video_box five";
        break;
      case 6:
        videoBox.attributes["class"].nodeValue = "video_box six";
        break;
    }
  },
  created: async function() {
    let that = this;
    if (!localStorage.getItem("userinfo")) {
      this.goback();
      return;
    }
    that.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    /////判断房间信息以及判断是根据房间信息判断进入逻辑//////
    let resRoomInfo = await this.$http({
      method: "POST",
      url: this.$apiAddress.getroominfo,
      data: {
        interviewroomid: JSON.parse(localStorage.getItem("userinfo")).roomguid,
        systemtype: JSON.parse(localStorage.getItem("userinfo")).systemtype, ////////////////////res.data.data[0].SystemType,
        timestamp: Math.floor(Date.now() / 1000)
      }
    });
    var resultData = resRoomInfo.data.data.data;
    localStorage.setItem("roominfo", JSON.stringify(resultData));
    if (
      "已结束|已过期|系统判定已结束|已取消|已删除".indexOf(resultData.status) >=
      0
    ) {
      this.$message({
        message: "抱歉您本次的面试已过期，无法进入面试房间",
        type: "warning"
      });
      this.goback();
      return;
    }
    if (resultData.isjobseekerinline.toLowerCase() != "1") {
      this.$message({
        message: "当前房间类型不是排队类型，暂不支持进入！",
        type: "warning"
      });
      this.goback();

      return;
    }

    //房间名称绑定

    let roominfo = JSON.parse(localStorage.getItem("roominfo"));
    this.roomname = roominfo.roomname;
    this.interviewtime = roominfo.starttime;
    this.interviewendtime = roominfo.endtime;
    ////判断房间信息以及判断是根据房间信息判断进入逻辑/////

    this.createTimClient();
    //////所有人轮询房间中的状态列表
    queryallroomuserstatusTimerID = setInterval(() => {
      that.queryRoomStatus();
    }, 4000);
    await that.enterRoomToServer();
    await that.queryRoomStatus();
    //this.setData({ isServerDataReady: true });
    //await that.getInterviewLinkStatus();
    ///////所有人轮询房间中的状态列表
    let resLinkSig = await that.getInterviewLinkStatus();
    this.rtcclientconfig = {
      userId: resLinkSig.data.data.data.interviewerid
        ? resLinkSig.data.data.data.interviewerid
        : resLinkSig.data.data.data.jobseekerid,
      roomId: resLinkSig.data.data.data.roomnum,
      sdkAppId: resLinkSig.data.data.data.appid,
      userSig: resLinkSig.data.data.data.usersig
    };

    ///当前求职者如果面试已结束则不准进入面试间
    if (this.jobseekerlistfinished) {
      var iamjobseeker = this.jobseekerlistfinished.find(
        x => x.userID == this.userinfo.userid
      );
      if (iamjobseeker && iamjobseeker.linkStatus == "7") {
        this.$message({
          message: "您的视频面试已结束，感谢您的参与！",
          type: "warning"
        });
        this.goback();
        return;
      }
    }
    ///当前求职者如果面试已结束则不准进入面试间

    //面试人轮询状态：正在面试时进入房间
    let userType = JSON.parse(localStorage.getItem("userinfo")).usertype;
    if (userType == "1") {
      this.isNeedToNotifyInlineStatus=true;
      waitingRoomTimerID = setInterval(() => {
        that.queryJobSeekerStatus();
      }, 4000);
      that.queryJobSeekerStatus();
    } else {
      // let resUserInfoPC = await this.$http({
      //   method: "POST",
      //   url: this.$apiAddress.getuserinfopc,
      //   data: {}
      // });
      window.trtcClient = new RtcClient({
        ...this.rtcclientconfig,
        vueObj: this
      });
      window.trtcClient.join();
      this.trtcClient = window.trtcClient;
    }
  },
  beforeDestroy: function() {},
  destroyed: function() {
    // this.$notify({title: '标题名称',message:'window.trtcClient = null'});
    if (window.trtcClient) {
      window.trtcClient.leave();
      window.trtcClient = null;
    }
    this.logoutTim();
    clearInterval(queryallroomuserstatusTimerID);
    clearInterval(waitingRoomTimerID);
    this.leaveRoomToServer();
  },
  mounted: function() {
    var that = this;
    setInterval(() => {
      if (window.trtcClient) {
        let localStream = window.trtcClient.localStream_;
        window.trtcClient.remoteStreams_.forEach(stream => {
          that.getStreamAudioLevel(stream);
        });
        that.getStreamAudioLevel(localStream);
      }
    }, 200);
    window.addEventListener("unload", function(e) {
      clearInterval(queryallroomuserstatusTimerID);
      // Chrome requires returnValue to be set
      e.returnValue = "hello";
      that.leaveRoomToServer();
      that.logoutTim();
    });
  },
  updated() {
    let messageBoxNode = this.$refs["message-box"];
    messageBoxNode.scrollTop = messageBoxNode.scrollHeight;
  },
  watch: {},
  // computed:{
  //   audioLevelComputed:function(userid){
  //     if(this.audioLevel[userid]){
  //       return this.audioLevel[userid]
  //     }
  //     else{
  //     return '0px 25px';
  //     }
  //   }

  // },

  methods: {
    showBigModal: function() {
      this.dialogVisible = true;

      setTimeout(() => {
        
      let videoBox = document.getElementsByClassName("video_box")[0];
        videoBox.setAttribute("style", "height:1000px");
        this.trtcClient.remoteStreams_.forEach(stream => {
          stream.stop();
          stream.play("remote-" + stream.getUserId());
        });
      }, 2000);
    },
    hideBigModal: function() {
      this.dialogVisible = false;
      setTimeout(() => {
        this.trtcClient.remoteStreams_.forEach(stream => {
          stream.stop();
          stream.play("remote-" + stream.getUserId());
        });
      }, 2000);
    },
    getStreamAudioLevel: function(stream) {
      let maxoffset = 25;
      let scale = 0.43;

      if (!window.trtcClient) {
        this.audioLevel[stream.getUserId()] = `0px ${maxoffset}px`;
        return;
      } else {
        if (stream) {
          const volume = stream.getAudioLevel();
          if (volume > 0.1) {
            let calculatedOffset =
              maxoffset -
              Math.floor(Math.pow(Number(volume), scale) * maxoffset);
            calculatedOffset = calculatedOffset > 0 ? calculatedOffset : 0;
            // this.$message({
            //   message: `${stream.getUserId()} is speaking,volume ${volume},offset:${calculatedOffset}`
            // });
            this.audioLevel[stream.getUserId()] = `0px ${calculatedOffset}px`;
          } else {
            this.audioLevel[stream.getUserId()] = `0px ${maxoffset}px`;
          }
        }
        this.audioLevel = JSON.parse(JSON.stringify(this.audioLevel));
      }
    },
    refreshList: async function() {
      this.$commonjs.refreshList(this);
    },
    createTimClient: async function() {
      window.timClient = new timClientClass({
        SDKAppID: this.userinfo.sdkappid.toLowerCase()
      });
      try {
        await timClient.tim.login({
          userID: this.userinfo.userid,
          userSig: this.userinfo.usersig
        });
        let roominfo = JSON.parse(localStorage.getItem("roominfo"));
        this.groupID = roominfo.roomid;
        this.groupName = roominfo.roomname;
        this.initListener();
      } catch (error) {
        console.log("登录失败：" + error.message);
      }
    },
    initListener() {
      // // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      timClient.tim.on(
        TIM.EVENT.SDK_READY,
        async function(event) {
          if (event.name === this.TIM.EVENT.SDK_READY) {
            localStorage.setItem("isSDKReady", true);
            try {
              await timClient.tim.searchGroupByID(this.groupID);
              localStorage.setItem("IsExistGroup", true);
            } catch (error) {
              localStorage.setItem("IsExistGroup", false);
            }
            if (!JSON.parse(localStorage.getItem("IsExistGroup"))) {
              let options = {
                groupID: this.groupID,
                name: this.groupName,
                type: TIM.TYPES.GRP_CHATROOM
              };
              try {
                await timClient.tim.createGroup(options);
              } catch (error) {
                console.warn("createGroup error:", error); // 创建群组失败的相关信息
              }
            }
            try {
              await timClient.tim.joinGroup({
                groupID: this.groupID
              });
              this.getMessageList();
            } catch (error) {
              console.warn("joinGroup error:", error); // 申请加群失败的相关信息
            }
          }
        },
        this
      );
      // // 收到新消息
      timClient.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
    },
    async logoutTim() {
      if (timClient) {
        try {
          let logouttim = await timClient.tim.logout();
          timClient = null;
          localStorage.setItem("isSDKReady", false);
          //console.warn(localStorage.getItem("isSDKReady"));
        } catch (imError) {
          console.warn("logout error:", imError);
        }
      }
    },
    onReceiveMessage(event) {
      const result = event.data.filter(
        item => item.conversationID === "GROUP" + this.groupID
      );
      this.CurrentMessageList = [...this.CurrentMessageList, ...result];
    },
    sendTextMessage() {
      if (
        this.messageContent === "" ||
        this.messageContent.trim().length === 0
      ) {
        this.messageContent = "";
        alert("不能发送空信息！");
        return;
      }
      let message = timClient.tim.createCustomMessage({
        to: this.groupID,
        conversationType: this.TIM.TYPES.CONV_GROUP,
        payload: {
          data: this.messageContent,
          description: this.userinfo.username,
          extension: this.userinfo.usertype
        }
      });
      this.CurrentMessageList = [...this.CurrentMessageList, message];
      //this.CurrentMessageList = this.CurrentMessageList.concat(message)
      // 2. 发送消息
      let promise = timClient.tim.sendMessage(message);
      promise
        .then(function(imResponse) {
          // 发送成功
          console.log(imResponse);
        })
        .catch(function(imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        });
      this.messageContent = "";
    },
    getMessageList() {
      timClient.tim
        .getMessageList({
          conversationID: "GROUP" + this.groupID,
          count: 15
        })
        .then(res => {
          this.CurrentMessageList = res.data.messageList; // 消息列表。
          this.nextReqMessageID = res.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          //const isCompleted = res.data.isCompleted; // 表示是否已经拉完所有消息。
        });
    },
    handleEnter() {
      this.sendTextMessage();
    },
    handleLine() {
      this.messageContent += "\n";
    },
    handleRadio(e) {
      if (!e.target.classList.contains("active")) {
        let fielddictradiolist = this.$refs["fielddictradio"];
        for (let i = 0; i < fielddictradiolist.length; i++) {
          fielddictradiolist[i].classList.remove("active");
        }
        e.target.classList.add("active");
      }
    },
    switchTab(e) {
      if (e.target.classList.contains("box_unselected")) {
        if (e.target.classList.contains("box_title_left")) {
          this.$refs["box_right"].classList.add("hidden");
          this.$refs["box_left"].classList.remove("hidden");
          this.$refs["box_title_right"].classList.add("box_unselected");
          this.$refs["box_title_left"].classList.remove("box_unselected");
        } else {
          this.$refs["box_left"].classList.add("hidden");
          this.$refs["box_right"].classList.remove("hidden");
          this.$refs["box_title_left"].classList.add("box_unselected");
          this.$refs["box_title_right"].classList.remove("box_unselected");
        }
      }
    },
    enterRoomToServer: async function() {
      let resEnterRoom = await this.$http({
        method: "POST",
        url: this.$apiAddress.enterroom,
        data: {}
      });
    },
    leaveRoomToServer: async function() {
      this.isNeedToNotifyInlineStatus=false;
      Notification.closeAll();
      let resEnterRoom = await this.$http({
        method: "POST",
        url: this.$apiAddress.leaveroom,
        data: {}
      });
    },
    closeaudio: async function() {
      // let resUserInfoPC = await this.$http({
      //     method: "POST",
      //     url: this.$apiAddress.getuserinfopc,
      //     data: {}
      //   });
      // window.trtcClient = new RtcClient({
      //   ...resUserInfoPC.data.data,
      //   vueObj: this
      // });
      // await window.trtcClient.coroaudio();
      // this.trtcClient = window.trtcClient;
      this.turnaudio = false;
      console.log(this.turnaudio);
      await this.trtcClient.localStream_.muteAudio();
    },
    openaudio: async function() {
      this.turnaudio = true;
      console.log(this.turnaudio);
      await this.trtcClient.localStream_.unmuteAudio();
    },
    closevideo: async function() {
      this.turnvideo = false;
      console.log(this.turnvideo);
      await this.trtcClient.localStream_.muteVideo();
    },
    openvideo: async function() {
      this.turnvideo = true;
      console.log(this.turnvideo);
      await this.trtcClient.localStream_.unmuteVideo();
    },
    onUpdateLinkStatus: function() {
      this.queryRoomStatus();
    },
    logout: function() {
      this.$confirm("您确定要退出吗?", "退出在线面试平台", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.leaveRoomToServer();
          this.logoutTim();
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
    hideHover: function(event) {
      document.getElementsByClassName("show").forEach(item => {
        let nodeVal = item.attributes["class"].nodeValue;
        item.attributes["class"].nodeValue = nodeVal.substring(
          0,
          nodeVal.indexOf("show")
        );
        console.log(item.attributes["class"].nodeValue);
      });
      event.stopPropagation();
    },
    showHover: function(event) {
      this.hideHover(event);
      let classAttr = event.currentTarget.getAttributeNode("class");
      classAttr.nodeValue = classAttr.nodeValue + " show";
      //let classVal = event.currentTarget.getAttributeNode("class").nodeValue;
      //this.hoverClass = classVal.substring(0, classVal.indexOf("show"));
      //this.isShowFinishHover = true;
      event.stopPropagation();
    },
    queryRoomStatus: async function() {
      //获取房间内人物列表
      let resRoomUserStatus = await this.$http({
        method: "POST",
        url: this.$apiAddress.queryallroomuserstatus,
        data: {}
      });
      let userinfo = JSON.parse(localStorage.getItem("userinfo"));
      let currentUserID = userinfo.userid;
      let resultRoomUserList = resRoomUserStatus.data.data;
      if (resultRoomUserList) {
        //将最新的列表更新至interviewerlist
        localStorage.setItem(
          "interviewerlist",
          JSON.stringify(
            resultRoomUserList
              .filter(x => x.userType == "0" || x.userType == "2")
              .sort((cur, nxt) => (cur.orderNum < nxt.orderNum ? -1 : 1))
              .map(x => {
                return { ...x, isSelf: x.userID == userinfo.userid };
              })
          )
        );

        //将最新的列表更新至jobseekerlist
        localStorage.setItem(
          "jobseekerlist",
          JSON.stringify(
            resultRoomUserList
              .filter(x => x.userType == "1")
              .filter(x => x.isInRoom == true)
              .sort((cur, nxt) => (cur.orderNum < nxt.orderNum ? -1 : 1))
              .map(x => {
                return { ...x, isSelf: x.userID == userinfo.userid };
              })
              .concat(
                resultRoomUserList
                  .filter(x => x.userType == "1")
                  .filter(x => x.isInRoom == false)
                  .sort((cur, nxt) => (cur.orderNum < nxt.orderNum ? -1 : 1))
                  .map(x => {
                    return { ...x, isSelf: x.userID == userinfo.userid };
                  })
              )
          )
        );
        //20200303 jason commentout
        // let jobSeekerlist = JSON.parse(localStorage.getItem("jobseekerlist"));
        // //console.log("jobSeekerlist", jobSeekerlist);
        // let interviewerlist = JSON.parse(
        //   localStorage.getItem("interviewerlist")
        // );

        // localStorage.setItem(
        //   "jobseekerlist",
        //   JSON.stringify(
        //     jobSeekerlist
        //       .map(item => {
        //         return {
        //           ...item,
        //           linkStatus: resRoomUserStatus.data.data.find(
        //             i => i.userID == item.userID
        //           ).linkStatus,
        //           orderNum: resRoomUserStatus.data.data.find(
        //             i => i.userID == item.userID
        //           ).orderNum,
        //           isInRoom: resRoomUserStatus.data.data.find(
        //             i => i.userID == item.userID
        //           ).isInRoom,
        //           isSelf: item.userID == currentUserID ? true : false
        //         };
        //       })
        //       .sort((cur, nxt) => (cur.isInRoom == true ? -1 : 1))
        //   )
        // );
        // localStorage.setItem(
        //   "interviewerlist",
        //   JSON.stringify(
        //     interviewerlist.map(item => {
        //       return {
        //         ...item,
        //         isInRoom: resRoomUserStatus.data.data.find(
        //           i => i.userID == item.userID
        //         ).isInRoom,
        //         isSelf: item.userID == currentUserID ? true : false
        //       };
        //     })
        //   )
        // );
        //200303 jason commentout
        let jobseekerlistonline = JSON.parse(
          localStorage.getItem("jobseekerlist")
        ).filter(
          x => x.linkStatus == "0" || x.linkStatus == "3" || x.linkStatus == "4"
        );

        this.jobseekerlist = JSON.parse(
          localStorage.getItem("jobseekerlist")
        ).filter(x => x.linkStatus == "1");

        this.jobseekerlistonline = jobseekerlistonline;

        this.jobseekerlistfinished = JSON.parse(
          localStorage.getItem("jobseekerlist")
        ).filter(x => x.linkStatus == "7");

        this.interviewerlist = JSON.parse(
          localStorage.getItem("interviewerlist")
        );
      }
      //如果正在面试的用户中有一位用户是暂停的，则认为全部是暂停的
      if (this.jobseekerlistonline.find(x => x.linkStatus == "4")) {
        this.isInterviewPaused = true;
      }

      //如果是求职者，需要检查是否已暂停，已暂停则停止订阅远方音视频流
      if (
        userinfo.usertype == "1" &&
        this.trtcClient &&
        this.trtcClient.remoteStreams_
      ) {
        this.checkInterviewPauseStatus();
      }

      //如果是求职者并且状态是排队中或者已结束，则离开房间
      if (
        userinfo.usertype == "1" &&
        this.trtcClient &&
        this.trtcClient.remoteStreams_
      ) {
        let alljobseeker = JSON.parse(localStorage.getItem("jobseekerlist"));
        let currentJobSeeker = alljobseeker.find(
          x => x.userID == currentUserID
        );
        if (
          currentJobSeeker &&
          (currentJobSeeker.linkStatus == "1" ||
            currentJobSeeker.linkStatus == "7")
        ) {
          if (this.trtcClient && this.trtcClient.isJoined_) {
            this.trtcClient.leave();
            if (currentJobSeeker.linkStatus == "7") {
              this.showEndDialog = true;
            } else if (currentJobSeeker.linkStatus == "1") {
              this.isNeedToNotifyInlineStatus=true;
              waitingRoomTimerID = setInterval(() => {
                this.queryJobSeekerStatus();
              }, 4000);
              this.queryJobSeekerStatus();
              this.$message({
                message: "您目前在等待列表中，请等候面试官的操作",
                type: "warning"
              });
            }
          }
          return;
        }
      }
    },

    //如果面试官暂停了，则不接收远程流，如果没有暂停则接收
    checkInterviewPauseStatus: async function() {
      let currentUserID = JSON.parse(localStorage.getItem("userinfo")).userid;
      let alljobseeker = JSON.parse(localStorage.getItem("jobseekerlist"));
      let currentJobSeeker = alljobseeker.find(x => x.userID == currentUserID);
      if (currentJobSeeker && currentJobSeeker.linkStatus == "4") {
        for (const interviewer of this.interviewerlist) {
          let remoteStream = this.trtcClient.remoteStreams_.find(
            x => interviewer.userID == x.getUserId()
          );
          if (remoteStream) {
            if (
              this.remoteStreamsSubscribeStatusList[remoteStream.getUserId()]
            ) {
              this.trtcClient.client_.unsubscribe(remoteStream);
              this.remoteStreamsSubscribeStatusList[
                remoteStream.getUserId()
              ] = false;
              this.showPauseDialog = true;
            }
          }
        }
      } else {
        for (const interviewer of this.interviewerlist) {
          let remoteStream = this.trtcClient.remoteStreams_.find(
            x => interviewer.userID == x.getUserId()
          );
          if (remoteStream) {
            console.log(this.remoteStreamsSubscribeStatusList);
            if (
              !this.remoteStreamsSubscribeStatusList[remoteStream.getUserId()]
            ) {
              try {
                await this.trtcClient.client_.subscribe(remoteStream, {
                  audio: true,
                  video: true
                });
              } catch (err) {
                console.error(err);
              }
            }
          }
        }
      }
    },
    getInterviewLinkStatus: async function() {
      let obj = {};
      let userinfo = JSON.parse(localStorage.getItem("userinfo"));
      if (userinfo.usertype == "0" || userinfo.usertype == "2") {
        //面试官
        obj = {
          interviewerid: userinfo.userid
        };
      } else {
        //求职者
        obj = {
          jobseekerid: userinfo.userid
        };
      }
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.getinterviewlinkstatus,
        data: {
          ...obj,
          interviewroomid: userinfo.roomguid,
          systemtype: userinfo.systemtype,
          timestamp: Math.floor(Date.now() / 1000)
        }
      });
      return res;
    },
    queryJobSeekerStatus: async function() {
      let userID = JSON.parse(localStorage.getItem("userinfo")).userid;
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.queryjobseekerstatus,
        data: {
          jobseekerid: userID
        }
      });
      if (
        res.data.data == "0" ||
        res.data.data == "3" ||
        res.data.data == "4"
      ) {
        // let resUserInfoPC = await this.$http({
        //   method: "POST",
        //   url: this.$apiAddress.getuserinfopc,
        //   data: {}
        // });
        window.trtcClient = new RtcClient({
          ...this.rtcclientconfig,
          vueObj: this
        });
        await window.trtcClient.join();
        this.trtcClient = window.trtcClient;
        clearInterval(waitingRoomTimerID);
        this.checkInterviewPauseStatus();
        this.isNeedToNotifyInlineStatus=false;
        Notification.closeAll();
      }
      else{
        //显示求职者正在等待队列中
        if(this.isNeedToNotifyInlineStatus){
          let that=this;
          this.$notify({
            title: '提示',
            message: '您当前处在排队队列中，请耐心等待面试官的操作',
            type: 'info',
            position: 'top-left',
            duration: 0,
            onClose:function(){
              console.log("closenotify")
              that.isNeedToNotifyInlineStatus=true;
            }
          });
          this.isNeedToNotifyInlineStatus=false;
        }
      }
      console.log(res.data.data);
    },
    showCommentList: async function() {
     
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.getevaluations,
        data: {
          roomid: JSON.parse(localStorage.getItem("userinfo")).roomguid,
          ctmid: localStorage.getItem("ctmid"),
          interviewerid: this.userinfo.userid
        }
      });
      console.log(res.data);
      
      if (res.data.data && res.data.data.length > 0) {
        
        this.isShowCommentList = "1";
        this.commentList = res.data.data;
        this.commentHeadColmnsList=res.data.data[0]["dimensionName"];
        this.commentBodyColmnsList=res.data.data[0]["dimensionID"];
        // console.log(res.data.data["dimensionName"]);
      } else {
        this.isShowCommentList = "0";
      }
      this.showEdit = false;
    },
    hideCommentList: function() {
      this.isShowCommentList = "2";
    },
    freshCommentList: async function() {
       let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.getevaluations,
        data: {
          roomid: JSON.parse(localStorage.getItem("userinfo")).roomguid,
          ctmid: localStorage.getItem("ctmid"),
          interviewerid: this.userinfo.userid
        }
      });
      console.log(res.data);
      console.log(res.data.data[0]["dimensionName"]);
      if (res.data.data && res.data.data.length > 0) {
        
        this.isShowCommentList = "1";
        this.commentList = res.data.data;
        this.commentTableColmnsList=res.data.data[0]["dimensionName"];
        // console.log(res.data.data["dimensionName"]);
      } else {
        this.isShowCommentList = "0";
      }
      this.showEdit = false;
    },
    handleEdit: async function(index, row) {
      console.log(JSON.stringify(row));
      row.showEdit = false;
    },
    saveEdit: async function(index, row) {
      console.log(JSON.stringify(row));
      row.showEdit = true;
       let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.saveinterviewscorecomment,
        data: {
          jobseekerid: this.targetjobseeker.userid,
          interviewerid: this.userinfo.userid,
          //examinerid:this.userinfo.userid.userid,
          ctmid: localStorage.getItem("ctmid"),
          roomid: JSON.parse(localStorage.getItem("userinfo")).roomguid,
          evaluationdata: JSON.stringify(row)
        }
      });
     
    },

    showComment: async function(event) {
      this.targetjobseeker = {
        userid: event.currentTarget.dataset.userid,
        username: event.currentTarget.dataset.username
      };
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.getsinglecomment,
        data: {
          jobseekerid: this.targetjobseeker.userid,
          interviewerid: this.userinfo.userid,
          ctmid: localStorage.getItem("ctmid"),
          roomid: JSON.parse(localStorage.getItem("userinfo")).roomguid
        }
      });
      console.log(res.data.data);
      if (res.data.data && res.data.data.length > 0) {
        let data = res.data.data;
        this.targetjobseekerEvalList = data;
        this.isShowComment = true;
      } else {
        this.$message({
          message: "获取求职者评分信息失败！",
          type: "warning"
        });
      }
    },
    showResume: async function(event) {
      this.targetjobseeker = {
        userid: event.currentTarget.dataset.userid,
        username: event.currentTarget.dataset.username
      };
      let ctmid = localStorage.getItem("ctmid");
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.resumepreview,
        data: {
          jobseekerid: this.targetjobseeker.userid,
          ctmid: ctmid
        }
      });
      if (res.data && res.data.length > 0) {
        this.GoNewPage(res.data);
      }
    },
    makeComment: async function() {
      // debugger;
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.interviewscorecomment,
        data: {
          jobseekerid: this.targetjobseeker.userid,
          interviewerid: this.userinfo.userid,
          //examinerid:this.userinfo.userid.userid,
          ctmid: localStorage.getItem("ctmid"),
          roomid: JSON.parse(localStorage.getItem("userinfo")).roomguid,
          evaluationdata: JSON.stringify(this.targetjobseekerEvalList)
        }
      });
      console.log(JSON.stringify(this.targetjobseekerEvalList));
      console.log(res.data.data.result);
      if (res.data.data.result === 1) {
        this.isShowComment = false;
        this.isShowSubmitResult = true;
        setInterval(() => {
          this.isShowSubmitResult = false;
        }, 2000);
      }
    },
    getcommentsbyroom: async function(event) {
      let res = await this.$http({
        method: "POST",
        url: this.$apiAddress.getcommentsbyroom,
        data: {}
      });
    },
    startInterview: async function(userid, username) {
      let targetJobSeeker = this.jobseekerlist.find(x => x.userID == userid);
      if (!targetJobSeeker.isInRoom) {
        this.$message({
          type: "warning ",
          message: `仅在线用户可以安排至面试`
        });
        return;
      }
      let GroupNum = await this.$http({
        method: "POST",
        url: this.$apiAddress.getGroupNum,
        data: {
          interviewroomid: JSON.parse(localStorage.getItem("userinfo"))
            .roomguid,
          ctmid: localStorage.getItem("ctmid")
        }
      });
      var num = 0;
      if(GroupNum)
      {
        num = GroupNum.data.data.groupnum;
      }
      if(num==0)
        num = 3;
      if (this.jobseekerlistonline.length+1 > num) {
        this.$message({
          type: "warning ",
          message:
            "正在面试人员最多安排"+ num +"人！请等待面试结束或者调整正在面试人员移至等待，谢谢！"
        });
        return;
      }
      let resInterview = await this.$http({
        method: "POST",
        url: this.$apiAddress.updateLinkStatus,
        data: {
          interviewroomid: JSON.parse(localStorage.getItem("userinfo"))
            .roomguid,
          jobseekerid: userid,
          status: "0",
          systemtype: JSON.parse(localStorage.getItem("userinfo")).systemtype,
          timestamp: Math.floor(Date.now() / 1000)
        }
      });
      this.isInterviewPaused = false;
      await this.queryRoomStatus();
      //this.triggerEvent("UpdateLinkStatusEvent");
    },
    pauseContinueInterview: async function(event) {
      let updateStatus = this.isInterviewPaused ? "0" : "4";
      for (const jobseeker of this.jobseekerlistonline) {
        let resInterview = await this.$http({
          method: "POST",
          url: this.$apiAddress.updateLinkStatus,
          data: {
            interviewroomid: JSON.parse(localStorage.getItem("userinfo"))
              .roomguid,
            jobseekerid: jobseeker.userID,
            status: updateStatus,
            systemtype: JSON.parse(localStorage.getItem("userinfo")).systemtype,
            timestamp: Math.floor(Date.now() / 1000)
          }
        });
      }
      this.isInterviewPaused = !this.isInterviewPaused;
      await this.queryRoomStatus();
    },
    endInterview: async function(userid, username) {
      let resInterview = await this.$http({
        method: "post",
        url: this.$apiAddress.updateLinkStatus,
        data: {
          interviewroomid: JSON.parse(localStorage.getItem("userinfo"))
            .roomguid,
          jobseekerid: userid,
          status: "7",
          systemtype: JSON.parse(localStorage.getItem("userinfo")).systemtype,
          timestamp: Math.floor(Date.now() / 1000),
          ctmid: localStorage.getItem("ctmid")
        }
      });
      await this.queryRoomStatus();
      //this.triggerEvent("UpdateLinkStatusEvent");
    },
    backInQueue: async function(userid, username) {
      let resInterview = await this.$http({
        method: "POST",
        url: this.$apiAddress.updateLinkStatus,
        data: {
          interviewroomid: JSON.parse(localStorage.getItem("userinfo"))
            .roomguid,
          jobseekerid: userid,
          status: "1",
          systemtype: JSON.parse(localStorage.getItem("userinfo")).systemtype,
          timestamp: Math.floor(Date.now() / 1000),
          ctmid: localStorage.getItem("ctmid")
        }
      });
      await this.queryRoomStatus();
      //this.triggerEvent("UpdateLinkStatusEvent");
    },
    upgradeQueue: async function(event) {
      let resInterview = await this.$http({
        method: "POST",
        url: this.$apiAddress.upgradequeue,
        data: {
          jobseekerid: event.currentTarget.dataset.userid
        }
      });
      await this.queryRoomStatus();
      //this.triggerEvent("UpdateLinkStatusEvent");
    },
    degradeQueue: async function(event) {
      let resInterview = await this.$http({
        method: "POST",
        url: this.$apiAddress.degradequeue,
        data: {
          jobseekerid: event.currentTarget.dataset.userid
        }
      });
      await this.queryRoomStatus();
      //this.triggerEvent("UpdateLinkStatusEvent");
    },
    _setPlayerProperty: function() {},
    _handleSnapshotClick: function() {},
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
    },

    GoNewPage: (url, targetType = "_blank", id = "open") => {
      if (document.getElementById(id)) {
        document.body.removeChild(document.getElementById(id));
      }
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", targetType);
      a.setAttribute("id", id);
      document.body.appendChild(a);
      a.click();
    }
  },
  props: [],
  data() {
    return {
      trtcClient: null,
      test: "test",
      interviewerlist: [],
      jobseekerlistonline: [],
      jobseekerlistfinished: [],
      jobseekerlist: [],
      userinfo: {},
      targetjobseeker: {},
      isShowComment: false,
      isShowSubmitResult: false,
      isShowCommentList: false,
      commentList: [],
      commentHeadColmnsList: [],
      commentBodyColmnsList: [],
      commentText: "",
      commentScore: "",
      commentRecommendation: "",
      interviewtime: "",
      interviewendtime: "",
      roomname: "",
      isInterviewPaused: false,
      remoteStreamsSubscribeStatusList: [],
      showPauseDialog: false,
      showEndDialog: false,
      showInterceptDialog: false,
      turnaudio: true,
      turnvideo: true,
      groupID: "",
      groupName: "",
      messageContent: "",
      CurrentMessageList: [],
      nextReqMessageID: "",
      targetjobseekerEvalList: [],
      greenBgImg: greenBgImg,
      audioLevel: {},
      isNeedToNotifyInlineStatus: false,
      dialogVisible: false,
      jobseekeerHtml: ""
    };
  }
};
</script>
<style scoped>
body {
  font-size: 13px;
  font-family: 微软雅黑;
}
.div-title {
  background-color: #ff6a00;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.div-list {
}
.div-jobseeker-item {
  background-color: darkkhaki;
  height: 25px;
  line-height: 25px;
  text-align: center;
  width: 200px;
  margin: 0 auto;
  border: 1px solid #ffd800;
  margin-bottom: 3px;
}
.lbl-offline {
  font-size: 11px;
  background-color: red;
}
.lbl-control {
  cursor: pointer;
  font-size: 11px;
  background-color: red;
}
.lbl-totop {
  cursor: pointer;
  font-size: 11px;
  background-color: red;
}
.div-small {
  width: 200px;
  height: 200px;
  border: 1px solid #ffd800;
}

ul {
  list-style-type: none;
}
.rtavmenu {
  display: none;
  position: absolute;
}
.rtavmenu ul {
  position: absolute;
  float: left;
  border: 1px solid #979797;
  background: #f1f1f1;
  padding: 2px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.6);
  width: 230px;
  overflow: hidden;
}

.rtavmenu ul li {
  float: left;
  clear: both;
  height: 24px;
  cursor: pointer;
  line-height: 24px;
  white-space: nowrap;
  padding: 0 30px;
  width: 100%;
  display: inline-block;
  border: 1px solid #f1f1f1;
}
.rtavmenu ul li:hover {
  background: #e6edf6;
  border: 1px solid #b4d2f6;
}
.skin {
  width: 100px;
  padding: 2px;
  visibility: hidden;
  position: absolute;
}
.btn-send {
  cursor: pointer;
  color: #ffffff;
  float: right;
  font-size: 14px;
  padding: 5px 20px;
  border-radius: 5px;
  background-color: #0095ff;
  margin-top: 10px;
}
.message-box {
  max-height: 370px;
  height: 370px;
  overflow-y: auto;
}
.message-box span {
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
}
.message-content {
  width: 100%;
  box-sizing: border-box;
  outline: none;
  resize: none;
  margin-top: 20px;
  border-radius: 6px;
  padding: 4px 8px;
  border: 1px solid #444444;
  height: 35px;
  line-height: 25px;
}
.circle {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 5px;
}
.txtfrom {
}
.txtmessage {
  padding-top: 10px;
  display: block;
}
.txtsplit {
  margin: 15px 0;
  border-bottom: 1px solid #eeeeee;
  display: block;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.box_left,
.box_right {
  padding: 20px;
}
.box_title {
  text-align: center;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
}
.box_title_left {
  width: 50%;
  display: inline-block;
  border-top-left-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
}
.box_title_right {
  width: 50%;
  display: inline-block;
  border-top-right-radius: 4px;
  float: right;
}
.box_unselected {
  color: #fff;
  background-color: #0095ff;
}
.hidden {
  display: none;
}
</style>
