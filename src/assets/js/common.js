
export default {
    refreshList: async function(that) {
        let userinfo = JSON.parse(localStorage.getItem("userinfo"));
        //获取房间内人物列表
        let resInterviewerList = await that.$http({
          method: "post",
          url: that.$apiAddress.searchinterviewersbyroomid,
          data: {
            interviewroomid: userinfo.roomguid,
            systemtype: userinfo.systemtype,
            timestamp: Math.floor(Date.now() / 1000)
          }
        });
        let interviewerlist = resInterviewerList.data.data.sort((cur, nxt) =>
          cur.interviewername <= nxt.interviewername ? -1 : 1
        );
        localStorage.setItem("interviewerlist", JSON.stringify(interviewerlist));
        let resJobSeekerList = await that.$http({
          method: "post",
          url: that.$apiAddress.searchjobseekersbyroomid,
          data: {
            interviewroomid: userinfo.roomguid,
            systemtype: userinfo.systemtype,
            timestamp: Math.floor(Date.now() / 1000)
          }
        });
        let jobSeekerlist = resJobSeekerList.data.data.sort((cur, nxt) =>
          cur.starttime <= nxt.starttime ? -1 : 1
        );
        localStorage.setItem("jobseekerlist", JSON.stringify(jobSeekerlist));
      }
}
