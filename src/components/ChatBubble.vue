<template>
  <div>
    <el-row justify="end" v-if="isMe">
      <div class="my-container">
        <el-row>
          <div class="message-contents" style="float: right">{{message.content}}<el-icon><Avatar/></el-icon></div>
        </el-row>
        <div class="message-details">{{message.time}} 发送人：{{message.send}}</div>
      </div>
    </el-row>
    <el-row justify="start" v-if="!isMe">
      <div class="container">
        <el-row>
          <div class="message-contents"><el-icon><Avatar/></el-icon>{{message.content}}</div>
        </el-row>
        <div class="message-details">{{message.time}} 发送人：{{message.send}}</div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { Avatar } from '@element-plus/icons-vue'
import {toRefs} from "vue";

export default {
  name: "ChatBubble",
  components: {
    Avatar
  },
  data() {
    return {
      isMe: {
        type: Boolean,
        default: false
      },
      myMessage: this.message
    }
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  created() {
    this.myMessage = this.prop_message.message.value
    this.isMe = (this.myMessage.send === this.$store.getters.getUser)
  },
  setup(props) {
    const prop_message = toRefs(props)
    return {
      prop_message
    }
  }
}
</script>

<style scoped>
.message-contents{
  padding-left: 10px;
  border-radius: 10px;
  float: right;
  color: #f2f2f2;
}
.message-details{
  font-size: 1px;
  padding-right: 10px;
  border-radius: 10px;
  text-align: right;
  color: #f2f2f2;
}
.container{
  background-color: #6770ff;
  width: 30%;
  border-radius: 10px;
  margin: 5px;
}
.my-container{
  background-color: #8b91ff;
  width: 30%;
  border-radius: 10px;
  margin: 5px;
}
</style>
