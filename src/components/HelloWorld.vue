<template>
  <div>
    <el-affix :offset="10" class="join-affix">
      <el-button type="primary" size="small" color="#8b91ff" style="color: #f2f2f2" @click="onClickJoinRoom">密语聊天</el-button>
    </el-affix>
    <el-row>
      <el-col :span="8"><UserInfo v-model:user="current_user" v-model:room="current_room" v-model:total="total_users" class="user-info-card hidden-xs-only"/></el-col>
      <el-col :span="16" :xs="24">
        <section class="msg-container">
          <h1 class="chat-room-title">哲儿猫聊天室
            <!--          <el-row justify="center"><div class="total-user" style="font-size: 0.5vh;">你当前所处的房间是: {{current_room}} (*^▽^*) 昵称是：{{current_user}}</div></el-row>-->
            <el-row justify="center"><div class="total-user" style="font-size: 0.5vh;">(*^▽^*)</div></el-row>
          </h1>
          <div class="chat-room-container">
            <el-scrollbar ref="scroller" style="height: 100%">
              <div class="chat-room-messages" ref="chat-room-messages">
                <div class="chat-room-message" v-for="message in messages" :key="message">
                  <ChatBubble :message="message" class="chat-bubble" v-on:touchBottom="this.touchBottom"></ChatBubble>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="chat-room-input">
            <el-space>
              <el-input v-model="input" @keyup.enter="sendMessage" autosize placeholder="请输入" />
              <el-button type="primary" @click="sendMessage" circle>
                <el-icon><caret-right /></el-icon>
              </el-button>
              <UploadComponent :data="{'user': current_user, 'room': this.current_room, 'time': new Date().toLocaleString()}" :key="current_room"/>
            </el-space>
          </div>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChatBubble from "@/components/ChatBubble";
import UploadComponent from "@/components/UploadComponent";
import 'element-plus/theme-chalk/display.css'
import {
  CaretRight
} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import UserInfo from "@/components/UserInfo";

export default {
  name: 'HelloWorld',
  components: {
    UserInfo,
    ChatBubble,
    CaretRight,
    UploadComponent
  },
  props: {
  },
  data () {
    return {
      current_user:'anonymous',
      current_room:'-1',
      input: '',
      messages: [],
      total_users: 0,
    }
  },
  sockets: {
    connect: function () {
      console.log('connect 成功');
    },
    message: function (data) {
      console.log('服务端触发message', data);
      this.messages = data.data;
      this.total_users = data.total_user;
      this.$nextTick(() => {
        this.$refs.scroller.setScrollTop(this.$refs["chat-room-messages"].scrollHeight);
      });
    },
    disconnect: function (data) {
      console.log('disconnect');
      this.total_users = data.total_user;
    },
    rcvRoom: function (data) {
      console.log('rcvRoom', data);
      this.messages = data.data;
      this.total_users = data.count;
      this.$nextTick(() => {
        this.$refs.scroller.setScrollTop(this.$refs["chat-room-messages"].scrollHeight);
      });
    },
  },
  methods: {
    notify () {
      this.$refs.audioTip.load();
      this.$refs.audioTip.play();
      //如果不是当前页面，标题栏闪动+消息提示
      if(document.hidden){
        let options = {
          body: '您有新的未读消息，请及时处理',
          silent: true
        }
        let notification = new Notification('消息通知', options);
        notification.onclick=function(){
          window.open(`页面链接`, '_blank');
        }
        //标题栏闪动
        let defaultTitle = document.title;
        if(this.isReceive){
          return;
        }else{
          this.isReceive=true;
        }
        this.timer=setInterval(function(){
          let title = document.title;
          if (document.hidden&&this.isReceive) {
            if (/你有新消息/.test(title) == false) {
              document.title = '【你有新消息】';
            } else {
              document.title = defaultTitle;
            }
          } else {
            this.isReceive=false;
            document.title = defaultTitle;
          }
        }, 500);
      }
    },
    touchBottom () {
      // console.log('图片完成加载触发触底');
      this.$nextTick(() => {
        this.$refs.scroller.setScrollTop(this.$refs["chat-room-messages"].scrollHeight);
      });
    },
    input_name () {
      ElMessageBox.prompt('请输入你的昵称', 'Tip', {
        confirmButtonText: '确认',
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
          .then(({ value }) => {
            if (value) {
              this.current_user = value;
              ElMessage({
                type: 'success',
                message: `Your nick name is: ${value}，enjoy your chat!`
              })
              this.$store.commit('setUser', value);
            }
            else {
              this.current_user = 'anonymous';
              ElMessage({
                type: 'info',
                message: 'Your are going to chat as name: anonymous, but your ip address will be recorded.'
              })
            }
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'Your are going to chat as name: anonymous, but your ip address will be recorded.'
            })
          })
    },
    sendMessage () {
      // if(this.current_room === -1){
      //   console.log('调用了公屏发送');
      //   this.sendGlobal();
      // }else {
      //   console.log('调用了房间发送');
      this.send2Room();
      // }
      this.$nextTick(() => {
        this.$refs.scroller.setScrollTop(this.$refs["chat-room-messages"].scrollHeight);
      });
    },
    onClickSendFile () {
      this.$message.error('暂不支持文件发送')
    },
    onClickJoinRoom () {
      ElMessageBox.prompt('请输入房间号', '密语房间聊天', {
        confirmButtonText: '加入',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '目前只支持加入数字房间',
      })
          .then(({ value }) => {
            this.$socket.emit('leave', {
              room: this.current_room,
              user: this.current_user
            });
            if (!value) {
              value = '-1';
            }
            ElMessage({
              type: 'success',
              message: `加入密语房间：${value}`,
            })
            this.current_room = value;
            this.$store.commit('setRoom', value);
            console.log('加入密语房间：', this.current_room);
            this.joinRoom(value);
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '密语房间加入失败',
            })
          })
    },
    joinRoom (room) {
      // this.messages = [];
      this.$socket.emit('join', {
        room: room
      });
    },
    send2Room(){
      if (!this.input || this.input.trim() === '') {
        this.$message.error('内容不能为空');
        return;
      }
      console.log('调用了send2Room');
      let date = new Date();
      let form = {
        user: this.$store.getters.getUser,
        content: this.input,
        time: date.toLocaleString(),
        room: this.current_room,
      };
      console.log('send2Room发送的数据是', form);
      this.$socket.emit('send2Room', {
        room: this.current_room,
        message: form
      });
      this.input = '';
      this.$nextTick(() => {
        this.$refs.scroller.setScrollTop(this.$refs["chat-room-messages"].scrollHeight);
      });
    }
  },
  mounted () {
    this.input_name();
    console.log('mounted');
    this.joinRoom(this.current_room);
  },
  created () {
    console.log('created');
  },
  unmounted() {
    this.$socket.emit('broadcast');
    // this.$socket.emit('disconnect');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/scss/_handle.scss";

.msg-container{
  width: 60vw;
  //margin-right: 5vw;
  //margin-left: 3vw;
}
.user-info-card{
  height: 88vh;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.chat-room-title {
  width: 100%;
  margin: 0 auto;
  color: aliceblue;
  font-size: 30px;
  font-weight: normal;
  text-align: center;
  background-color: #7c9cf1;
  @include background_color('title_color');
  border-radius: 10px 10px 0 0;
}
.chat-room-container {
  margin: 0 auto;
  width: 100%;
  height: 75vh;
  background-color: #f2f2f2;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}
 .chat-room-input {
  width: 100%;
  margin: 1vh auto;
  border-radius: 10px;
  position: relative;
   text-align: right;
}
 .el-input {
  width: 55vw;
  border: none;
  position: inherit;
   @include background_color('background_color');
   @include font_color('background_color');
 }
 .el-input /deep/ .el-input__inner{
  @include background_color('background_color');
  @include font_color('font_color2');
 }
.join-affix {
  position: fixed;
  text-align: right;
  /*height: 400px;*/
  border-radius: 4px;
  /*background: var(--el-color-primary-light-9);*/
  z-index: 1;
}
/deep/.el-col-xs-24 {
  display: block;
  max-width: 100%;
  float: right;
  text-align: -webkit-center;
}
</style>
