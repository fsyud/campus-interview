///20200306 jason 这段做成配置
// // dev
// const prefix = "/eHireWeb2009/VInterview"

// //prod
// //const prefix = "/VInterview"
///20200306 jason 这段做成配置
const prefix = (process.env.NODE_ENV=='development' || process.env.BUILD_ENV=="development") ?"/eHireWeb2009/VInterview":"/VInterview"
console.log("apiAddress","process.env.BUILD_ENV",process.env.BUILD_ENV)

export default {
  getdata: prefix + "/api/wechat.ashx?func=getdata",
  authorizecodelogin: prefix + "/api/authorization.ashx?func=authorizecodelogin",
  searchinterviewersbyroomid: prefix + "/api/wechat.ashx?func=searchinterviewersbyroomid",
  searchjobseekersbyroomid: prefix + "/api/wechat.ashx?func=searchjobseekersbyroomid",
  getroominfo: prefix + "/api/wechat.ashx?func=getroominfo",
  queryjobseekerstatus: prefix + "/api/wechat.ashx?func=queryjobseekerstatus",
  queryallroomuserstatus: prefix + "/api/wechat.ashx?func=queryallroomuserstatus",
  enterroom: prefix + "/api/wechat.ashx?func=enterroom",
  leaveroom: prefix + "/api/wechat.ashx?func=leaveroom",
  updateLinkStatus: prefix + "/api/wechat.ashx?func=updatelinkstatus",
  getinterviewlinkstatus: prefix + "/api/wechat.ashx?func=getinterviewlinkstatus",
  upgradequeue: prefix + "/api/wechat.ashx?func=upgradequeue",
  degradequeue: prefix + "/api/wechat.ashx?func=degradequeue",
  getuserinfopc: prefix + "/api/wechat.ashx?func=getuserinfopc",
  interviewscorecomment: prefix + "/api/wechat.ashx?func=interviewscorecomment",
  getsinglecomment: prefix + "/api/wechat.ashx?func=getsinglecomment",
  getcommentsbyroom: prefix + "/api/wechat.ashx?func=getcommentsbyroom",
  resumepreview:prefix + "/api/wechat.ashx?func=resumepreview",
  getevaluations: prefix + "/api/wechat.ashx?func=getevaluations",
  getevaluationtablecolumns:prefix + "/api/wechat.ashx?func=getevaluationtablecolumns",
  getGroupNum: prefix + "/api/wechat.ashx?func=getgroupnum",
  saveinterviewscorecomment:prefix + "/api/wechat.ashx?func=saveinterviewscorecomment"
}
