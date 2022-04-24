<template>
  <div>
    <el-row justify="end" v-if="isMe && this.myMessage.send !== this.adminIdentify">
      <div class="my-container">
        <el-row>
          <div class="message-contents" style="float: right" v-if="!isPic">{{message.content}}<el-icon><Avatar/></el-icon></div>
          <el-image class="pic-msg" :src="pic_url" v-if="isPic" alt="加载啊。。。加载啊。。。" @load="onLoaded">
          </el-image>
        </el-row>
        <div class="message-details">{{message.time}} 发送人：{{message.send}}</div>
      </div>
    </el-row>
    <el-row justify="start" v-if="!isMe && this.myMessage.send !== this.adminIdentify">
      <div class="container">
        <el-row>
          <div class="message-contents" v-if="!isPic"><el-icon><Avatar/></el-icon>{{message.content}}</div>
          <el-image class="pic-msg" :src="pic_url" v-if="isPic" alt="加载啊。。。加载啊。。。" @load="onLoaded">
          </el-image>
<!--          <img class="image_placeholder" :src="this.pic_url" v-if="isPic">-->
        </el-row>
        <div class="message-details">{{message.time}} 发送人：{{message.send}}</div>
      </div>
    </el-row>
    <el-row justify="center" v-if="isAdmin">
      <div class="admin-container">
<!--        <el-row>-->
<!--          <div class="message-contents">管理员信息测试</div>-->
<!--        </el-row>-->
        系统提示：{{message.content}}
<!--        <el-image :src="pic_url"/>-->
      </div>
    </el-row>
  </div>
</template>

<script>
import { Avatar } from '@element-plus/icons-vue'
import {toRefs} from "vue";
// import {baseURL} from "@/config/baseConfig";

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
      myMessage: this.message,
      isAdmin: false,
      adminIdentify: 'adminnnn',
      pic_url: '',
      isPic: false
    }
  },
  methods: {
    onLoaded(e) {
      this.$emit('touchBottom')
      console.log('图片加载完成测试', e);
    },
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
    this.isAdmin = (this.myMessage.send === this.adminIdentify)
    this.isPic = (this.myMessage.content_type === 1)
    this.pic_url = this.myMessage.content
  },
  setup(props) {
    const prop_message = toRefs(props)
    return {
      prop_message
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/_handle.scss";

.message-contents{
  text-align: left;
  padding-left: 10px;
  border-radius: 10px;
  float: right;
  color: #f2f2f2;
  @include font_color('font_color1');
  word-break: break-all;
}
.message-details{
  font-size: 1px;
  padding-right: 10px;
  border-radius: 10px;
  text-align: right;
  color: #f2f2f2;
  @include font_color('font_color1')
}
.container{
  background-color: #6770ff;
  @include background-color('bubble_color1');
  width: 30%;
  border-radius: 10px;
  margin: 5px;
  box-shadow:2px 2px 5px #525252;
}
.my-container{
  background-color: #8b91ff;
  @include background-color('my_bubble_color1');
  width: 30%;
  border-radius: 10px;
  margin: 5px;
  box-shadow:2px 2px 5px #525252;
}
.admin-container{
  color: #fffaff;
  font-size: 1vh;
  background-color: #8c7e7e;
  width: 30%;
  border-radius: 5px;
  margin: 1px;
}
.el-image{
  width: 100%;
  height: 100%;
  position: center;
  border-radius: 10px;
}
.el-image >>> .el-image__placeholder{
  background: url('/src/assets/logo.png') no-repeat 50% 50% !important;
  background-size: 100% !important;
}

</style>
