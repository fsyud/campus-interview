window.rtc_client = function (options) {
    this.sdkAppID = options.sdkAppId;
    this.userID = options.userId;
    this.userSig = options.userSig;
    this.roomID = options.roomId;
    this.localStream = null;
    TRTC.checkSystemRequirements().then(result => {
        if (!result) {
            alert('您的浏览器不支持实时音视频技术，建议下载Chrome的最新版。');
            window.location.href = '../interview_checkdevice.aspx';
        }
    });
    this.client = TRTC.createClient({
        mode: 'videoCall', // 实时通话模式
        sdkAppId: this.sdkAppID,
        userId: this.userID,
        userSig: this.userSig
    });
    this.enterRoom = function (playelementid) {
        this.client.join({ roomId: this.roomID }).catch((err)=>alert(err));
        this.localStream = TRTC.createStream({
            audio: true, // 采集麦克风
            video: true, // 采集摄像头
            userId: this.userID
            // cameraId: getCameraId(),
            // microphoneId: getMicrophoneId()
        });
        this.localStream.setVideoProfile('480p');
        this.localStream.initialize();
        this.localStream.play(playelementid);
    };
    this.leaveRoom = function () {
        try {
            this.client.leave();
        } catch (error) {
            alert('退出房间失败');
            //location.reload();
        } finally {
            // 停止本地流，关闭本地流内部的音视频播放器
            this.localStream.stop();
            // 关闭本地流，释放摄像头和麦克风访问权限
            this.localStream.close();
            this.localStream = null;
        }
    }
};