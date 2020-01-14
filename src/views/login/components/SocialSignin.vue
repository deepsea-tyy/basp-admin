<template>
  <div class="social-signup-container">
    {{ tips }}
    <div>
      <el-image v-if="qrCodeUrl" style="width: 100px; height: 100px" :src="qrCodeUrl" fit="cover"></el-image>
      {{message}}
    </div>
    <div class="sign-btn" @click="wechatHandleClick('wechat')">
      <span class="wx-svg-container">
        <svg-icon icon-class="wechat" class="icon" /></span>
      WeChat
    </div>
    <div class="sign-btn" @click="tencentHandleClick('tencent')">
      <span class="qq-svg-container">
        <svg-icon icon-class="qq" class="icon" /></span>
      QQ
    </div>
  </div>
</template>
<script>
// import {socket} from '@/utils/websocket.js';

var client_id = "";
export default {
  name: 'SocialSignin',
  data() {
    return {
      tips: "",
      qrCodeUrl: "",
      message: "",
      wsData: {},
      websocket: {},
      timer:null,
      heartCheck: null
    }
  },
  created() {
    let that = this
    var heartCheck = {
      timeout: 3000,
      timeoutObj: null,
      serverTimeoutObj: null,
      start: function(){
        console.log('start');
        var self = this;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function(){
          that.websocket.send("ping");
          self.serverTimeoutObj = setTimeout(function() {
            console.log(that.websocket);
            // that.websocket.close();
          }, self.timeout);

        }, this.timeout)
      }
    }
    that.heartCheck = heartCheck;
    heartCheck=null
    this.initSocket()
  },
  destroyed: function() {
    this.onclose();
  },
  methods: {
    initSocket() {
      this.websocket = new WebSocket('ws://' +process.env.VUE_APP_WEBSOCKET + "?common=qrscan");
      this.websocket.onopen = this.onopen;
      this.websocket.onerror = this.onerror;
      this.websocket.onmessage = this.onmessage;
      this.websocket.onclose = this.onclose;
    },
    onopen() {
      console.info("向服务端发送心跳包字符串");
      this.heartCheck.start()
    },
    onerror(e) {
      console.log("WebSocket连接发生错误");
    },
    onmessage(e) { //数据接收 
      const res = JSON.parse(e.data);
      console.log(res);
      if (res.data.client_id) {
        // type 1前台 2后台 调用
        this.qrCodeUrl = process.env.VUE_APP_BASE_API + "/user/qrscan?client_id=" + res.data.client_id + "&type=2"
      }else{
        if (res.controller == "user" && res.action == "qrlogin" ) {
          if (res.data == "qrlogin_scan") {
            // this.message = "扫码成功"
            this.message = res.message
          }
          if (res.data.token) {
            // this.message = "登录成功跳转"
            this.message = res.data.token
          }
        }
      }
    },
    websocketsend(data) { //数据发送 
      this.websocket.send(data);
    },

    onclose(e) { //关闭 
      console.log("connection closed ");
    },
    wechatHandleClick(thirdpart) {
      this.qrCodeUrl = process.env.VUE_APP_BASE_API + "/user/qrscan?client_id=" + client_id + "&type=2&platform=wechat"
      // console.log(this.qrCodeUrl);
      this.tips = this.$t("login.thirdpartyWechat")
    },
    tencentHandleClick(thirdpart) {
      this.qrCodeUrl = process.env.VUE_APP_BASE_API + "/user/qrscan?client_id=" + client_id + "&type=2&platform=qq"
      this.tips = this.$t("login.thirdpartyQq")
    },
  }
}

</script>
<style lang="scss" scoped>
.social-signup-container {
  margin: 20px 0;

  .sign-btn {
    display: inline-block;
    cursor: pointer;
  }

  .icon {
    color: #fff;
    font-size: 24px;
    margin-top: 8px;
  }

  .wx-svg-container,
  .qq-svg-container {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding-top: 1px;
    border-radius: 4px;
    margin-bottom: 20px;
    margin-right: 5px;
  }

  .wx-svg-container {
    background-color: #24da70;
  }

  .qq-svg-container {
    background-color: #6BA2D6;
    margin-left: 50px;
  }
}

</style>
