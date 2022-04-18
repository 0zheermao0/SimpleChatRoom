<template>
  <h1 class="chat-room-title">哲儿猫聊天室</h1>
  <div class="chat-room-container">
    <el-scrollbar>
      <div class="chat-room-messages">
        <div class="chat-room-message" v-for="message in messages" :key="message">
          <ChatBubble :message="message"></ChatBubble>
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
        <el-icon><promotion /></el-icon></el-button>
    </el-space>
  </div>
</template>

<script>
import ChatBubble from "@/components/ChatBubble";
import {
  CaretRight,
  Promotion
} from '@element-plus/icons-vue'
import request from "@/network/request";

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
      input: '',
      messages: [
        {
          content: '你好，我是哲儿猫',
          time: '12:00',
          send: '哲儿猫'
        },
        {
          content: '你好，我不是哲儿猫',
          time: '12:00',
          send: '123'
        }]
    }
  },
  methods: {
    sendMessage () {
      let date = new Date();
      let form = new FormData();
      form.append('content', this.input);
      form.append('time', date.toLocaleString());
      form.append('send', '哲儿猫');
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
      // this.input = ''
    },
    sendFile () {
      this.$message.error('暂不支持文件发送')
    }
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
  border-radius: 10px;
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
</style>
