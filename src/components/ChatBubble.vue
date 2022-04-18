<template>
  <el-row>
    <div class="message-contents"><el-icon><Avatar/></el-icon>{{message.content}}</div>
  </el-row>
  <div class="message-details">{{message.time}} 发送人：{{message.send}}</div>
</template>

<script>
import { Avatar } from '@element-plus/icons-vue'

export default {
  name: "ChatBubble",
  components: {
    Avatar
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.message-contents{
  padding-left: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.message-details{
  font-size: 1px;
  padding-right: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
  text-align: right;
}
</style>
