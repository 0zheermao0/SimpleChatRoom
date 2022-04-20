<template>
  <section class="container">
    <el-affix :offset="10" class="join-affix">
      <el-button type="primary" size="small" color="#8b91ff" style="color: #f2f2f2" @click="onClickJoinRoom">密语聊天</el-button>
    </el-affix>
    <h1 class="chat-room-title">哲儿猫聊天室
      <el-row justify="center"><div class="total-user" style="font-size: 0.5vh;">你当前的昵称是：{{current_user}} ☆*: .｡. o(≧▽≦)o .｡.:*☆ 当前总在线人数: {{total_users}}</div></el-row>
    </h1>
    <div class="chat-room-container">
      <el-scrollbar ref="scroller" style="height: 100%">
        <div class="chat-room-messages" ref="chat-room-messages">
          <div class="chat-room-message" v-for="message in messages" :key="message">
            <ChatBubble :message="message" class="chat-bubble"></ChatBubble>
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
        <el-button type="primary" @click="sendFile" circle>
          <el-icon><promotion/></el-icon></el-button>
      </el-space>
    </div>
  </section>
</template>

<script>
import ChatBubble from "@/components/ChatBubble";
import {
  CaretRight,
  Promotion
} from '@element-plus/icons-vue'
import request from "@/network/request";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: 'HelloWorld',
  components: {
    ChatBubble,
    CaretRight,
    Promotion
  },
  props: {
  },
  data () {
    return {
      current_user:'anonymous',
      current_room:-1,
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
    rcvRoom: function (data, cb) {
      console.log('rcvRoom', data);
      this.current_room = data.room;
      cb();
    },
  },
  methods: {
    input_name () {
      ElMessageBox.prompt('请输入你的昵称', 'Tip', {
        confirmButtonText: '确认',
        // cancelButtonText: 'Cancel'
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
      if(this.current_room !== -1){
        this.sendGlobal();
      }else {
        this.send2Room();
      }
      this.$nextTick(() => {
        this.$refs.scroller.setScrollTop(this.$refs["chat-room-messages"].scrollHeight);
      });
    },
    sendFile () {
      this.$message.error('暂不支持文件发送')
    },
    onClickJoinRoom () {
      ElMessageBox.prompt('请输入房间号', '密语房间聊天', {
        confirmButtonText: '加入',
        cancelButtonText: '取消',
      })
          .then(({ value }) => {
            ElMessage({
              type: 'success',
              message: `加入密语房间：${value}`,
            })
            this.current_room = value;
            console.log('加入密语房间：', value);
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
      this.messages = [];
      this.$socket.emit('join', {
        room: room
      });
    },
    sendGlobal(){
      let date = new Date();
      let form = new FormData();
      form.append('content', this.input);
      form.append('time', date.toLocaleString());
      form.append('send', this.current_user);
      if (this.input) {
        request({
          method: 'post',
          url: '/chat/send',
          data: form
        }).then((res) => {
          console.log('send 测试', res.data.code);
          if(res.data.code === 200) {
            this.messages.push({
              content: this.input,
              time: `${date.getHours()}:${date.getMinutes()}`,
              send: '哲儿猫'
            });
            this.messages = res.data.data
            this.input = '';
          }else {
            this.$message.error("发送失败");
          }
        })
      }else {
        this.$message.error('内容不能为空');
      }
      this.$socket.emit('broadcast');
    },
    send2Room(){
      console.log('调用了send2Room');
      let date = new Date();
      let form = new FormData();
      form.append('content', this.input);
      form.append('time', date.toLocaleString());
      form.append('send', this.current_user);
      form.append('room', this.current_room);
      this.$socket.emit('send2Room', {
        room: this.current_room,
        message: form
      });
    }
  },
  mounted () {
    // this.input_name();
    console.log('mounted');
    this.$socket.emit('broadcast');
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
<style scoped>
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
  width: 80vw;
  margin: 0 auto;
  color: aliceblue;
  font-size: 30px;
  font-weight: normal;
  text-align: center;
  background-color: #7c9cf1;
  border-radius: 10px 10px 0 0;
}
.chat-room-container {
  margin: 0 auto;
  width: 80vw;
  height: 75vh;
  background-color: #f2f2f2;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}
 .chat-room-input {
  width: 80vw;
  margin: 1vh auto;
  border-radius: 10px;
  position: relative;
   text-align: right;
}
 .el-input {
  width: 75vw;
  border: none;
  position: inherit;
 }
.join-affix {
  position: absolute;
  text-align: left;
  /*height: 400px;*/
  border-radius: 4px;
  /*background: var(--el-color-primary-light-9);*/
}
</style>
